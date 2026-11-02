import { Student, RemedialPlan, AssessmentRecord, Competency } from '../types';

// =========================================================================
// STATIC DATASET FOR 5TH A, 6TH A, 7TH A, AND 8TH A
// Zilla Parishad Primary & Upper Primary School (UDISE: 27260501234)
// Kopargaon Taluka, Ahilyanagar District, Maharashtra
// DPDP Act 2023 Compliant: Roll numbers & Parental Consent Verified
// =========================================================================

// 1. CLASS 5TH - SECTION A (इयत्ता ५ वी - तुकडी अ)
export const CLASS_5TH_A_STUDENTS: Student[] = [
  { id: 'std-501', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 1, student_alias: 'विद्यार्थी १ (Aarav Patil)', parental_consent_verified: true },
  { id: 'std-502', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 2, student_alias: 'विद्यार्थी २ (Sakshi Deshmukh)', parental_consent_verified: true },
  { id: 'std-503', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 3, student_alias: 'विद्यार्थी ३ (Karan Shinde)', parental_consent_verified: true },
  { id: 'std-504', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 4, student_alias: 'विद्यार्थी ४ (Pooja Jadhav)', parental_consent_verified: true },
  { id: 'std-505', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 5, student_alias: 'विद्यार्थी ५ (Omkar Pawar)', parental_consent_verified: true },
  { id: 'std-506', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 6, student_alias: 'विद्यार्थी ६ (Priya Gaikwad)', parental_consent_verified: true },
  { id: 'std-507', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 7, student_alias: 'विद्यार्थी ७ (Yash Sonawane)', parental_consent_verified: true },
  { id: 'std-508', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 8, student_alias: 'विद्यार्थी ८ (Sneha Kadam)', parental_consent_verified: true },
  { id: 'std-509', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 9, student_alias: 'विद्यार्थी ९ (Rohit More)', parental_consent_verified: true },
  { id: 'std-510', school_id: 'ZP-KPG-01', grade: 5, section: 'A', roll_number: 10, student_alias: 'विद्यार्थी १० (Anjali Wagh)', parental_consent_verified: true },
];

// 2. CLASS 6TH - SECTION A (इयत्ता ६ वी - तुकडी अ)
export const CLASS_6TH_A_STUDENTS: Student[] = [
  { id: 'std-601', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 1, student_alias: 'विद्यार्थी १ (Ananya Kale)', parental_consent_verified: true },
  { id: 'std-602', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 2, student_alias: 'विद्यार्थी २ (Tejas Gaikwad)', parental_consent_verified: true },
  { id: 'std-603', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 3, student_alias: 'विद्यार्थी ३ (Snehal More)', parental_consent_verified: true },
  { id: 'std-604', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 4, student_alias: 'विद्यार्थी ४ (Rohan Chavan)', parental_consent_verified: true },
  { id: 'std-605', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 5, student_alias: 'विद्यार्थी ५ (Gauri Joshi)', parental_consent_verified: true },
  { id: 'std-606', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 6, student_alias: 'विद्यार्थी ६ (Mayuresh Borse)', parental_consent_verified: true },
  { id: 'std-607', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 7, student_alias: 'विद्यार्थी ७ (Kalyani Darekar)', parental_consent_verified: true },
  { id: 'std-608', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 8, student_alias: 'विद्यार्थी ८ (Abhishek Shelke)', parental_consent_verified: true },
  { id: 'std-609', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 9, student_alias: 'विद्यार्थी ९ (Rupali Gite)', parental_consent_verified: true },
  { id: 'std-610', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 10, student_alias: 'विद्यार्थी १० (Digambar Kokate)', parental_consent_verified: true },
];

