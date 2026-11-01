import Dexie, { Table } from 'dexie';
import { Student, Competency, RemedialActivity, AssessmentRecord, RemedialPlan, SyncQueueItem } from '../types';
import { FLN_COMPETENCIES, REMEDIAL_ACTIVITIES } from '../data/curriculumData';

export class LearnGapDatabase extends Dexie {
  students!: Table<Student, string>;
  competencies!: Table<Competency, string>;
  activities!: Table<RemedialActivity, string>;
  assessments!: Table<AssessmentRecord, string>;
  plans!: Table<RemedialPlan, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super('LearnGapAIDB');
    this.version(1).stores({
      students: 'id, school_id, grade, section, roll_number',
      competencies: 'id, subject, grade, code',
      activities: 'id, competency_id, is_teacher_reviewed',
      assessments: 'id, student_id, competency_id, assessment_type, [student_id+competency_id]',
      plans: 'id, school_id, grade, competency_id, status, plan_date',
      syncQueue: 'id, table, created_at'
    });
  }
}

export const db = new LearnGapDatabase();

// Synthetic data for rural Zilla Parishad primary school (Kopargaon taluka)
export async function seedInitialDataIfEmpty() {
  const count = await db.students.count();
  if (count > 0) return;

  // 1. Seed Competencies & Activities
  await db.competencies.bulkPut(FLN_COMPETENCIES);
  await db.activities.bulkPut(REMEDIAL_ACTIVITIES);

  // 2. Seed 24 synthetic students for Grade 3 (DPDP compliant: roll numbers, synthetic aliases)
  const syntheticStudents: Student[] = [
    { id: 'std-301', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 1, student_alias: 'विद्यार्थी १ (Aarav)', parental_consent_verified: true },
    { id: 'std-302', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 2, student_alias: 'विद्यार्थी २ (Sakshi)', parental_consent_verified: true },
    { id: 'std-303', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 3, student_alias: 'विद्यार्थी ३ (Karan)', parental_consent_verified: true },
    { id: 'std-304', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 4, student_alias: 'विद्यार्थी ४ (Pooja)', parental_consent_verified: true },
    { id: 'std-305', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 5, student_alias: 'विद्यार्थी ५ (Omkar)', parental_consent_verified: true },
    { id: 'std-306', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 6, student_alias: 'विद्यार्थी ६ (Ananya)', parental_consent_verified: true },
    { id: 'std-307', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 7, student_alias: 'विद्यार्थी ७ (Tejas)', parental_consent_verified: true },
    { id: 'std-308', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 8, student_alias: 'विद्यार्थी ८ (Snehal)', parental_consent_verified: true },
    { id: 'std-309', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 9, student_alias: 'विद्यार्थी ९ (Rohan)', parental_consent_verified: true },
    { id: 'std-310', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 10, student_alias: 'विद्यार्थी १० (Gauri)', parental_consent_verified: true },
    { id: 'std-311', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 11, student_alias: 'विद्यार्थी ११ (Aditya)', parental_consent_verified: true },
    { id: 'std-312', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 12, student_alias: 'विद्यार्थी १२ (Komal)', parental_consent_verified: true },
    { id: 'std-313', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 13, student_alias: 'विद्यार्थी १३ (Sahil)', parental_consent_verified: true },
    { id: 'std-314', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 14, student_alias: 'विद्यार्थी १४ (Neha)', parental_consent_verified: true },
    { id: 'std-315', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 15, student_alias: 'विद्यार्थी १५ (Siddharth)', parental_consent_verified: true },
    { id: 'std-316', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 16, student_alias: 'विद्यार्थी १६ (Tanvi)', parental_consent_verified: true },
    { id: 'std-317', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 17, student_alias: 'विद्यार्थी १७ (Vedant)', parental_consent_verified: true },
    { id: 'std-318', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 18, student_alias: 'विद्यार्थी १८ (Divya)', parental_consent_verified: true },
    { id: 'std-319', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 19, student_alias: 'विद्यार्थी १९ (Mayur)', parental_consent_verified: true },
    { id: 'std-320', school_id: 'ZP-KPG-01', grade: 3, section: 'A', roll_number: 20, student_alias: 'विद्यार्थी २० (Prachi)', parental_consent_verified: true }
  ];

  await db.students.bulkPut(syntheticStudents);

  // 3. Seed Realistic Baseline Assessment Scores reflecting ASER 2024 rural findings:
  // (~33% pass subtraction, ~27% pass standard reading)
  const initialAssessments: AssessmentRecord[] = [];
  
  syntheticStudents.forEach((student, index) => {
    // Competency 1: Place Value (moderate performance ~ 55% average)
    const score1 = index % 3 === 0 ? 8 : (index % 2 === 0 ? 5 : 4);
    initialAssessments.push({
      id: `asmt-base-1-${student.id}`,
      student_id: student.id,
      competency_id: 'FLN-NUM-01',
      assessment_type: 'baseline',
      score_obtained: score1,
      total_marks: 10,
      percentage: (score1 / 10) * 100,
      assessed_at: '2026-10-15',
      synced: true
    });

    // Competency 2: Subtraction with Borrowing (severe shortfall - only ~30% above 60%)
    const score2 = index % 4 === 0 ? 7 : (index % 3 === 0 ? 4 : 2);
    initialAssessments.push({
      id: `asmt-base-2-${student.id}`,
      student_id: student.id,
      competency_id: 'FLN-NUM-02',
      assessment_type: 'baseline',
      score_obtained: score2,
      total_marks: 10,
      percentage: (score2 / 10) * 100,
      assessed_at: '2026-10-15',
      synced: true
    });

    // Competency 5: Conjunct Letters Reading
    const score5 = index % 3 === 1 ? 8 : 3;
    initialAssessments.push({
      id: `asmt-base-5-${student.id}`,
      student_id: student.id,
      competency_id: 'FLN-LIT-01',
      assessment_type: 'baseline',
      score_obtained: score5,
      total_marks: 10,
      percentage: (score5 / 10) * 100,
      assessed_at: '2026-10-15',
      synced: true
    });

    // Follow-up assessments for some students who already underwent the remedial cycle
    if (index < 10) {
      // Demonstrated recovery in subtraction after "Exchange Ten" activity
      const followUpScore2 = Math.min(10, score2 + 4);
      initialAssessments.push({
        id: `asmt-fol-2-${student.id}`,
        student_id: student.id,
        competency_id: 'FLN-NUM-02',
        assessment_type: 'follow_up',
        score_obtained: followUpScore2,
        total_marks: 10,
        percentage: (followUpScore2 / 10) * 100,
        assessed_at: '2026-10-28',
        synced: true
      });
    }
  });

  await db.assessments.bulkPut(initialAssessments);

  // 4. Seed an approved remedial plan
  const samplePlan: RemedialPlan = {
    id: 'plan-001',
    school_id: 'ZP-KPG-01',
    grade: 3,
    competency_id: 'FLN-NUM-02',
    activity_id: 'ACT-NUM-02-A',
    plan_date: '2026-10-20',
    student_ids: ['std-302', 'std-303', 'std-305', 'std-306', 'std-308', 'std-309'],
    status: 'completed',
    teacher_notes: 'विद्यार्थ्यांनी दुकानदाराचा खेळ आवडीने खेळला. दशकाकडून सुटे घेण्याची संकल्पना स्पष्ट झाली.',
    scheduled_day: 'सप्ताह ४ (सोमवार ते बुधवार)',
    created_at: '2026-10-18T10:00:00Z',
    synced: true
  };

  await db.plans.put(samplePlan);
}
