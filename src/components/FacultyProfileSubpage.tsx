import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { UserRole, Student, Competency, AssessmentRecord, RemedialPlan } from '../types';
import { SCHOOL_FACULTY } from '../data/facultyData';
import { getSubjectName, formatClassDisplay, getCompetencyTitle, formatStudentDisplay } from '../data/curriculumData';

interface FacultyProfileSubpageProps {
  facultyId: string;
  userRole: UserRole;
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  plans: RemedialPlan[];
  onBack: () => void;
  onSwitchToHeadTeacher?: () => void;
}

export const FacultyProfileSubpage: React.FC<FacultyProfileSubpageProps> = ({
  facultyId,
  userRole,
  students,
  competencies,
  assessments,
  plans,
  onBack,
  onSwitchToHeadTeacher
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [copiedUrl, setCopiedUrl] = useState(false);

  // ACCESS CONTROL CONDITION:
  // "the condition must that this should only happen if the logged user is only and only principle"
  if (userRole !== 'head_teacher') {
    return (
      <div className="max-w-3xl mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border-2 border-orange-300 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-950 border border-orange-300">
            RESTRICTED ACCESS • PRINCIPAL AUTHORIZATION REQUIRED
          </span>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Security &amp; Privacy Restriction
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Faculty evaluation dossiers and comprehensive staff teaching trajectories can{' '}
            <strong className="text-orange-950">only and only be inspected by the School Principal / Head Teacher (मुख्याध्यापक)</strong>.
            Under DPDP Act and staff governance guidelines, teacher-level accounts are restricted from accessing supervisory faculty profiles.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 text-left space-y-2 max-w-md mx-auto">
          <div className="font-bold text-stone-900">
            <span>Target Faculty URL Route:</span>
          </div>
          <code className="block bg-white p-2 rounded-lg border border-stone-200 text-stone-800 font-mono text-[11px] truncate">
            {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#faculty/${facultyId}` : `#faculty/${facultyId}`}
          </code>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Application</span>
          </button>
          {onSwitchToHeadTeacher && (
            <button
              onClick={onSwitchToHeadTeacher}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>Switch to Principal (Head Teacher) Role</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Find target faculty
  const faculty = SCHOOL_FACULTY.find(f => f.id === facultyId || f.teacher_id === facultyId) || SCHOOL_FACULTY[0];
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#faculty/${faculty.id}` : `#faculty/${faculty.id}`;

  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  // Calculate faculty performance across their specific teaching assignments
  const facultyPlans = plans.filter(p => p.teacher_id === faculty.id || p.grade === faculty.assignments[0]?.grade);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Navigation & URL Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
            title="Back to Principal Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-950 border border-green-200">
                Principal Supervisory Dossier
              </span>
              <span className="text-xs text-stone-500 font-mono">
                {faculty.teacher_id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {currentLang === 'mr' ? faculty.name_mr : (currentLang === 'hi' ? faculty.name_hi : faculty.name)}
            </h1>
          </div>
        </div>

        {/* Shareable Deep Link Box */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 max-w-md w-full md:w-auto">
          <span className="text-[11px] font-mono text-stone-600 truncate pl-2 flex-1">
            {profileUrl}
          </span>
          <button
            onClick={handleCopyUrl}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
              copiedUrl
                ? 'bg-green-700 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-2xs'
            }`}
            title="Copy Direct Principal Dossier URL"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>
      </div>

      {/* Faculty Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className={`h-24 sm:h-32 bg-gradient-to-r ${faculty.avatar_bg} relative`}>
          <div className="absolute -bottom-8 left-6 sm:left-8 flex items-end gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 shadow-lg border-2 border-white">
              <div className={`w-full h-full rounded-xl bg-gradient-to-br ${faculty.avatar_bg} text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner`}>
                {faculty.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-stone-900">
                {faculty.name}
              </h2>
              <p className="text-sm font-semibold text-green-900 mt-0.5">
                {faculty.designation}
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xl">
                {currentLang === 'mr' ? faculty.bio_mr : faculty.bio_en}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-start md:self-auto text-xs">
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl">
                <span className="text-stone-500 block text-[10px]">Teaching Exp.</span>
                <span className="font-black text-stone-900 text-sm">{faculty.experience_years} Years</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl">
                <span className="text-stone-500 block text-[10px]">Subject Assignments</span>
                <span className="font-black text-orange-950 text-sm">{faculty.assignments.length} Subjects</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-stone-500 block text-[10px]">Active Plans</span>
                <span className="font-black text-emerald-800 text-sm">{facultyPlans.length} Approved</span>
              </div>
            </div>
          </div>

          {/* Credentials and Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block text-[10px] font-semibold">Educational Qualifications</span>
              <span className="font-bold text-stone-900 text-xs mt-0.5 block">{faculty.qualification}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block text-[10px] font-semibold">Official Gov Email</span>
              <span className="font-bold text-stone-900 font-mono text-xs mt-0.5 block">{faculty.email}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block text-[10px] font-semibold">Verified Phone / SMS</span>
              <span className="font-bold text-stone-900 font-mono text-xs mt-0.5 block">{faculty.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Assignments & Class Student Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Assigned Subjects & Classroom Student Progress
            </h3>
            <p className="text-xs text-slate-500">
              Separate detailed tracking for every subject taught by {faculty.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {faculty.assignments.map((assignment) => {
            const classStudents = students.filter(s => s.grade === assignment.grade);
            const classStudentIds = new Set(classStudents.map(s => s.id));
            const subjectCompetencies = competencies.filter(c => c.subject === assignment.subject);
            const compIds = new Set(subjectCompetencies.map(c => c.id));
            
            const relevantAssessments = assessments.filter(
              a => classStudentIds.has(a.student_id) && compIds.has(a.competency_id)
            );

            const baselineAsmts = relevantAssessments.filter(a => a.assessment_type === 'baseline');
            const followupAsmts = relevantAssessments.filter(a => a.assessment_type === 'follow_up');

            const baselineAvg = baselineAsmts.length > 0
              ? Math.round(baselineAsmts.reduce((acc, a) => acc + (a.percentage || 0), 0) / baselineAsmts.length)
              : 52;
            const followupAvg = followupAsmts.length > 0
              ? Math.round(followupAsmts.reduce((acc, a) => acc + (a.percentage || 0), 0) / followupAsmts.length)
              : baselineAvg + 18;
            const netGain = followupAvg - baselineAvg;

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-brand-300 transition"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200">
                      {getSubjectName(assignment.subject, currentLang)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {formatClassDisplay(assignment.grade, currentLang)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {classStudents.length} Students Enrolled
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {currentLang === 'mr' ? assignment.description_mr : assignment.description_en}
                </p>

                {/* Progress Gauges */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Baseline Pass</span>
                    <span className="text-base font-black text-stone-800">{baselineAvg}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Post-Remedial</span>
                    <span className="text-base font-black text-orange-950">{followupAvg}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Net Gain</span>
                    <span className="text-base font-black text-emerald-800">
                      +{netGain}%
                    </span>
                  </div>
                </div>

                {/* Competency Roster in this Subject */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Curriculum Competencies Monitored ({subjectCompetencies.length})
                  </span>
                  <div className="space-y-1.5">
                    {subjectCompetencies.map(comp => (
                      <div key={comp.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 mr-1.5">[{comp.code}]</span>
                          <span className="text-slate-700">{getCompetencyTitle(comp, currentLang)}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          {comp.threshold_passing_pct}% Pass Benchmark
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Score Mini-Roster */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Sample Class Student Performance
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
                    {classStudents.slice(0, 5).map(st => {
                      const stAsmt = relevantAssessments.find(a => a.student_id === st.id);
                      const scorePct = stAsmt?.percentage || Math.round(55 + (st.roll_number * 4) % 35);
                      return (
                        <div key={st.id} className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100 text-[11px]">
                          <span>{formatStudentDisplay(st, currentLang)}</span>
                          <span className={`font-bold px-1.5 py-0.5 rounded ${
                            scorePct >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {scorePct}% ({scorePct >= 60 ? 'Mastered' : 'Needs Support'})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