// 3. CLASS 7TH - SECTION A (इयत्ता ७ वी - तुकडी अ)
export const CLASS_7TH_A_STUDENTS: Student[] = [
  { id: 'std-701', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 1, student_alias: 'विद्यार्थी १ (Aditya Wagh)', parental_consent_verified: true },
  { id: 'std-702', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 2, student_alias: 'विद्यार्थी २ (Komal Sonawane)', parental_consent_verified: true },
  { id: 'std-703', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 3, student_alias: 'विद्यार्थी ३ (Sahil Thorat)', parental_consent_verified: true },
  { id: 'std-704', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 4, student_alias: 'विद्यार्थी ४ (Neha Londhe)', parental_consent_verified: true },
  { id: 'std-705', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 5, student_alias: 'विद्यार्थी ५ (Siddharth Gorde)', parental_consent_verified: true },
  { id: 'std-706', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 6, student_alias: 'विद्यार्थी ६ (Rutuja Shinde)', parental_consent_verified: true },
  { id: 'std-707', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 7, student_alias: 'विद्यार्थी ७ (Nilesh Jagtap)', parental_consent_verified: true },
  { id: 'std-708', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 8, student_alias: 'विद्यार्थी ८ (Pallavi Bankar)', parental_consent_verified: true },
  { id: 'std-709', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 9, student_alias: 'विद्यार्थी ९ (Harshal Tambe)', parental_consent_verified: true },
  { id: 'std-710', school_id: 'ZP-KPG-01', grade: 7, section: 'A', roll_number: 10, student_alias: 'विद्यार्थी १० (Megha Joshi)', parental_consent_verified: true },
];

// 4. CLASS 8TH - SECTION A (इयत्ता ८ वी - तुकडी अ)
export const CLASS_8TH_A_STUDENTS: Student[] = [
  { id: 'std-801', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 1, student_alias: 'विद्यार्थी १ (Tanvi Kadam)', parental_consent_verified: true },
  { id: 'std-802', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 2, student_alias: 'विद्यार्थी २ (Vedant Jagtap)', parental_consent_verified: true },
  { id: 'std-803', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 3, student_alias: 'विद्यार्थी ३ (Divya Salve)', parental_consent_verified: true },
  { id: 'std-804', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 4, student_alias: 'विद्यार्थी ४ (Mayur Bankar)', parental_consent_verified: true },
  { id: 'std-805', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 5, student_alias: 'विद्यार्थी ५ (Prachi Tambe)', parental_consent_verified: true },
  { id: 'std-806', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 6, student_alias: 'विद्यार्थी ६ (Swapnil Kale)', parental_consent_verified: true },
  { id: 'std-807', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 7, student_alias: 'विद्यार्थी ७ (Shraddha Deshmukh)', parental_consent_verified: true },
  { id: 'std-808', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 8, student_alias: 'विद्यार्थी ८ (Akshay Chavan)', parental_consent_verified: true },
  { id: 'std-809', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 9, student_alias: 'विद्यार्थी ९ (Tejaswini Patil)', parental_consent_verified: true },
  { id: 'std-810', school_id: 'ZP-KPG-01', grade: 8, section: 'A', roll_number: 10, student_alias: 'विद्यार्थी १० (Gaurav More)', parental_consent_verified: true },
];

// All 40 students across 5th A, 6th A, 7th A, and 8th A
export const ALL_SCHOOL_STUDENTS: Student[] = [
  ...CLASS_5TH_A_STUDENTS,
  ...CLASS_6TH_A_STUDENTS,
  ...CLASS_7TH_A_STUDENTS,
  ...CLASS_8TH_A_STUDENTS,
];

