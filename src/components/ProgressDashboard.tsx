import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, CheckCircle, BarChart3, Shield } from 'lucide-react';
import { Student, Competency, AssessmentRecord, RemedialPlan, UserRole } from '../types';
import { calculateRemediationMetrics } from '../engine/gapEngine';
import { getCompetencyTitle } from '../data/curriculumData';

interface ProgressDashboardProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  plans: RemedialPlan[];
  userRole: UserRole;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  students,
  competencies,
  assessments,
  plans,
  userRole,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const metrics = calculateRemediationMetrics(competencies, assessments);

  // Overall statistics
  const totalStudents = students.length;
  const assessedStudentsCount = new Set(
    assessments.filter(a => a.assessment_type === 'baseline').map(a => a.student_id)
  ).size;
  const coveragePct = totalStudents > 0 ? Math.round((assessedStudentsCount / totalStudents) * 100) : 0;

  const competenciesWithFollowup = metrics.filter(m => m.hasFollowup);
  const avgBaselinePass = metrics.length > 0
    ? Math.round(metrics.reduce((acc, m) => acc + m.baselinePassRate, 0) / metrics.length)
    : 0;

  const avgFollowupPass = competenciesWithFollowup.length > 0
    ? Math.round(competenciesWithFollowup.reduce((acc, m) => acc + m.followupPassRate, 0) / competenciesWithFollowup.length)
    : avgBaselinePass;

  const totalRecovered = metrics.reduce((acc, m) => acc + m.remediatedCount, 0);
  const totalPersistent = metrics.reduce((acc, m) => acc + m.persistentGapCount, 0);

  // Measure: Action on identified gaps (Target: >= 80%)
  const plannedCompIds = new Set(plans.map(p => p.competency_id));
  const gapsReceivingPlanPct = Math.min(100, Math.round((plannedCompIds.size / Math.max(1, metrics.filter(m => m.baselinePassRate < 70).length)) * 100));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('dashboard.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Role Context Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto">
          <Shield className="w-4 h-4 text-brand-600" />
          <span>{t('dashboard.activeRoleLabel')} {t(`roles.${userRole}`)}</span>
        </div>
      </div>

      {/* Block Officer DPDP Aggregated View Notice */}
      {userRole === 'block_officer' && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-900 flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-indigo-800 font-medium">
              {t('dashboard.blockNotice')}
            </p>
          </div>
        </div>
      )}

      {/* Target Metrics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Coverage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t('dashboard.overallCoverage')}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{coveragePct}%</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{t('dashboard.coverageTarget')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {assessedStudentsCount} / {totalStudents} {t('dashboard.coverageSub')}
          </p>
        </div>

        {/* Baseline Pass */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t('dashboard.baselinePassAvg')}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-700">{avgBaselinePass}%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {t('dashboard.baselineSub')}
          </p>
        </div>

        {/* Follow-up Pass */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t('dashboard.followupPassAvg')}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">{avgFollowupPass}%</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +{avgFollowupPass - avgBaselinePass}% {t('dashboard.gainBadge')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {t('dashboard.followupSub')}
          </p>
        </div>

        {/* Action on Gaps */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t('dashboard.actionOnGaps')}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-700">{gapsReceivingPlanPct}%</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{t('dashboard.actionTargetMet')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {plans.length} {t('dashboard.actionSub')}
          </p>
        </div>

      </div>

      {/* Baseline vs Follow-up Comparison Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {t('dashboard.gapRecoverySummary')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('dashboard.summarySub')}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
              {t('dashboard.legendBaseline')}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              {t('dashboard.legendFollowup')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{t('dashboard.tableComp')}</th>
                <th className="py-2.5 px-3">{t('dashboard.tableThreshold')}</th>
                <th className="py-2.5 px-3">{t('dashboard.tableBaselinePass')}</th>
                <th className="py-2.5 px-3">{t('dashboard.tableFollowupPass')}</th>
                <th className="py-2.5 px-3">{t('dashboard.tableNetGain')}</th>
                <th className="py-2.5 px-3">{t('dashboard.tableRecovered')}</th>
                <th className="py-2.5 px-3">{t('dashboard.tableRemaining')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((m) => {
                const comp = m.competency;
                const hasFollowup = m.hasFollowup;

                return (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <span className="text-slate-500 font-mono">[{comp.code}]</span>{' '}
                      {getCompetencyTitle(comp, currentLang)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {comp.threshold_passing_pct}%
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-slate-500 h-2 rounded-full"
                            style={{ width: `${m.baselinePassRate}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700">{m.baselinePassRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {hasFollowup ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-emerald-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${m.followupPassRate}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-emerald-800">{m.followupPassRate}%</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">{t('dashboard.inProgressNotice')}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {hasFollowup ? (
                        <span className={`inline-flex items-center ${m.netGainPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {m.netGainPct >= 0 ? `+${m.netGainPct}%` : `${m.netGainPct}%`}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {hasFollowup ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Award className="w-3 h-3 text-emerald-600" />
                          {m.remediatedCount} {t('dashboard.recoveredBadge')}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {hasFollowup ? (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                          m.persistentGapCount > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.persistentGapCount > 0 ? `${m.persistentGapCount} ${t('dashboard.persistentBadge')}` : t('dashboard.noneBadge')}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Closed Loop Insight Summary */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 rounded-xl shadow-sm">
        <h4 className="font-bold text-base flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{t('dashboard.insightHeading')}</span>
        </h4>
        <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
          {t('dashboard.insightBody')} ({t('dashboard.recoveredBadge')}: {totalRecovered}, {t('dashboard.persistentBadge')}: {totalPersistent})
        </p>
      </div>

    </div>
  );
};
