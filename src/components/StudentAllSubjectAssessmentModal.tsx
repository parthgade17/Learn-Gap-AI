import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  CheckCircle2,
  Save
} from 'lucide-react';
import { Student, Competency, AssessmentRecord, SubjectType } from '../types';
import { getSubjectName, formatClassDisplay, getCompetencyTitle, getCompetencyDescription, formatStudentDisplay, ALL_SUBJECTS } from '../data/curriculumData';
import { bufferAssessmentToRedis } from '../lib/redisBufferClient';

interface StudentAllSubjectAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  competencies: Competency[];
  assessments: AssessmentRecord[];
  onSaveAssessment: (record: Omit<AssessmentRecord, 'id'>) => Promise<void>;
}

export const StudentAllSubjectAssessmentModal: React.FC<StudentAllSubjectAssessmentModalProps> = ({
  isOpen,
  onClose,
  student,
  competencies,
  assessments,
  onSaveAssessment
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [activeSubject, setActiveSubject] = useState<SubjectType>('Mathematics');
  const [editingScores, setEditingScores] = useState<Record<string, { baseline: string; followup: string }>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [redisNotice, setRedisNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter student's existing assessments
  const studentAssessments = assessments.filter(a => a.student_id === student.id);
  const subjectCompetencies = competencies.filter(c => c.subject === activeSubject);

  // Helper to get score for a competency
  const getExistingScore = (compId: string, type: 'baseline' | 'follow_up'): number | undefined => {
    const match = studentAssessments.find(a => a.competency_id === compId && a.assessment_type === type);
    return match?.score_obtained;
  };

  const handleScoreChange = (compId: string, type: 'baseline' | 'followup', value: string) => {
    setEditingScores(prev => ({
      ...prev,
      [compId]: {
        baseline: type === 'baseline' ? value : (prev[compId]?.baseline ?? getExistingScore(compId, 'baseline')?.toString() ?? ''),
        followup: type === 'followup' ? value : (prev[compId]?.followup ?? getExistingScore(compId, 'follow_up')?.toString() ?? '')
      }
    }));
  };

  const handleSaveCompetency = async (comp: Competency) => {
    const current = editingScores[comp.id] || {};
    const baseStr = current.baseline ?? getExistingScore(comp.id, 'baseline')?.toString() ?? '';
    const folStr = current.followup ?? getExistingScore(comp.id, 'follow_up')?.toString() ?? '';

    setSavingKey(comp.id);
    setSaveSuccessNotice(null);
    setRedisNotice(null);

    try {
      // Save Baseline if provided
      if (baseStr.trim() !== '') {
        const scoreNum = parseFloat(baseStr);
        if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 10) {
          const baseRec: Omit<AssessmentRecord, 'id'> = {
            student_id: student.id,
            competency_id: comp.id,
            assessment_type: 'baseline',
            score_obtained: scoreNum,
            total_marks: 10,
            percentage: (scoreNum / 10) * 100,
            assessed_at: new Date().toISOString().split('T')[0]
          };

          // 1. Save to local Dexie IndexedDB
          await onSaveAssessment(baseRec);

          // 2. Buffer to Redis Middleman
          const bufferRes = await bufferAssessmentToRedis(baseRec);
          if (bufferRes.success) {
            setRedisNotice(`Buffered to Redis (Queue: ${bufferRes.buffer_queue_length}) → Auto-syncing to Supabase in 10-15s`);
          }
        }
      }

      // Save Follow-up if provided
      if (folStr.trim() !== '') {
        const folNum = parseFloat(folStr);
        if (!isNaN(folNum) && folNum >= 0 && folNum <= 10) {
          const folRec: Omit<AssessmentRecord, 'id'> = {
            student_id: student.id,
            competency_id: comp.id,
            assessment_type: 'follow_up',
            score_obtained: folNum,
            total_marks: 10,
            percentage: (folNum / 10) * 100,
            assessed_at: new Date().toISOString().split('T')[0]
          };

          await onSaveAssessment(folRec);
          const bufferRes = await bufferAssessmentToRedis(folRec);
          if (bufferRes.success) {
            setRedisNotice(`Buffered to Redis (Queue: ${bufferRes.buffer_queue_length}) → Auto-syncing to Supabase in 10-15s`);
          }
        }
      }

      setSaveSuccessNotice(`Marks saved for ${comp.code}!`);
      setTimeout(() => {
        setSaveSuccessNotice(null);
        setRedisNotice(null);
      }, 4000);
    } catch (err: unknown) {
      alert(`Error saving marks: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Student Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-xs">
              #{student.roll_number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-green-50 text-green-950 border border-green-200">
                  {formatClassDisplay(student.grade, currentLang)}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Roll #{student.roll_number}
                </span>
                {student.parental_consent_verified && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                    DPDP Verified
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
                {formatStudentDisplay(student, currentLang)}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-stone-500 block text-[11px]">Assessment Portfolio</span>
            <span className="font-black text-green-950 text-sm">
              {studentAssessments.length} Marks Recorded Across 7 Subjects
            </span>
          </div>
        </div>

        {/* Notices */}
        {saveSuccessNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessNotice}</span>
            </div>
            {redisNotice && (
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                {redisNotice}
              </span>
            )}
          </div>
        )}

        {/* 7 Core Subjects Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-100 text-xs scrollbar-none">
          {ALL_SUBJECTS.map((sub) => {
            const isSelected = activeSubject === sub;
            const subCompCount = competencies.filter(c => c.subject === sub).length;
            const subAsmtCount = studentAssessments.filter(a => {
              const comp = competencies.find(c => c.id === a.competency_id);
              return comp?.subject === sub;
            }).length;

            return (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-green-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{getSubjectName(sub, currentLang)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {subAsmtCount}/{subCompCount * 2}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subject Competencies List for this Student */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {subjectCompetencies.map((comp) => {
            const baseScore = editingScores[comp.id]?.baseline ?? getExistingScore(comp.id, 'baseline')?.toString() ?? '';
            const folScore = editingScores[comp.id]?.followup ?? getExistingScore(comp.id, 'follow_up')?.toString() ?? '';
            
            const baseNum = parseFloat(baseScore);
            const basePct = !isNaN(baseNum) ? Math.round((baseNum / 10) * 100) : null;
            const folNum = parseFloat(folScore);
            const folPct = !isNaN(folNum) ? Math.round((folNum / 10) * 100) : null;

            const isMastered = (folPct !== null ? folPct : (basePct ?? 0)) >= comp.threshold_passing_pct;
            const isUrgent = (folPct !== null ? folPct : (basePct ?? 0)) < 40 && (basePct !== null || folPct !== null);

            return (
              <div
                key={comp.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-green-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs bg-green-100 text-green-950 px-2 py-0.5 rounded border border-green-200">
                        {comp.code}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900">
                        {getCompetencyTitle(comp, currentLang)}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      {getCompetencyDescription(comp, currentLang)}
                    </p>
                  </div>

                  {/* Status Tag */}
                  {(basePct !== null || folPct !== null) && (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold self-start sm:self-auto shrink-0 ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : isUrgent
                        ? 'bg-orange-100 text-orange-950 border border-orange-300'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}>
                      {isMastered ? 'Mastered (60%+)' : isUrgent ? 'Urgent (<40%)' : 'Moderate (40-59%)'}
                    </span>
                  )}
                </div>

                {/* Score Input Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200/60 text-xs items-center">
                  
                  {/* Baseline Input */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200">
                    <label className="text-[11px] font-bold text-stone-700 whitespace-nowrap">
                      Baseline Marks (/10):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={baseScore}
                      onChange={(e) => handleScoreChange(comp.id, 'baseline', e.target.value)}
                      placeholder="e.g. 5.5"
                      className="w-16 text-center font-bold text-stone-900 border border-stone-300 rounded-lg p-1 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
                    />
                    {basePct !== null && (
                      <span className="text-[10px] text-stone-500 font-bold">({basePct}%)</span>
                    )}
                  </div>

                  {/* Follow-up Input */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-orange-200">
                    <label className="text-[11px] font-bold text-orange-950 whitespace-nowrap">
                      Follow-up Marks (/10):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={folScore}
                      onChange={(e) => handleScoreChange(comp.id, 'followup', e.target.value)}
                      placeholder="e.g. 8.0"
                      className="w-16 text-center font-bold text-orange-950 border border-orange-300 rounded-lg p-1 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                    {folPct !== null && (
                      <span className="text-[10px] text-orange-700 font-bold">({folPct}%)</span>
                    )}
                  </div>

                  {/* Save to Redis & DB Button */}
                  <button
                    onClick={() => handleSaveCompetency(comp)}
                    disabled={savingKey === comp.id}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs transition shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingKey === comp.id ? 'Buffering...' : 'Save Marks'}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div>
            <span>Marks are buffered to Redis with automatic rate-limited Supabase sync every 10-15s</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white transition shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