// =========================================================================
// STATIC REMEDIAL PLANS FOR 5TH A, 6TH A, 7TH A, AND 8TH A
// =========================================================================
export const STATIC_REMEDIAL_PLANS: RemedialPlan[] = [
  // Class 5th A Remedial Plans
  {
    id: 'plan-5th-01',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-5th',
    grade: 5,
    competency_id: 'MATH-01',
    activity_id: 'ACT-MATH-01',
    plan_date: '2026-10-18',
    student_ids: ['std-503', 'std-505', 'std-507', 'std-509'],
    status: 'completed',
    teacher_notes: '१० काड्यांचे दशक बंडल व सुट्या काड्या वापरून प्रत्यक्ष हातच्याची वजाबाकी सराव यशस्वीरीत्या पूर्ण झाला.',
    scheduled_day: 'सोमवार, बुधवार (सकाळी १०:३०)',
    created_at: '2026-10-17T09:00:00Z',
    synced: true
  },
  {
    id: 'plan-5th-02',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-5th',
    grade: 5,
    competency_id: 'ENG-01',
    activity_id: 'ACT-ENG-01',
    plan_date: '2026-10-22',
    student_ids: ['std-502', 'std-504', 'std-508', 'std-510'],
    status: 'approved',
    teacher_notes: 'Bilingual illustrated flashcard drill for contextual vocabulary.',
    scheduled_day: 'मंगळवार, गुरुवार (दुपारी २:१५)',
    created_at: '2026-10-21T10:30:00Z',
    synced: true
  },

  // Class 6th A Remedial Plans
  {
    id: 'plan-6th-01',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-6th',
    grade: 6,
    competency_id: 'MATH-02',
    activity_id: 'ACT-MATH-01',
    plan_date: '2026-10-20',
    student_ids: ['std-602', 'std-604', 'std-607', 'std-608'],
    status: 'approved',
    teacher_notes: 'Fractions paper strip folding and pizza slices visualization.',
    scheduled_day: 'सोमवार, गुरुवार (सकाळी ११:१५)',
    created_at: '2026-10-19T08:30:00Z',
    synced: true
  },
  {
    id: 'plan-6th-02',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-6th',
    grade: 6,
    competency_id: 'MAR-01',
    activity_id: 'ACT-ENG-01',
    plan_date: '2026-10-24',
    student_ids: ['std-603', 'std-605', 'std-609'],
    status: 'completed',
    teacher_notes: 'मराठी जोडाक्षरे शुद्धलेखन व विरामचिन्हे फलक सराव.',
    scheduled_day: 'बुधवार, शुक्रवार (दुपारी १:४५)',
    created_at: '2026-10-23T11:00:00Z',
    synced: true
  },

  // Class 7th A Remedial Plans
  {
    id: 'plan-7th-01',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-7th',
    grade: 7,
    competency_id: 'PHY-01',
    activity_id: 'ACT-PHY-01',
    plan_date: '2026-10-25',
    student_ids: ['std-701', 'std-703', 'std-707', 'std-709'],
    status: 'approved',
    teacher_notes: 'घर्षण बल प्रत्यक्ष उताराचा प्रयोग: खडबडीत गोणपाट vs गुळगुळीत फळीवर गाडी पळवून अंतर मोजणे.',
    scheduled_day: 'बुधवार (दुपारी २:००)',
    created_at: '2026-10-24T10:15:00Z',
    synced: true
  },
  {
    id: 'plan-7th-02',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-7th',
    grade: 7,
    competency_id: 'SOC-01',
    activity_id: 'ACT-ENG-01',
    plan_date: '2026-10-26',
    student_ids: ['std-702', 'std-705', 'std-708'],
    status: 'completed',
    teacher_notes: 'नकाशा वाचन: दिशा दर्शक कंपास व कोपरगाव तालुका नकाशावर खुणा ओळखणे.',
    scheduled_day: 'शुक्रवार (सकाळी ९:४५)',
    created_at: '2026-10-25T13:00:00Z',
    synced: true
  },

  // Class 8th A Remedial Plans
  {
    id: 'plan-8th-01',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-8th',
    grade: 8,
    competency_id: 'CHEM-01',
    activity_id: 'ACT-PHY-01',
    plan_date: '2026-10-27',
    student_ids: ['std-803', 'std-804', 'std-807', 'std-810'],
    status: 'draft',
    teacher_notes: 'भौतिक व रासायनिक बदल प्रयोग: मेणबत्ती वितळणे (भौतिक) आणि लाकूड जळणे (रासायनिक) प्रत्यक्ष प्रात्यक्षिक.',
    scheduled_day: 'गुरुवार (दुपारी २:३०)',
    created_at: '2026-10-26T14:30:00Z',
    synced: true
  },
  {
    id: 'plan-8th-02',
    school_id: 'ZP-KPG-01',
    teacher_id: 'teacher-8th',
    grade: 8,
    competency_id: 'MATH-03',
    activity_id: 'ACT-MATH-01',
    plan_date: '2026-10-29',
    student_ids: ['std-801', 'std-805', 'std-808'],
    status: 'approved',
    teacher_notes: 'Practical geometry: classroom blackboard and table perimeter measurement using meter tape.',
    scheduled_day: 'सोमवार (दुपारी १:३०)',
    created_at: '2026-10-28T09:15:00Z',
    synced: true
  }
];

