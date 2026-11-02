import Dexie, { Table } from 'dexie';
import { Student, Competency, RemedialActivity, AssessmentRecord, RemedialPlan, SyncQueueItem } from '../types';
import { FLN_COMPETENCIES, REMEDIAL_ACTIVITIES } from '../data/curriculumData';
import {
  ALL_SCHOOL_STUDENTS,
  STATIC_REMEDIAL_PLANS,
  generateStaticAssessments
} from '../data/staticDatasets';

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

// Export all school students (40 students across 5th A, 6th A, 7th A, 8th A)
export const INITIAL_STUDENTS: Student[] = ALL_SCHOOL_STUDENTS;

export async function seedInitialDataIfEmpty() {
  const existingComp = await db.competencies.get('ENG-01');
  const count = await db.students.count();

  // If already seeded with all 40 students across classes, return early
  if (existingComp && count >= 40) {
    return;
  }

  // Clear obsolete data to ensure clean 4-class multi-grade dataset
  await db.competencies.clear();
  await db.activities.clear();
  await db.assessments.clear();
  await db.plans.clear();
  await db.students.clear();

  // 1. Seed 7 Core Academic Subject Competencies & Activities
  await db.competencies.bulkPut(FLN_COMPETENCIES);
  await db.activities.bulkPut(REMEDIAL_ACTIVITIES);

  // 2. Seed All 40 Students across 5th A, 6th A, 7th A, and 8th A
  await db.students.bulkPut(ALL_SCHOOL_STUDENTS);

  // 3. Generate Realistic Baseline and Follow-up Assessments across all 7 subjects
  const staticAssessments = generateStaticAssessments(ALL_SCHOOL_STUDENTS, FLN_COMPETENCIES);
  await db.assessments.bulkPut(staticAssessments);

  // 4. Seed Active, Approved, and Completed Remedial Plans for 5th A, 6th A, 7th A, and 8th A
  await db.plans.bulkPut(STATIC_REMEDIAL_PLANS);
}
