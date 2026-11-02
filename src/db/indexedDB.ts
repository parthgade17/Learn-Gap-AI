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

// 20 students for Zilla Parishad school (DPDP compliant: roll numbers, synthetic aliases)
export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-301', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 1, student_alias: 'विद्यार्थी १ (Aarav Patil)', parental_consent_verified: true },
  { id: 'std-302', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 2, student_alias: 'विद्यार्थी २ (Sakshi Deshmukh)', parental_consent_verified: true },
  { id: 'std-303', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 3, student_alias: 'विद्यार्थी ३ (Karan Shinde)', parental_consent_verified: true },
  { id: 'std-304', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 4, student_alias: 'विद्यार्थी ४ (Pooja Jadhav)', parental_consent_verified: true },
  { id: 'std-305', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 5, student_alias: 'विद्यार्थी ५ (Omkar Pawar)', parental_consent_verified: true },
  { id: 'std-306', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 6, student_alias: 'विद्यार्थी ६ (Ananya Kale)', parental_consent_verified: true },
  { id: 'std-307', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 7, student_alias: 'विद्यार्थी ७ (Tejas Gaikwad)', parental_consent_verified: true },
  { id: 'std-308', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 8, student_alias: 'विद्यार्थी ८ (Snehal More)', parental_consent_verified: true },
  { id: 'std-309', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 9, student_alias: 'विद्यार्थी ९ (Rohan Chavan)', parental_consent_verified: true },
  { id: 'std-310', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 10, student_alias: 'विद्यार्थी १० (Gauri Joshi)', parental_consent_verified: true },
  { id: 'std-311', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 11, student_alias: 'विद्यार्थी ११ (Aditya Wagh)', parental_consent_verified: true },
  { id: 'std-312', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 12, student_alias: 'विद्यार्थी १२ (Komal Sonawane)', parental_consent_verified: true },
  { id: 'std-313', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 13, student_alias: 'विद्यार्थी १३ (Sahil Thorat)', parental_consent_verified: true },
  { id: 'std-314', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 14, student_alias: 'विद्यार्थी १४ (Neha Londhe)', parental_consent_verified: true },
  { id: 'std-315', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 15, student_alias: 'विद्यार्थी १५ (Siddharth Gorde)', parental_consent_verified: true },
  { id: 'std-316', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 16, student_alias: 'विद्यार्थी १६ (Tanvi Kadam)', parental_consent_verified: true },
  { id: 'std-317', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 17, student_alias: 'विद्यार्थी १७ (Vedant Jagtap)', parental_consent_verified: true },
  { id: 'std-318', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 18, student_alias: 'विद्यार्थी १८ (Divya Salve)', parental_consent_verified: true },
  { id: 'std-319', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 19, student_alias: 'विद्यार्थी १९ (Mayur Bankar)', parental_consent_verified: true },
  { id: 'std-320', school_id: 'ZP-KPG-01', grade: 6, section: 'A', roll_number: 20, student_alias: 'विद्यार्थी २० (Prachi Tambe)', parental_consent_verified: true }
];

