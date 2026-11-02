import { createClient } from '@supabase/supabase-js';
import { AssessmentRecord, RemedialPlan } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://demo-placeholder.supabase.co' &&
  import.meta.env.VITE_SUPABASE_URL.trim().length > 10 &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'demo-anon-key' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY.trim().length > 10
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Health check to test live connection to Supabase instance and inspect row count
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  rowCount?: number;
  isRlsIssue?: boolean;
}> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env. Running in offline IndexedDB mode.',
      rowCount: 0
    };
  }

  try {
    // 1. Check if table is reachable and count rows
    const { count, error } = await supabase
      .from('assessments')
      .select('id', { count: 'exact', head: true });

    if (error) {
      const isRls = error.message.toLowerCase().includes('row-level security') ||
                    error.message.toLowerCase().includes('policy') ||
                    error.code === '42501';

      return {
        connected: false,
        message: `Connected to Supabase, but query returned: ${error.message}`,
        isRlsIssue: isRls,
        rowCount: 0
      };
    }

    return {
      connected: true,
      message: `Supabase database connected! Table 'assessments' currently has ${count ?? 0} rows.`,
      rowCount: count ?? 0
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase: ${err.message || err}`,
      rowCount: 0
    };
  }
}

/**
 * Robust Upsert of an Assessment Record to Supabase
 * Ensures that whether an item already exists in the cloud DB or is only in local IndexedDB,
 * it will be successfully inserted or updated.
 */
export async function syncAssessmentUpsert(record: AssessmentRecord): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials not configured in .env' };
  }

  try {
    // Exclude generated columns like percentage
    const payload = {
      id: record.id,
      student_id: record.student_id,
      competency_id: record.competency_id,
      assessment_type: record.assessment_type,
      score_obtained: Number(record.score_obtained),
      total_marks: Number(record.total_marks),
      assessed_at: record.assessed_at || new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase
      .from('assessments')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase assessments upsert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase upsert exception:', err);
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Synchronize assessment insertion with Supabase if online
 */
export async function syncAssessmentInsert(record: AssessmentRecord): Promise<boolean> {
  const result = await syncAssessmentUpsert(record);
  return result.success;
}

/**
 * Synchronize assessment marks update dynamically with Supabase.
 * If fullRecord is supplied, it does an upsert so that previously unsynced local rows get created.
 */
export async function syncAssessmentUpdate(
  id: string,
  updates: Partial<AssessmentRecord>,
  fullRecord?: AssessmentRecord
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  if (fullRecord) {
    const result = await syncAssessmentUpsert(fullRecord);
    return result.success;
  }

  try {
    const dbPayload: Record<string, any> = {};
    if (updates.score_obtained !== undefined) dbPayload.score_obtained = Number(updates.score_obtained);
    if (updates.total_marks !== undefined) dbPayload.total_marks = Number(updates.total_marks);
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
 * Push all local classroom assessments to Supabase in chunks of 50.
 * Perfect for initial migration and bulk syncing.
 */
export async function syncAllAssessmentsToSupabase(
  records: AssessmentRecord[],
  onProgress?: (synced: number, total: number) => void
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, count: 0, error: 'Supabase credentials not configured in .env' };
  }

  if (!records || records.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const BATCH_SIZE = 50;
    let syncedCount = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE).map(r => ({
        id: r.id,
        student_id: r.student_id,
        competency_id: r.competency_id,
        assessment_type: r.assessment_type,
        score_obtained: Number(r.score_obtained),
        total_marks: Number(r.total_marks),
        assessed_at: r.assessed_at || new Date().toISOString().split('T')[0]
      }));

      const { error } = await supabase
        .from('assessments')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error('Batch sync error to Supabase assessments:', error);
        return { success: false, count: syncedCount, error: error.message };
      }

      syncedCount += batch.length;
      onProgress?.(syncedCount, records.length);
    }

    return { success: true, count: syncedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || String(err) };
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
    }, { onConflict: 'id' });

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
