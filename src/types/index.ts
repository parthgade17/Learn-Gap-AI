export type SubjectType = 
  | 'English'
  | 'Mathematics'
  | 'Social Science'
  | 'Physics'
  | 'Chemistry'
  | 'Marathi'
  | 'Hindi';

export type UserRole = 'teacher' | 'head_teacher' | 'block_officer';

export type AssessmentType = 'baseline' | 'follow_up';

export interface Student {
  id: string;
  school_id: string;
  grade: number;
  section: string;
  roll_number: number;
  student_alias: string; // e.g. "Learner #01" or optional name
  parental_consent_verified: boolean;
  created_at?: string;
}

export interface Competency {
  id: string; // e.g., 'ENG-01', 'MATH-02', etc.
  subject: SubjectType;
  grade: number;
  code: string;
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
  threshold_passing_pct: number; // default 60%
}

export interface RemedialActivity {
  id: string;
  competency_id: string;
  title_en: string;
  title_mr: string;
  instructions_en: string;
  instructions_mr: string;
  materials_needed_en: string;
  materials_needed_mr: string;
  estimated_minutes: number;
  is_teacher_reviewed: boolean;
  pedagogical_reason_en: string;
  pedagogical_reason_mr: string;
}

export interface AssessmentRecord {
  id: string;
  student_id: string;
  competency_id: string;
  assessment_type: AssessmentType;
  score_obtained: number;
  total_marks: number;
  percentage: number;
  assessed_at: string;
  synced?: boolean;
}

export interface GapDiagnosis {
  student_id: string;
  student_alias: string;
  roll_number: number;
  grade: number;
  competency_id: string;
  competency_title: string;
  subject: SubjectType;
  baseline_pct: number;
  followup_pct?: number;
  threshold_pct: number;
  needs_remediation: boolean;
  severity: 'high' | 'moderate' | 'mastered';
  reasoning: string;
}

export interface StudentGroup {
  competency: Competency;
  students: {
    student: Student;
    score_pct: number;
  }[];
  suggestedActivity: RemedialActivity;
  urgency: 'high' | 'moderate';
  reasoning_en: string;
  reasoning_mr: string;
}

export interface RemedialPlan {
  id: string;
  school_id: string;
  teacher_id?: string;
  grade: number;
  competency_id: string;
  activity_id: string;
  plan_date: string;
  student_ids: string[];
  status: 'draft' | 'approved' | 'completed';
  teacher_notes: string;
  scheduled_day?: string;
  created_at: string;
  synced?: boolean;
}

export interface SyncQueueItem {
  id: string;
  action: 'insert' | 'update' | 'delete';
  table: 'assessments' | 'students' | 'remedial_plans';
  payload: any;
  created_at: string;
}

// AI-Based Prediction Engine Models
export interface StudentAIPrediction {
  student_id: string;
  student_alias: string;
  roll_number: number;
  current_overall_pct: number;
  predicted_mastery_pct: number;
  predicted_gain_pct: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  recovery_velocity_days: number;
  confidence_score: number;
  learning_velocity: number; // rate of growth per week
  recommended_action_en: string;
  recommended_action_mr: string;
  subject_predictions: {
    subject: SubjectType;
    current_pct: number;
    predicted_pct: number;
    risk: 'low' | 'medium' | 'high';
  }[];
}

export interface CohortAIPrediction {
  projected_class_pass_rate: number;
  current_class_pass_rate: number;
  stagnation_risk_pct: number;
  estimated_weeks_to_goal: number;
  most_vulnerable_subject: SubjectType;
  strongest_subject: SubjectType;
  high_impact_activity_title: string;
  ai_insights_en: string[];
  ai_insights_mr: string[];
}
