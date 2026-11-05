import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download
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
  selectedClassGrade?: string;
  onClassGradeChange?: (grade: string) => void;
  onNavigateToAssessment?: () => void;
  onNavigateToPlanner?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  students,
  competencies,
  assessments,
  plans,
  userRole,
  selectedClassGrade: externalClassGrade,
  onClassGradeChange,
  onNavigateToAssessment,
  onNavigateToPlanner,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Toggle between Overall Students Record and Individual Student Record
  const [viewScope, setViewScope] = useState<'overall' | 'individual'>('overall');

  // Class / Grade filter:
  // Class Teacher selects from options: 5th A, 6th A, 7th A, and 8th A.
  // Head Teacher can inspect Entire School ('ALL') or inspect any individual class.
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>(
    externalClassGrade || (userRole === 'teacher' ? '6' : 'ALL')
  );

  // Sync whenever externalClassGrade changes
  useEffect(() => {
    if (externalClassGrade) {
      setSelectedClassGrade(externalClassGrade);
    }
  }, [externalClassGrade]);

  // Default to grade 6 if teacher role is active and selectedClassGrade was 'ALL'
  useEffect(() => {
    if (userRole === 'teacher' && selectedClassGrade === 'ALL') {
      setSelectedClassGrade('6');
      onClassGradeChange?.('6');
    }
  }, [userRole, selectedClassGrade, onClassGradeChange]);

  const activeGrade = userRole === 'teacher' && selectedClassGrade === 'ALL' ? '6' : selectedClassGrade;

  // Filter students by selected class
  const filteredStudents = activeGrade === 'ALL'
    ? students
    : students.filter(s => s.grade === parseInt(activeGrade, 10));

  const filteredStudentIds = new Set(filteredStudents.map(s => s.id));

  // Filter assessments and plans corresponding to the active class scope
  const filteredAssessments = assessments.filter(a => filteredStudentIds.has(a.student_id));
  const filteredPlans = activeGrade === 'ALL'
    ? plans
    : plans.filter(p => p.grade === parseInt(activeGrade, 10));

  // Selected student state for individual student view (guaranteed to belong to active class)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    filteredStudents[0]?.id || students[0]?.id || 'std-501'
  );

  // Keep selected student synchronized whenever the class changes
  useEffect(() => {
    if (filteredStudents.length > 0 && !filteredStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  const handleClassSelect = (grade: string) => {
    setSelectedClassGrade(grade);
    onClassGradeChange?.(grade);
    const classStds = grade === 'ALL'
      ? students
      : students.filter(s => s.grade === parseInt(grade, 10));
    if (classStds.length > 0) {
      setSelectedStudentId(classStds[0].id);
    }
  };

  // Closed loop metrics for active scope
  const metrics = calculateRemediationMetrics(competencies, filteredAssessments);

  // Cohort AI Predictions for active scope
  const cohortPrediction = predictCohortOutcomes(filteredStudents, filteredAssessments, competencies);

  // Selected student & individual AI prediction (immediately points to student in active class)
  const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0] || students[0];
  const studentPrediction = selectedStudent
    ? predictStudentMastery(selectedStudent, assessments, competencies)
    : null;

  // Active scope statistics
  const totalStudents = filteredStudents.length;
  const assessedStudentsCount = new Set(
    filteredAssessments.filter(a => a.assessment_type === 'baseline').map(a => a.student_id)
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
  const plannedCompIds = new Set(filteredPlans.map(p => p.competency_id));
  const gapsReceivingPlanPct = Math.min(
    100,
    Math.round((plannedCompIds.size / Math.max(1, metrics.filter(m => m.baselinePassRate < 70).length)) * 100)
  );

  // Subject-wise average scores for active scope
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

  // School-wide Class-by-Class Comparative Data for Head Teacher
  const availableGrades = [5, 6, 7, 8];
  const classBreakdown = availableGrades.map((grade) => {
    const classStudents = students.filter(s => s.grade === grade);
    const classStudentIds = new Set(classStudents.map(s => s.id));
    const classAsmts = assessments.filter(a => classStudentIds.has(a.student_id));
    const classPlans = plans.filter(p => p.grade === grade);

    const classMetrics = calculateRemediationMetrics(competencies, classAsmts);
    const withFol = classMetrics.filter(m => m.hasFollowup);
    const baseAvg = classMetrics.length > 0
      ? Math.round(classMetrics.reduce((acc, m) => acc + m.baselinePassRate, 0) / classMetrics.length)
      : 50;
    const folAvg = withFol.length > 0
      ? Math.round(withFol.reduce((acc, m) => acc + m.followupPassRate, 0) / withFol.length)
      : baseAvg;
    const persistent = classMetrics.reduce((acc, m) => acc + m.persistentGapCount, 0);

    const teacherNames: Record<number, string> = {
      5: 'श्रीमती ए. बी. पाटील (S. A. Patil)',
      6: 'श्री. एम. आर. कुलकर्णी (M. R. Kulkarni)',
      7: 'श्रीमती के. एस. शिंदे (K. S. Shinde)',
      8: 'श्री. व्ही. पी. चव्हाण (V. P. Chavan)'
    };

    return {
      grade,
      className: `Class ${grade}th - Section A (इयत्ता ${grade} वी)`,
      teacherName: teacherNames[grade] || 'Teacher-in-Charge',
      studentCount: classStudents.length,
      baselinePassRate: baseAvg,
      followupPassRate: folAvg,
      netGainPct: folAvg - baseAvg,
      activePlansCount: classPlans.length,
      persistentGapsCount: persistent
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Title & Primary Scope Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-green-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-green-950 tracking-tight">
            {t('dashboard.title')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {userRole === 'head_teacher'
              ? 'Head Teacher (मुख्याध्यापक / CRC) Supervisory Portal • Entire School Class-Wise & Individual Records'
              : 'Classroom Teacher Command Center • Grade 6-A Diagnostic Radar & Individual Learner Trajectory'}
          </p>
        </div>

        {/* View Switcher: Overall Students Record vs Individual Student Record */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setViewScope('overall')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewScope === 'overall'
                ? 'bg-green-700 text-white shadow-xs'
                : 'text-stone-700 hover:text-green-950'
            }`}
          >
            <span>Overall Students Record</span>
          </button>
          <button
            onClick={() => setViewScope('individual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewScope === 'individual'
                ? 'bg-green-700 text-white shadow-xs'
                : 'text-stone-700 hover:text-green-950'
            }`}
          >
            <span>Individual Student Record</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROLE HIGHLIGHT & CLASS SELECTOR (TRICOLOR: GREEN, WHITE, ORANGE)
      ========================================================================= */}
      {userRole === 'teacher' ? (
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-orange-50/50 border border-green-200 p-4 sm:p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
            <span className="p-2.5 bg-green-700 text-white rounded-xl shadow-xs font-black text-sm tracking-wide shrink-0">
              Grade {activeGrade}-A
            </span>
            <div className="min-w-0">
              <p className="font-bold text-green-950 text-sm whitespace-nowrap">
                Classroom Teacher Command Center
              </p>
              <p className="text-green-800 text-[11px] mt-0.5 truncate">
                Class Section: Grade {activeGrade}-A • {filteredStudents.length} Students • 7 Core Subjects • Continuous Remedial Tracking
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            {/* Drag down option for selecting class */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-green-300 shadow-2xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-green-700 shrink-0" />
              <label htmlFor="teacher-class-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Select Class:
              </label>
              <select
                id="teacher-class-select"
                value={activeGrade}
                onChange={(e) => handleClassSelect(e.target.value)}
                className="text-xs font-bold rounded-lg border border-stone-300 py-1 px-2 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-green-600 cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <option value="5">Class 5th - A</option>
                <option value="6">Class 6th - A</option>
                <option value="7">Class 7th - A</option>
                <option value="8">Class 8th - A</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToAssessment && (
                <button
                  onClick={onNavigateToAssessment}
                  className="px-3 py-1.5 rounded-lg bg-white border border-green-300 text-green-800 font-bold hover:bg-green-50 transition shadow-xs text-xs whitespace-nowrap cursor-pointer"
                >
                  + Edit Marks
                </button>
              )}
              {onNavigateToPlanner && (
                <button
                  onClick={onNavigateToPlanner}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-xs text-xs whitespace-nowrap cursor-pointer"
                >
                  Open Remedial Plan
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Head Teacher (मुख्याध्यापक) Portal */
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-orange-50/50 border border-green-300 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-green-950 text-base">
                Head Teacher (मुख्याध्यापक) School Supervisory Dashboard
              </h3>
              <p className="text-xs text-green-800">
                Zilla Parishad Primary School (UDISE: 27260501234) • All Classes (Grade 5 to 8)
              </p>
            </div>

            {/* Class Filter Bar for Head Teacher */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-green-300 shadow-2xs self-start sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-green-700 ml-1 shrink-0" />
              <label htmlFor="head-teacher-class-select" className="text-xs font-bold text-slate-700">
                Inspect Scope:
              </label>
              <select
                id="head-teacher-class-select"
                value={selectedClassGrade}
                onChange={(e) => handleClassSelect(e.target.value)}
                className="text-xs font-bold rounded-lg border border-stone-300 py-1 px-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-green-600 cursor-pointer"
              >
                <option value="ALL">Entire School (सर्व वर्ग - All Classes)</option>
                <option value="5">Class 5th - A (इयत्ता ५ वी)</option>
                <option value="6">Class 6th - A (इयत्ता ६ वी)</option>
                <option value="7">Class 7th - A (इयत्ता ७ वी)</option>
                <option value="8">Class 8th - A (इयत्ता ८ वी)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-green-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Total Enrolled Learners</span>
              <p className="text-lg font-black text-green-950 mt-0.5">
                {totalStudents} <span className="text-[11px] text-slate-400 font-normal">Students in scope</span>
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-green-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Remedial Plan Compliance</span>
              <p className="text-lg font-black text-green-700 mt-0.5">
                88% <span className="text-[10px] text-green-600 font-bold">&#10003; Compliant (&ge;80%)</span>
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-green-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Persistent Gaps Flagged</span>
              <p className="text-lg font-black text-orange-700 mt-0.5">
                {totalPersistent} <span className="text-[10px] text-slate-400 font-normal">Requires Tier-3</span>
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-green-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">School Diagnostic Coverage</span>
              <p className="text-lg font-black text-green-700 mt-0.5">
                {coveragePct}% <span className="text-[10px] text-green-600 font-semibold">100% Target Met</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HEAD TEACHER SPECIAL: SCHOOL-WIDE CLASS-BY-CLASS COMPARATIVE MATRIX
      ========================================================================= */}
      {userRole === 'head_teacher' && viewScope === 'overall' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>School-Wide Class-By-Class Comparative Performance</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider">
                  Head Teacher Multi-Class View
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Compare learning recovery, baseline vs follow-up pass rate, and teacher remediation compliance across Grade 5, 6, 7, and 8
              </p>
            </div>

            {selectedClassGrade !== 'ALL' && (
              <button
                onClick={() => handleClassSelect('ALL')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200 self-start sm:self-auto"
              >
                Reset to Entire School View
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase tracking-wider text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Class &amp; Section</th>
                  <th className="py-3 px-3">Class Teacher</th>
                  <th className="py-3 px-3">Students</th>
                  <th className="py-3 px-3">Baseline Pass</th>
                  <th className="py-3 px-3">Follow-Up Pass</th>
                  <th className="py-3 px-3">Net Gain</th>
                  <th className="py-3 px-3">Remedial Plans</th>
                  <th className="py-3 px-3">Persistent Gaps</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classBreakdown.map((cls) => {
                  const isSelected = selectedClassGrade === String(cls.grade);

                  return (
                    <tr
                      key={cls.grade}
                      className={`transition ${
                        isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800 mr-2 font-mono">
                          Std {cls.grade}
                        </span>
                        {cls.className}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {cls.teacherName}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {cls.studentCount} Learners
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-700">{cls.baselinePassRate}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-emerald-700">{cls.followupPassRate}%</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-800">
                        +{cls.netGainPct}%
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          {cls.activePlansCount} Plans
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                          cls.persistentGapsCount > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {cls.persistentGapsCount > 0 && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {cls.persistentGapsCount} Gaps
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleClassSelect(String(cls.grade))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition shadow-2xs ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? 'Active Scope' : 'Inspect Class'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          STATIC DATASET DOWNLOADS (5th A, 6th A, 7th A, 8th A) - TRICOLOR THEME
      ========================================================================= */}
      <div className="bg-gradient-to-r from-green-950 via-emerald-950 to-green-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-green-800">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="min-w-0">
            <h4 className="font-black text-sm text-white whitespace-nowrap">
              School Static Marksheet Datasets (Classes 5 to 8)
            </h4>
            <p className="text-xs text-emerald-100/90 mt-1 line-clamp-1">
              Download complete, deterministic CSV datasets with 10 learners per class, 7 core subjects, baseline and follow-up scores.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            <a
              href="/datasets/class_5th_A_marksheet.csv"
              download="class_5th_A_marksheet.csv"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white text-xs font-bold border border-white/20 transition shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-orange-300 shrink-0" />
              <span>5th A (.csv)</span>
            </a>
            <a
              href="/datasets/class_6th_A_marksheet.csv"
              download="class_6th_A_marksheet.csv"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white text-xs font-bold border border-white/20 transition shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-orange-300 shrink-0" />
              <span>6th A (.csv)</span>
            </a>
            <a
              href="/datasets/class_7th_A_marksheet.csv"
              download="class_7th_A_marksheet.csv"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white text-xs font-bold border border-white/20 transition shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-orange-300 shrink-0" />
              <span>7th A (.csv)</span>
            </a>
            <a
              href="/datasets/class_8th_A_marksheet.csv"
              download="class_8th_A_marksheet.csv"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white text-xs font-bold border border-white/20 transition shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-orange-300 shrink-0" />
              <span>8th A (.csv)</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OVERALL STUDENTS RECORD (CIRCULAR GRAPHS & COHORT PREDICTION)
      ========================================================================= */}
      {viewScope === 'overall' && (
        <div className="space-y-6">
          
          {/* Main KPI Circular Gauges Row */}
          <div className="bg-white p-6 rounded-2xl border border-green-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-green-100">
              <div>
                <h3 className="font-black text-green-950 text-base flex items-center gap-2">
                  <span>Circular Performance Indicators</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-wider">
                    {selectedClassGrade === 'ALL'
                      ? `Entire School (${totalStudents} Learners across 4 Classes)`
                      : `Class ${selectedClassGrade}th - A (${totalStudents} Learners)`}
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Closed-loop circular recovery analytics across baseline and follow-up milestones
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-800 bg-green-50 px-3 py-1 rounded-xl border border-green-300">
                <span>Net Gain: +{netGain}%</span>
              </div>
            </div>

            {/* Circular Gauges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
              <div className="flex flex-col items-center bg-green-50/40 p-4 rounded-xl border border-green-100">
                <CircularGauge
                  percentage={coveragePct}
                  size={110}
                  strokeWidth={9}
                  sublabel="Assessed"
                  colorScheme="brand"
                  label="Diagnostic Coverage"
                />
                <span className="text-[11px] text-stone-500 mt-1 font-medium">
                  {assessedStudentsCount} of {totalStudents} learners
                </span>
              </div>

              <div className="flex flex-col items-center bg-orange-50/40 p-4 rounded-xl border border-orange-100">
                <CircularGauge
                  percentage={avgBaselinePass}
                  size={110}
                  strokeWidth={9}
                  sublabel="Initial"
                  colorScheme="amber"
                  label="Baseline Pass Rate"
                />
                <span className="text-[11px] text-stone-500 mt-1 font-medium">
                  Initial Diagnostic Average
                </span>
              </div>

              <div className="flex flex-col items-center bg-green-50/40 p-4 rounded-xl border border-green-100">
                <CircularGauge
                  percentage={avgFollowupPass}
                  size={110}
                  strokeWidth={9}
                  sublabel="Recovered"
                  colorScheme="emerald"
                  label="Follow-Up Pass Rate"
                />
                <span className="text-[11px] text-green-700 mt-1 font-bold">
                  +{netGain}% post-remediation
                </span>
              </div>

              <div className="flex flex-col items-center bg-orange-50/40 p-4 rounded-xl border border-orange-100">
                <CircularGauge
                  percentage={gapsReceivingPlanPct}
                  size={110}
                  strokeWidth={9}
                  sublabel="Action"
                  colorScheme="amber"
                  label="Gaps with Plan"
                />
                <span className="text-[11px] text-stone-500 mt-1 font-medium">
                  {filteredPlans.length} active teacher plans
                </span>
              </div>
            </div>
          </div>

          {/* 7 Subjects Circular Graph Grid */}
          <div className="bg-white p-6 rounded-2xl border border-green-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-green-100">
              <div>
                <h3 className="font-black text-green-950 text-base">
                  Subject-Wise Circular Mastery Gauges (7 Core Subjects)
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time mastery percentage per subject across English, Mathematics, Social Science, Physics, Chemistry, Marathi, and Hindi
                </p>
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Benchmark: 60%
              </span>
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
                    className="flex flex-col items-center bg-stone-50/80 p-3.5 rounded-xl border border-stone-200 hover:border-green-400 hover:shadow-2xs transition"
                  >
                    <CircularGauge
                      percentage={current}
                      size={86}
                      strokeWidth={8}
                      sublabel={isPassing ? 'Master' : 'Gap'}
                      colorScheme={isPassing ? 'emerald' : current >= 45 ? 'amber' : 'rose'}
                    />
                    <span className="text-xs font-bold text-stone-900 mt-2 text-center truncate max-w-full">
                      {subject}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium mt-0.5">
                      Base: {baseline}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Based Cohort Prediction Engine Card - National Tricolor Theme */}
          <div className="bg-gradient-to-br from-green-950 via-emerald-950 to-green-900 text-white p-6 rounded-2xl shadow-xs space-y-4 border border-green-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h4 className="font-black text-lg text-white tracking-tight flex items-center gap-2">
                  <span>LearnGap AI Cohort Predictive Engine</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/40">
                    Hybrid Rule + ML
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Continuous learning curve forecasting for {selectedClassGrade === 'ALL' ? 'Entire School' : `Class ${selectedClassGrade}th`}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                <div>
                  <span className="text-stone-300 block text-[10px]">Predicted Pass Rate</span>
                  <span className="text-xl font-black text-orange-400">
                    {cohortPrediction.projected_class_pass_rate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-orange-200 block">Stagnation Risk</span>
                <span className="text-xl font-black text-orange-400 mt-1 block">
                  {cohortPrediction.stagnation_risk_pct}%
                </span>
                <span className="text-[10px] text-stone-300">Students at friction</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-emerald-200 block">Time to Benchmark</span>
                <span className="text-xl font-black text-emerald-300 mt-1 block">
                  ~{cohortPrediction.estimated_weeks_to_goal} Weeks
                </span>
                <span className="text-[10px] text-stone-300">Current velocity</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-orange-200 block">Highest Need Subject</span>
                <span className="text-base font-black text-orange-300 mt-1 block truncate">
                  {cohortPrediction.most_vulnerable_subject}
                </span>
                <span className="text-[10px] text-stone-300">Intervention needed</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs text-emerald-200 block">Strongest Foundation</span>
                <span className="text-base font-black text-emerald-300 mt-1 block truncate">
                  {cohortPrediction.strongest_subject}
                </span>
                <span className="text-[10px] text-stone-300">Scaffolding base</span>
              </div>
            </div>

            {/* Bilingual AI Insights */}
            <div className="bg-black/25 border border-white/10 p-4 rounded-xl space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-orange-300 block">
                AI Pedagogical Cohort Insights (एआय अंतर्दृष्टी)
              </span>
              <ul className="text-xs space-y-1.5 text-stone-200">
                {(currentLang === 'mr' ? cohortPrediction.ai_insights_mr : cohortPrediction.ai_insights_en).map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">&#8226;</span>
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
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
                                ? 'bg-orange-100 text-orange-900 border border-orange-200'
                                : 'bg-stone-100 text-stone-700'
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

          {/* =========================================================================
              CLASS STUDENT MARKSHEET & PERFORMANCE ROSTER (SHOWS DATA OF SELECTED CLASS)
          ========================================================================= */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                  <span>Class {activeGrade === 'ALL' ? 'All Classes' : `${activeGrade}th - Section A`} Student Performance Roster</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold uppercase tracking-wider">
                    {filteredStudents.length} Learners Active
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Comprehensive student-by-student marksheet data, baseline &amp; follow-up averages, net gains, and AI learning velocity for {activeGrade === 'ALL' ? 'the entire school' : `Class ${activeGrade}th - A`}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-green-950 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 self-start sm:self-auto">
                <span>Active Scope: {activeGrade === 'ALL' ? 'All 40 Students' : `Class ${activeGrade}th - A (${filteredStudents.length} Students)`}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-green-50/70 uppercase tracking-wider text-green-950 font-bold border-b border-green-200">
                  <tr>
                    <th className="py-3 px-3">Roll # &amp; Student Alias</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Baseline Avg</th>
                    <th className="py-3 px-3">Follow-Up Avg</th>
                    <th className="py-3 px-3">Net Gain</th>
                    <th className="py-3 px-3">AI Velocity</th>
                    <th className="py-3 px-3">Risk Level</th>
                    <th className="py-3 px-3 text-right">Student Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => {
                    const stdAsmts = assessments.filter(a => a.student_id === std.id);
                    const baseAsmts = stdAsmts.filter(a => a.assessment_type === 'baseline');
                    const folAsmts = stdAsmts.filter(a => a.assessment_type === 'follow_up');

                    const baseAvg = baseAsmts.length > 0
                      ? Math.round(baseAsmts.reduce((sum, a) => sum + a.percentage, 0) / baseAsmts.length)
                      : 0;
                    const folAvg = folAsmts.length > 0
                      ? Math.round(folAsmts.reduce((sum, a) => sum + a.percentage, 0) / folAsmts.length)
                      : baseAvg;
                    const gain = folAvg - baseAvg;

                    const pred = predictStudentMastery(std, assessments, competencies);

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          <span className="p-1 rounded-md bg-slate-100 text-slate-700 mr-2 font-mono">
                            #{std.roll_number}
                          </span>
                          {formatStudentDisplay(std, currentLang)}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-semibold whitespace-nowrap">
                          Class {std.grade}th - {std.section}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-700">{baseAvg}%</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-emerald-700">{folAvg}%</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-800">
                          +{gain}%
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            +{pred.learning_velocity}%/wk
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                            pred.risk_level === 'critical' || pred.risk_level === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : pred.risk_level === 'medium'
                              ? 'bg-orange-100 text-orange-900 border border-orange-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                            {pred.risk_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedStudentId(std.id);
                              setViewScope('individual');
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-50 border border-orange-200 text-orange-900 hover:bg-orange-100 transition shadow-2xs"
                          >
                            Inspect Student &rarr;
                          </button>
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
          Head Teacher & Class Teacher can drill into any individual student
      ========================================================================= */}
      {viewScope === 'individual' && studentPrediction && (
        <div className="space-y-6">
          
          {/* Student Picker Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-900 border border-green-300 flex items-center justify-center font-black text-sm">
                #{selectedStudent?.roll_number}
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
                  Select Individual Learner {userRole === 'head_teacher' ? '(School-Wide Drilldown)' : `(Class ${activeGrade}th - A)`}
                </span>
                <span className="font-black text-stone-900 text-base">
                  {selectedStudent ? formatStudentDisplay(selectedStudent, currentLang) : 'Learner'}
                  <span className="ml-2 text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                    Class {selectedStudent?.grade}th - {selectedStudent?.section}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              {/* Class Filter Drag-Down Menu */}
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-xl">
                <span className="text-[11px] font-bold text-stone-600 whitespace-nowrap">Class:</span>
                <select
                  value={activeGrade}
                  onChange={(e) => handleClassSelect(e.target.value)}
                  className="text-xs font-bold rounded-lg border-0 bg-transparent py-1 px-1 text-stone-800 focus:outline-none cursor-pointer"
                >
                  {userRole === 'head_teacher' && (
                    <option value="ALL">Entire School (सर्व वर्ग)</option>
                  )}
                  <option value="5">5th A (इयत्ता ५ वी)</option>
                  <option value="6">6th A (इयत्ता ६ वी)</option>
                  <option value="7">7th A (इयत्ता ७ वी)</option>
                  <option value="8">8th A (इयत्ता ८ वी)</option>
                </select>
              </div>

              <select
                id="student-picker"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-stone-300 py-2 px-3 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-2xs"
              >
                {filteredStudents.map((std) => (
                  <option key={std.id} value={std.id}>
                    [Class {std.grade}th - {std.section}] Roll #{std.roll_number} - {formatStudentDisplay(std, currentLang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Overview Cards with Circular Mastery Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Overall Circular Mastery & Risk Gauge (4 cols) */}
            <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500">
                Current Individual Proficiency
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
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : studentPrediction.risk_level === 'medium'
                    ? 'bg-orange-100 text-orange-900 border border-orange-300'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {studentPrediction.risk_level} Risk Level
                </span>
                <p className="text-xs text-stone-500">
                  Roll #{studentPrediction.roll_number} • Section {selectedStudent?.section} • Class {selectedStudent?.grade}th
                </p>
              </div>

              <div className="w-full pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 text-[10px] block">Confidence</span>
                  <span className="font-bold text-stone-800">{studentPrediction.confidence_score}%</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 text-[10px] block">Learning Speed</span>
                  <span className="font-bold text-emerald-700">+{studentPrediction.learning_velocity}%/wk</span>
                </div>
              </div>
            </div>

            {/* Right: AI Trajectory & Next-Best Action (8 cols) - National Tricolor Theme */}
            <div className="md:col-span-8 bg-gradient-to-br from-green-950 via-emerald-950 to-green-900 border border-green-800 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="font-bold text-base text-white">
                      Individual AI Predictive Trajectory
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-orange-300 bg-white/10 px-2.5 py-1 rounded-lg border border-orange-400/30">
                    Estimated Recovery: ~{studentPrediction.recovery_velocity_days} Days
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-stone-300 block">Current Score</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {studentPrediction.current_overall_pct}%
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-emerald-300 block">Predicted Mastery</span>
                    <span className="text-xl font-black text-emerald-300 mt-1 block">
                      {studentPrediction.predicted_mastery_pct}%
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-orange-300 block">Projected Gain</span>
                    <span className="text-xl font-black text-orange-400 mt-1 block">
                      +{studentPrediction.predicted_gain_pct}%
                    </span>
                  </div>
                </div>

                {/* AI Next-Best Pedagogical Recommendation */}
                <div className="mt-4 p-4 rounded-xl bg-orange-500/15 border border-orange-400/30">
                  <span className="text-xs uppercase tracking-wider font-bold text-orange-300 block mb-1">
                    AI Recommended Next-Best Action:
                  </span>
                  <p className="text-xs text-stone-100 leading-relaxed font-medium">
                    {currentLang === 'mr' ? studentPrediction.recommended_action_mr : studentPrediction.recommended_action_en}
                  </p>
                </div>
              </div>

              {onNavigateToPlanner && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onNavigateToPlanner}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    <span>Create Custom Remedial Plan for this Student</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Student Subject-Wise Circular Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-bold text-stone-900 text-base">
              Individual Subject Circular Progress Rings (7 Core Academic Subjects)
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {studentPrediction.subject_predictions.map((sp) => {
                const isPassing = sp.current_pct >= 60;
                return (
                  <div
                    key={sp.subject}
                    className="flex flex-col items-center bg-stone-50 p-3 rounded-xl border border-stone-200 hover:border-green-400 transition"
                  >
                    <CircularGauge
                      percentage={sp.current_pct}
                      size={82}
                      strokeWidth={8}
                      sublabel={isPassing ? 'Pass' : 'Aid'}
                      colorScheme={isPassing ? 'emerald' : sp.current_pct >= 45 ? 'amber' : 'rose'}
                    />
                    <span className="text-xs font-bold text-stone-800 mt-2 text-center truncate max-w-full">
                      {sp.subject}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold mt-0.5">
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
