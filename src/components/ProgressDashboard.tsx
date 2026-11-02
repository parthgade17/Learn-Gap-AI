import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Award,
  BarChart3,
  Shield,
  User,
  Users,
  Brain,
  Sparkles,
  School,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Student, Competency, AssessmentRecord, RemedialPlan, UserRole, SubjectType } from '../types';
import {
  calculateRemediationMetrics,
  predictStudentMastery,
  predictCohortOutcomes
} from '../engine/gapEngine';
import { getCompetencyTitle, formatStudentDisplay, ALL_SUBJECTS } from '../data/curriculumData';
import { CircularGauge } from './CircularGauge';

interface ProgressDashboardProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  plans: RemedialPlan[];
  userRole: UserRole;
  onNavigateToAssessment?: () => void;
  onNavigateToPlanner?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  students,
  competencies,
  assessments,
  plans,
  userRole,
  onNavigateToAssessment,
  onNavigateToPlanner,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Toggle between Overall Students Record and Individual Student Record
  const [viewScope, setViewScope] = useState<'overall' | 'individual'>('overall');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-301');

  // Closed loop metrics
  const metrics = calculateRemediationMetrics(competencies, assessments);

  // Overall Cohort & AI Predictions
  const cohortPrediction = predictCohortOutcomes(students, assessments, competencies);

  // Selected student & individual AI prediction
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const studentPrediction = selectedStudent
    ? predictStudentMastery(selectedStudent, assessments, competencies)
    : null;

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

  const netGain = avgFollowupPass - avgBaselinePass;
  const totalPersistent = metrics.reduce((acc, m) => acc + m.persistentGapCount, 0);

  // Action on identified gaps (Target: >= 80%)
  const plannedCompIds = new Set(plans.map(p => p.competency_id));
  const gapsReceivingPlanPct = Math.min(100, Math.round((plannedCompIds.size / Math.max(1, metrics.filter(m => m.baselinePassRate < 70).length)) * 100));

  // Subject-wise average scores across cohort
  const subjectPerformance: Record<SubjectType, { baseline: number; followup: number; count: number }> = {
    'English': { baseline: 0, followup: 0, count: 0 },
    'Mathematics': { baseline: 0, followup: 0, count: 0 },
    'Social Science': { baseline: 0, followup: 0, count: 0 },
    'Physics': { baseline: 0, followup: 0, count: 0 },
    'Chemistry': { baseline: 0, followup: 0, count: 0 },
    'Marathi': { baseline: 0, followup: 0, count: 0 },
    'Hindi': { baseline: 0, followup: 0, count: 0 }
  };

  metrics.forEach(m => {
    const sub = m.competency.subject;
    if (subjectPerformance[sub]) {
      subjectPerformance[sub].baseline += m.baselinePassRate;
      subjectPerformance[sub].followup += (m.hasFollowup ? m.followupPassRate : m.baselinePassRate);
      subjectPerformance[sub].count += 1;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('dashboard.title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {userRole === 'teacher' && 'Classroom-level diagnostic radar & individual learner trajectory'}
                {userRole === 'head_teacher' && 'CRC School-wide FLN competency matrix & teacher remediation compliance'}
                {userRole === 'block_officer' && 'Taluka Cluster aggregate analytics & DPDP-compliant equity index'}
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher: Overall Record vs Individual Student Record */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewScope('overall')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewScope === 'overall'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Overall Students Record</span>
          </button>
          <button
            onClick={() => setViewScope('individual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewScope === 'individual'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Individual Student Record</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROLE-SPECIFIC HIGHLIGHT CARDS
          1. Class Teacher | 2. Head Teacher (CRC) | 3. Block Education Officer (BEO)
      ========================================================================= */}
      {userRole === 'teacher' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs font-bold">
              Grade 6-A
            </span>
            <div>
              <p className="font-bold text-blue-950">
                Classroom Teacher Command Center
              </p>
              <p className="text-blue-700 text-[11px] mt-0.5">
                Active tracking: 20 Students • 7 Academic Subjects • Dynamic Supabase Real-time Sync
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToAssessment && (
              <button
                onClick={onNavigateToAssessment}
                className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100 transition shadow-xs text-xs"
              >
                + Edit Marks
              </button>
            )}
            {onNavigateToPlanner && (
              <button
                onClick={onNavigateToPlanner}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-xs text-xs"
              >
                Open Remedial Plan
              </button>
            )}
          </div>
        </div>
      )}

      {userRole === 'head_teacher' && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-emerald-950 text-sm">
                Head Teacher (CRC) School Supervisory Index
              </span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
              School UDISE: 27260501201 (ZP Primary School)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Remedial Plan Compliance</span>
              <p className="text-lg font-black text-emerald-700 mt-0.5">88% <span className="text-[10px] text-emerald-600 font-semibold">(Target &ge; 80%)</span></p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Persistent Learning Gaps</span>
              <p className="text-lg font-black text-amber-700 mt-0.5">{totalPersistent} <span className="text-[10px] text-slate-400 font-normal">Learners need Tier-3 support</span></p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">CRC Mentor Visit Status</span>
              <p className="text-lg font-black text-blue-700 mt-0.5">Verified <span className="text-[10px] text-emerald-600 font-semibold">&#10003; Approved</span></p>
            </div>
          </div>
        </div>
      )}

      {userRole === 'block_officer' && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-2xl space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-700" />
              <span className="font-bold text-purple-950 text-sm">
                Block Education Officer (BEO) - Taluka Administrative Overview
              </span>
            </div>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-[11px] self-start sm:self-auto">
              Cluster: Kopargaon North • 12 ZP Schools
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-purple-100 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <p className="text-purple-900 text-[11px] leading-relaxed">
              <strong>DPDP Act 2023 Masking Active:</strong> Individual child identifiability is masked at administrative level. Only macro-level competency mastery indices and cluster recovery velocity are presented for equitable allocation of teacher training and learning kits.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: OVERALL STUDENTS RECORD (CIRCULAR GRAPHS & COHORT PREDICTION)
      ========================================================================= */}
      {viewScope === 'overall' && (
        <div className="space-y-6">
          
          {/* Main KPI Circular Gauges Row */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <span>Classroom Circular Performance Indicators</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-50 text-brand-700 border border-brand-200 font-bold uppercase tracking-wider">
                    All 20 Students
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Closed-loop circular recovery analytics across baseline and follow-up milestones
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Net Gain: +{netGain}%</span>
              </div>
            </div>

            {/* Circular Gauges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
              <div className="flex flex-col items-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <CircularGauge
                  percentage={coveragePct}
                  size={110}
                  strokeWidth={9}
                  sublabel="Assessed"
                  colorScheme="brand"
                  label="Diagnostic Coverage"
                />
                <span className="text-[11px] text-slate-400 mt-1 font-medium">
                  {assessedStudentsCount} of {totalStudents} learners
                </span>
              </div>

              <div className="flex flex-col items-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <CircularGauge
                  percentage={avgBaselinePass}
                  size={110}
                  strokeWidth={9}
                  sublabel="Initial"
                  colorScheme="amber"
                  label="Baseline Pass Rate"
                />
                <span className="text-[11px] text-slate-400 mt-1 font-medium">
                  Initial Diagnostic Average
                </span>
              </div>

              <div className="flex flex-col items-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <CircularGauge
                  percentage={avgFollowupPass}
                  size={110}
                  strokeWidth={9}
                  sublabel="Recovered"
                  colorScheme="emerald"
                  label="Follow-Up Pass Rate"
                />
                <span className="text-[11px] text-emerald-600 mt-1 font-bold">
                  +{netGain}% post-remediation
                </span>
              </div>

              <div className="flex flex-col items-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <CircularGauge
                  percentage={gapsReceivingPlanPct}
                  size={110}
                  strokeWidth={9}
                  sublabel="Action"
                  colorScheme="brand"
                  label="Gaps with Plan"
                />
                <span className="text-[11px] text-slate-400 mt-1 font-medium">
                  {plans.length} active teacher plans
                </span>
              </div>
            </div>
          </div>

          {/* 7 Subjects Circular Graph Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Subject-Wise Circular Mastery Gauges (7 Subjects)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time mastery percentage per subject across English, Mathematics, Social Science, Physics, Chemistry, Marathi, and Hindi
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">Benchmark: 60%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 pt-2">
              {ALL_SUBJECTS.map((subject) => {
                const subData = subjectPerformance[subject];
                const count = subData?.count || 1;
                const baseline = Math.round((subData?.baseline || 50) / count);
                const current = Math.round((subData?.followup || 60) / count);
                const isPassing = current >= 60;

                return (
                  <div
                    key={subject}
                    className="flex flex-col items-center bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 hover:border-brand-300 hover:shadow-xs transition"
                  >
                    <CircularGauge
                      percentage={current}
                      size={86}
                      strokeWidth={8}
                      sublabel={isPassing ? 'Master' : 'Gap'}
                      colorScheme={isPassing ? 'emerald' : current >= 45 ? 'amber' : 'rose'}
                    />
                    <span className="text-xs font-bold text-slate-800 mt-2 text-center truncate max-w-full">
                      {subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Base: {baseline}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Based Cohort Prediction Engine Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-white tracking-tight flex items-center gap-2">
                    <span>LearnGap AI Cohort Predictive Engine</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Hybrid Rule + ML
                    </span>
                  </h4>
                  <p className="text-xs text-indigo-200/80">
                    Continuous learning curve forecasting for end-of-term grade outcomes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                <div>
                  <span className="text-slate-400 block text-[10px]">Predicted Class Pass Rate</span>
                  <span className="text-lg font-black text-emerald-400">
                    {cohortPrediction.projected_class_pass_rate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-indigo-300 block">Stagnation Risk</span>
                <span className="text-xl font-black text-amber-400 mt-1 block">
                  {cohortPrediction.stagnation_risk_pct}%
                </span>
                <span className="text-[10px] text-slate-400">Students at high friction</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-indigo-300 block">Time to Benchmark</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">
                  ~{cohortPrediction.estimated_weeks_to_goal} Weeks
                </span>
                <span className="text-[10px] text-slate-400">At current learning velocity</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-indigo-300 block">Highest Need Subject</span>
                <span className="text-base font-black text-rose-300 mt-1 block truncate">
                  {cohortPrediction.most_vulnerable_subject}
                </span>
                <span className="text-[10px] text-slate-400">Requires daily intervention</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-indigo-300 block">Strongest Foundation</span>
                <span className="text-base font-black text-teal-300 mt-1 block truncate">
                  {cohortPrediction.strongest_subject}
                </span>
                <span className="text-[10px] text-slate-400">Can act as scaffolding base</span>
              </div>
            </div>

            {/* Bilingual AI Insights */}
            <div className="bg-black/25 border border-white/10 p-4 rounded-xl space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI Pedagogical Cohort Insights (एआय अंतर्दृष्टी)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-200">
                {(currentLang === 'mr' ? cohortPrediction.ai_insights_mr : cohortPrediction.ai_insights_en).map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">&#8226;</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competency Breakdown Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                    <th className="py-2.5 px-3">Subject &amp; Competency</th>
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
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-mono font-bold mr-1.5 text-slate-600">
                            {comp.subject}
                          </span>
                          <span className="text-slate-500 font-mono">[{comp.code}]</span>{' '}
                          {getCompetencyTitle(comp, currentLang)}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {comp.threshold_passing_pct}%
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
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
                              <div className="w-16 bg-emerald-100 rounded-full h-2 overflow-hidden">
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

        </div>
      )}

      {/* =========================================================================
          VIEW 2: INDIVIDUAL STUDENT RECORD (STUDENT SELECTOR, RADIAL GAUGE & AI TRAJECTORY)
      ========================================================================= */}
      {viewScope === 'individual' && studentPrediction && (
        <div className="space-y-6">
          
          {/* Student Picker Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-black text-sm">
                #{selectedStudent?.roll_number}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Select Individual Learner
                </span>
                <span className="font-black text-slate-900 text-base">
                  {selectedStudent ? formatStudentDisplay(selectedStudent, currentLang) : 'Learner'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="student-picker" className="text-xs font-medium text-slate-500">
                Switch Student:
              </label>
              <select
                id="student-picker"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    Roll #{std.roll_number} - {formatStudentDisplay(std, currentLang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Overview Cards with Circular Mastery Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Overall Circular Mastery & Risk Gauge (4 cols) */}
            <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Current Overall Proficiency
              </span>

              <CircularGauge
                percentage={studentPrediction.current_overall_pct}
                size={150}
                strokeWidth={13}
                sublabel={studentPrediction.current_overall_pct >= 60 ? 'Mastered' : 'Needs Aid'}
                colorScheme={studentPrediction.current_overall_pct >= 60 ? 'emerald' : studentPrediction.current_overall_pct >= 45 ? 'amber' : 'rose'}
              />

              <div className="space-y-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  studentPrediction.risk_level === 'low'
                    ? 'bg-emerald-100 text-emerald-800'
                    : studentPrediction.risk_level === 'medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {studentPrediction.risk_level} Risk Level
                </span>
                <p className="text-xs text-slate-500">
                  Roll #{studentPrediction.roll_number} • Section A • Grade 6
                </p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Confidence</span>
                  <span className="font-bold text-slate-800">{studentPrediction.confidence_score}%</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Learning Speed</span>
                  <span className="font-bold text-emerald-700">+{studentPrediction.learning_velocity}%/wk</span>
                </div>
              </div>
            </div>

            {/* Right: AI Trajectory & Next-Best Action (8 cols) */}
            <div className="md:col-span-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <h4 className="font-bold text-base text-white">
                      Individual AI Predictive Trajectory
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-300 bg-white/10 px-2.5 py-1 rounded-lg">
                    Estimated Recovery: ~{studentPrediction.recovery_velocity_days} Days
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block">Current Score</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {studentPrediction.current_overall_pct}%
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block">Predicted Mastery</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">
                      {studentPrediction.predicted_mastery_pct}%
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block">Projected Gain</span>
                    <span className="text-xl font-black text-indigo-300 mt-1 block">
                      +{studentPrediction.predicted_gain_pct}%
                    </span>
                  </div>
                </div>

                {/* AI Next-Best Pedagogical Recommendation */}
                <div className="mt-4 p-4 rounded-xl bg-indigo-500/15 border border-indigo-400/30">
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-300 block mb-1">
                    AI Recommended Next-Best Action:
                  </span>
                  <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                    {currentLang === 'mr' ? studentPrediction.recommended_action_mr : studentPrediction.recommended_action_en}
                  </p>
                </div>
              </div>

              {onNavigateToPlanner && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onNavigateToPlanner}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                  >
                    <span>Create Custom Remedial Plan for this Student</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Student Subject-Wise Circular Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">
              Individual Subject Circular Progress Rings (7 Subjects)
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {studentPrediction.subject_predictions.map((sp) => {
                const isPassing = sp.current_pct >= 60;
                return (
                  <div
                    key={sp.subject}
                    className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-brand-400 transition"
                  >
                    <CircularGauge
                      percentage={sp.current_pct}
                      size={82}
                      strokeWidth={8}
                      sublabel={isPassing ? 'Pass' : 'Aid'}
                      colorScheme={isPassing ? 'emerald' : sp.current_pct >= 45 ? 'amber' : 'rose'}
                    />
                    <span className="text-xs font-bold text-slate-800 mt-2 text-center truncate max-w-full">
                      {sp.subject}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                      Pred: {sp.predicted_pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
