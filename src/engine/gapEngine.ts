import { Student, Competency, AssessmentRecord, GapDiagnosis, StudentGroup, RemedialActivity } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Data Quality Validator for manual entry and CSV imports
 * Flags missing, out-of-bounds, or inconsistent scores
 */
export function validateAssessmentRecord(
  score: number,
  totalMarks: number,
  rollNumber?: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (isNaN(score) || score === null || score === undefined) {
    errors.push('Score is missing or invalid (गुण प्रविष्ट केलेले नाहीत).');
  } else if (score < 0) {
    errors.push(`Score cannot be negative: ${score} (गुण उणे असू शकत नाहीत).`);
  } else if (score > totalMarks) {
    errors.push(`Score (${score}) exceeds maximum marks (${totalMarks}) (गुण कमाल गुणांपेक्षा जास्त आहेत).`);
  }

  if (totalMarks <= 0) {
    errors.push('Total marks must be greater than zero.');
  }

  if (rollNumber !== undefined && (isNaN(rollNumber) || rollNumber <= 0)) {
    warnings.push(`Unusual roll number: ${rollNumber}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Transparent Rule Engine for Gap Detection
 * Deterministic thresholding: runs 100% on-device without network
 */
export function diagnoseGaps(
  students: Student[],
  competencies: Competency[],
  assessments: AssessmentRecord[]
): GapDiagnosis[] {
  const diagnoses: GapDiagnosis[] = [];

  // Index assessments by student_id and competency_id
  const asmtMap = new Map<string, { baseline?: AssessmentRecord; followup?: AssessmentRecord }>();

  assessments.forEach(asmt => {
    const key = `${asmt.student_id}_${asmt.competency_id}`;
    if (!asmtMap.has(key)) {
      asmtMap.set(key, {});
    }
    const entry = asmtMap.get(key)!;
    if (asmt.assessment_type === 'baseline') {
      entry.baseline = asmt;
    } else if (asmt.assessment_type === 'follow_up') {
      entry.followup = asmt;
    }
  });

  students.forEach(student => {
    competencies.forEach(comp => {
      const key = `${student.id}_${comp.id}`;
      const entry = asmtMap.get(key);

      if (entry?.baseline) {
        const basePct = entry.baseline.percentage;
        const folPct = entry.followup?.percentage;
        const threshold = comp.threshold_passing_pct;
        const currentPct = folPct !== undefined ? folPct : basePct;
        const needsRemediation = currentPct < threshold;

        let severity: 'high' | 'moderate' | 'mastered' = 'mastered';
        if (currentPct < 40) {
          severity = 'high';
        } else if (currentPct < threshold) {
          severity = 'moderate';
        }

        let reasoning = '';
        if (severity === 'high') {
          reasoning = `Score (${Math.round(currentPct)}%) is significantly below benchmark of ${threshold}%. Requires immediate hands-on remedial intervention.`;
        } else if (severity === 'moderate') {
          reasoning = `Score (${Math.round(currentPct)}%) is approaching benchmark (${threshold}%). Targeted practice activity recommended.`;
        } else {
          reasoning = `Competency mastered (${Math.round(currentPct)}% >= ${threshold}%). Eligible for enrichment tasks.`;
        }

        diagnoses.push({
          student_id: student.id,
          student_alias: student.student_alias,
          roll_number: student.roll_number,
          grade: student.grade,
          competency_id: comp.id,
          competency_title: comp.title_en,
          subject: comp.subject,
          baseline_pct: basePct,
          followup_pct: folPct,
          threshold_pct: threshold,
          needs_remediation: needsRemediation,
          severity,
          reasoning
        });
      }
    });
  });

  return diagnoses;
}

/**
 * Groups learners who share identical competency gaps for classroom remediation
 */
export function groupLearnersForRemediation(
  diagnoses: GapDiagnosis[],
  students: Student[],
  competencies: Competency[],
  activities: RemedialActivity[]
): StudentGroup[] {
  const groups: StudentGroup[] = [];

  competencies.forEach(comp => {
    // Find all students needing remediation on this competency
    const struggling = diagnoses.filter(
      d => d.competency_id === comp.id && d.needs_remediation
    );

    if (struggling.length > 0) {
      const studentMap = new Map(students.map(s => [s.id, s]));

      const groupedStudents = struggling.map(d => ({
        student: studentMap.get(d.student_id) || {
          id: d.student_id,
          school_id: 'UNKNOWN',
          grade: d.grade,
          section: 'A',
          roll_number: d.roll_number,
          student_alias: d.student_alias,
          parental_consent_verified: true
        },
        score_pct: d.followup_pct !== undefined ? d.followup_pct : d.baseline_pct
      }));

      // Find best matched teacher-reviewed activity from bank
      const matchedActivity = activities.find(a => a.competency_id === comp.id) || {
        id: `ACT-DEFAULT-${comp.id}`,
        competency_id: comp.id,
        title_en: `${comp.title_en} Guided Practice`,
        title_mr: `${comp.title_mr} मार्गदर्शन सराव`,
        instructions_en: 'Conduct peer paired problem solving with teacher facilitation.',
        instructions_mr: 'शिक्षकांच्या मार्गदर्शनाखाली जोडीने उदाहरणे सोडवण्याचा सराव घ्या.',
        materials_needed_en: 'Slate, chalk, textbook.',
        materials_needed_mr: 'पाटी, खडू, पाठ्यपुस्तक.',
        estimated_minutes: 20,
        is_teacher_reviewed: true,
        pedagogical_reason_en: 'Strengthens foundational grasp through targeted peer scaffolding.',
        pedagogical_reason_mr: 'सहकारी शिक्षणातून पायाभूत संकल्पना दृढ होतात.'
      };

      const highSeverityCount = struggling.filter(s => s.severity === 'high').length;
      const urgency = highSeverityCount >= struggling.length / 2 ? 'high' : 'moderate';

      groups.push({
        competency: comp,
        students: groupedStudents,
        suggestedActivity: matchedActivity,
        urgency,
        reasoning_en: `${struggling.length} students scored below ${comp.threshold_passing_pct}%. Focus on "${matchedActivity.title_en}" for concrete understanding.`,
        reasoning_mr: `${struggling.length} विद्यार्थ्यांना ${comp.threshold_passing_pct}% पेक्षा कमी गुण मिळाले आहेत. संकल्पना स्पष्टतेसाठी "${matchedActivity.title_mr}" ही कृती सुचवण्यात आली आहे.`
      });
    }
  });

  // Sort groups by urgency (high first, then largest group size)
  return groups.sort((a, b) => {
    if (a.urgency === 'high' && b.urgency !== 'high') return -1;
    if (a.urgency !== 'high' && b.urgency === 'high') return 1;
    return b.students.length - a.students.length;
  });
}

/**
 * Closed-Loop Comparison: Baseline vs Follow-up recovery tracking
 */
export function calculateRemediationMetrics(
  competencies: Competency[],
  assessments: AssessmentRecord[]
) {
  const metrics = competencies.map(comp => {
    const compAsmts = assessments.filter(a => a.competency_id === comp.id);
    const baselineAsmts = compAsmts.filter(a => a.assessment_type === 'baseline');
    const followupAsmts = compAsmts.filter(a => a.assessment_type === 'follow_up');

    const totalStudentsAssessed = baselineAsmts.length;
    if (totalStudentsAssessed === 0) {
      return {
        competency: comp,
        baselineAverage: 0,
        followupAverage: 0,
        baselinePassRate: 0,
        followupPassRate: 0,
        netGainPct: 0,
        remediatedCount: 0,
        persistentGapCount: 0,
        hasFollowup: false
      };
    }

    const baselineSum = baselineAsmts.reduce((sum, a) => sum + a.percentage, 0);
    const baselineAverage = Math.round(baselineSum / baselineAsmts.length);
    const baselinePassCount = baselineAsmts.filter(a => a.percentage >= comp.threshold_passing_pct).length;
    const baselinePassRate = Math.round((baselinePassCount / baselineAsmts.length) * 100);

    let followupAverage = 0;
    let followupPassRate = 0;
    let remediatedCount = 0;
    let persistentGapCount = 0;
    const hasFollowup = followupAsmts.length > 0;

    if (hasFollowup) {
      const followupSum = followupAsmts.reduce((sum, a) => sum + a.percentage, 0);
      followupAverage = Math.round(followupSum / followupAsmts.length);
      const followupPassCount = followupAsmts.filter(a => a.percentage >= comp.threshold_passing_pct).length;
      followupPassRate = Math.round((followupPassCount / followupAsmts.length) * 100);

      // Compare student by student
      const baselineMap = new Map(baselineAsmts.map(a => [a.student_id, a.percentage]));
      followupAsmts.forEach(f => {
        const bPct = baselineMap.get(f.student_id);
        if (bPct !== undefined && bPct < comp.threshold_passing_pct) {
          if (f.percentage >= comp.threshold_passing_pct) {
            remediatedCount++;
          } else {
            persistentGapCount++;
          }
        }
      });
    }

    return {
      competency: comp,
      baselineAverage,
      followupAverage,
      baselinePassRate,
      followupPassRate,
      netGainPct: followupPassRate - baselinePassRate,
      remediatedCount,
      persistentGapCount,
      hasFollowup
    };
  });

  return metrics;
}
