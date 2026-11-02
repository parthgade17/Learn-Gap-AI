import { createClient } from '@supabase/supabase-js';
import { AssessmentRecord, RemedialPlan } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://demo-placeholder.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'demo-anon-key'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Health check to test live connection to Supabase instance
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env. Running in offline IndexedDB mode.'
    };
  }

  try {
    const { error } = await supabase.from('assessments').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        message: `Connected to endpoint, but table query returned: ${error.message}`
      };
    }
    return {
      connected: true,
      message: 'Supabase database is connected and active in real-time sync mode.'
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase: ${err.message || err}`
    };
  }
}

/**
 * Synchronize assessment insertion with Supabase if online
 */
export async function syncAssessmentInsert(record: AssessmentRecord): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('assessments').upsert({
      id: record.id,
      student_id: record.student_id,
      competency_id: record.competency_id,
      assessment_type: record.assessment_type,
      score_obtained: record.score_obtained,
      total_marks: record.total_marks,
      assessed_at: record.assessed_at
    });
    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase insert failed, local changes retained:', err);
    return false;
  }
}

/**
 * Synchronize assessment marks update dynamically with Supabase
 */
export async function syncAssessmentUpdate(id: string, updates: Partial<AssessmentRecord>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload: any = {};
    if (updates.score_obtained !== undefined) dbPayload.score_obtained = updates.score_obtained;
    if (updates.total_marks !== undefined) dbPayload.total_marks = updates.total_marks;
    if (updates.assessment_type !== undefined) dbPayload.assessment_type = updates.assessment_type;
    if (updates.assessed_at !== undefined) dbPayload.assessed_at = updates.assessed_at;

    const { error } = await supabase
      .from('assessments')
      .update(dbPayload)
      .eq('id', id);

    if (error) {
      console.warn('Supabase update warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update failed, local changes retained:', err);
    return false;
  }
}

/**
 * Synchronize assessment deletion dynamically with Supabase
 */
export async function syncAssessmentDelete(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete failed, local changes retained:', err);
    return false;
  }
}

/**
 * Synchronize remedial plan creation / update dynamically with Supabase
 */
export async function syncRemedialPlan(plan: RemedialPlan): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('remedial_plans').upsert({
      id: plan.id,
      school_id: plan.school_id,
      grade: plan.grade,
      competency_id: plan.competency_id,
      activity_id: plan.activity_id,
      plan_date: plan.plan_date,
      student_ids: plan.student_ids,
      status: plan.status,
      teacher_notes: plan.teacher_notes,
      scheduled_day: plan.scheduled_day
    });

    if (error) {
      console.warn('Supabase plan upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase plan sync failed, local changes retained:', err);
    return false;
  }
}

/**
 * Subscribe to real-time changes on database to make UI dynamically reactive
 */
export function subscribeToRealtimeChanges(
  onAssessmentChange?: () => void,
  onPlanChange?: () => void
) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('learngap-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'assessments' },
      () => {
        if (onAssessmentChange) onAssessmentChange();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'remedial_plans' },
      () => {
        if (onPlanChange) onPlanChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