export async function seedInitialDataIfEmpty() {
  const existingComp = await db.competencies.get('ENG-01');
  const studentCount = await db.students.count();

  // If already up-to-date with 7 subjects, return early
  if (existingComp && studentCount >= 20) {
    return;
  }

  // Clear obsolete old records to ensure clean 7-subject data
  await db.competencies.clear();
  await db.activities.clear();
  await db.assessments.clear();
  await db.plans.clear();
  await db.students.clear();

  // 1. Seed 7-Subject Competencies & Activities
  await db.competencies.bulkPut(FLN_COMPETENCIES);
  await db.activities.bulkPut(REMEDIAL_ACTIVITIES);

  // 2. Seed 20 Students
  await db.students.bulkPut(INITIAL_STUDENTS);

  // 3. Generate Realistic Baseline and Follow-up Assessments across all 7 subjects
  const assessments: AssessmentRecord[] = [];
  const primaryCompetencyIds = [
    'ENG-01', 'ENG-02',
    'MATH-01', 'MATH-02', 'MATH-03',
    'SOC-01', 'SOC-02',
    'PHY-01', 'PHY-02',
    'CHEM-01', 'CHEM-02',
    'MAR-01', 'MAR-02',
    'HIN-01', 'HIN-02'
  ];

  INITIAL_STUDENTS.forEach((student, sIdx) => {
    primaryCompetencyIds.forEach((compId, cIdx) => {
      // Deterministic pseudo-realistic baseline score distribution
      // Vary by student index and subject difficulty
      let baseScore = 6;
      if (compId.startsWith('MATH') || compId.startsWith('PHY')) {
        // Higher difficulty: average 4-6 out of 10
        baseScore = ((sIdx * 3 + cIdx * 7) % 6) + 3; // 3 to 8
      } else if (compId.startsWith('MAR') || compId.startsWith('HIN')) {
        // Native tongue: average 6-9 out of 10
        baseScore = ((sIdx * 2 + cIdx * 5) % 5) + 5; // 5 to 9
      } else {
        // English / Chemistry / Social Science
        baseScore = ((sIdx + cIdx * 3) % 6) + 4; // 4 to 9
      }

      baseScore = Math.min(10, Math.max(2, baseScore));

      assessments.push({
        id: `asmt-base-${student.id}-${compId}`,
        student_id: student.id,
        competency_id: compId,
        assessment_type: 'baseline',
        score_obtained: baseScore,
        total_marks: 10,
        percentage: (baseScore / 10) * 100,
        assessed_at: '2026-10-15',
        synced: true
      });

      // Follow-up assessments for first 12 students to demonstrate learning recovery
      if (sIdx < 14) {
        // Recovery improvement (+1 to +3 marks for most, 1 persistent gap)
        let folScore = baseScore + ((sIdx + cIdx) % 3 === 0 ? 1 : 2);
        if (sIdx === 2 && compId === 'MATH-02') folScore = baseScore; // Persistent gap example
        folScore = Math.min(10, Math.max(baseScore, folScore));

        assessments.push({
          id: `asmt-fol-${student.id}-${compId}`,
          student_id: student.id,
          competency_id: compId,
          assessment_type: 'follow_up',
          score_obtained: folScore,
          total_marks: 10,
          percentage: (folScore / 10) * 100,
          assessed_at: '2026-10-28',
          synced: true
        });
      }
    });
  });

  await db.assessments.bulkPut(assessments);

  // 4. Seed initial active remedial plans
  const initialPlans: RemedialPlan[] = [
    {
      id: 'plan-seed-01',
      school_id: 'ZP-KPG-01',
      teacher_id: 'teacher-01',
      grade: 6,
      competency_id: 'MATH-01',
      activity_id: 'ACT-MATH-01',
      plan_date: '2026-10-18',
      student_ids: ['std-303', 'std-305', 'std-307', 'std-312'],
      status: 'completed',
      teacher_notes: 'Used base-10 bundle blocks and pebble sticks. Significant improvement observed in borrowing concept.',
      scheduled_day: 'Mon, Wed, Fri (2:30 PM)',
      created_at: '2026-10-17T10:00:00Z',
      synced: true
    },
    {
      id: 'plan-seed-02',
      school_id: 'ZP-KPG-01',
      teacher_id: 'teacher-01',
      grade: 6,
      competency_id: 'ENG-01',
      activity_id: 'ACT-ENG-01',
      plan_date: '2026-10-22',
      student_ids: ['std-302', 'std-304', 'std-309', 'std-314'],
      status: 'approved',
      teacher_notes: 'Bilingual picture flashcards and sentence cloze exercises prepared.',
      scheduled_day: 'Tue, Thu (11:00 AM)',
      created_at: '2026-10-21T09:30:00Z',
      synced: true
    },
    {
      id: 'plan-seed-03',
      school_id: 'ZP-KPG-01',
      teacher_id: 'teacher-01',
      grade: 6,
      competency_id: 'PHY-01',
      activity_id: 'ACT-PHY-01',
      plan_date: '2026-10-26',
      student_ids: ['std-301', 'std-306', 'std-308', 'std-311'],
      status: 'draft',
      teacher_notes: 'Hands-on ramp and toy friction experiment pending materials setup.',
      scheduled_day: 'Wednesday (1:45 PM)',
      created_at: '2026-10-25T14:15:00Z',
      synced: true
    }
  ];

  await db.plans.bulkPut(initialPlans);
}