// =========================================================================
// STATIC MARKS GENERATION FOR ALL 7 SUBJECTS
// Generates realistic Baseline (आरंभिक) and Follow-Up (उपचारात्मक) assessments
// =========================================================================
export function generateStaticAssessments(
  students: Student[],
  competencies: Competency[]
): AssessmentRecord[] {
  const assessments: AssessmentRecord[] = [];

  students.forEach((student, sIdx) => {
    competencies.forEach((comp, cIdx) => {
      // Deterministic baseline distribution reflecting grade and subject difficulty
      let base = 6;
      const compId = comp.id;

      if (compId.startsWith('MATH') || compId.startsWith('PHY')) {
        base = ((sIdx * 3 + cIdx * 7 + student.grade) % 6) + 3; // 3 to 8
      } else if (compId.startsWith('MAR') || compId.startsWith('HIN')) {
        base = ((sIdx * 2 + cIdx * 5 + student.grade) % 5) + 5; // 5 to 9
      } else {
        base = ((sIdx + cIdx * 3 + student.grade) % 6) + 4; // 4 to 9
      }

      base = Math.min(10, Math.max(2, base));

      // 1. Baseline Assessment
      assessments.push({
        id: `asmt-b-${student.id}-${compId}`,
        student_id: student.id,
        competency_id: compId,
        assessment_type: 'baseline',
        score_obtained: base,
        total_marks: 10,
        percentage: (base / 10) * 100,
        assessed_at: '2026-10-15',
        synced: true
      });

      // 2. Follow-Up Assessment (demonstrates learning recovery and persistent gaps)
      // Provide follow-ups for ~75% of learners
      if (sIdx % 4 !== 3) {
        let fol = base + ((sIdx + cIdx) % 3 === 0 ? 1 : 2.5);

        // Intentional persistent learning gap examples for pedagogical demonstration:
        if (student.roll_number === 3 && compId === 'MATH-01') fol = base;
        if (student.roll_number === 7 && compId === 'PHY-01') fol = base;

        fol = Math.min(10, Math.max(base, Math.round(fol)));

        assessments.push({
          id: `asmt-f-${student.id}-${compId}`,
          student_id: student.id,
          competency_id: compId,
          assessment_type: 'follow_up',
          score_obtained: fol,
          total_marks: 10,
          percentage: (fol / 10) * 100,
          assessed_at: '2026-10-28',
          synced: true
        });
      }
    });
  });

  return assessments;
}

/**
 * Generates ready-to-download CSV marksheet text for any given grade
 */
export function generateClassCSV(
  grade: number,
  students: Student[],
  assessments: AssessmentRecord[],
  competencies: Competency[]
): string {
  const classStudents = students.filter(s => s.grade === grade);
  const classStudentIds = new Set(classStudents.map(s => s.id));
  const classAsmts = assessments.filter(a => classStudentIds.has(a.student_id));

  let csv = "roll_number,student_name,grade,section,subject,competency_code,assessment_type,score_obtained,total_marks,percentage,status\n";

  classAsmts.forEach(asmt => {
    const std = classStudents.find(s => s.id === asmt.student_id);
    const comp = competencies.find(c => c.id === asmt.competency_id);
    if (!std || !comp) return;

    const isMastered = asmt.percentage >= comp.threshold_passing_pct;
    const status = isMastered ? "Mastered" : "Learning_Gap";

    csv += `${std.roll_number},"${std.student_alias}",${std.grade},${std.section},${comp.subject},${comp.code},${asmt.assessment_type},${asmt.score_obtained},${asmt.total_marks},${asmt.percentage}%,${status}\n`;
  });

  return csv;
}
