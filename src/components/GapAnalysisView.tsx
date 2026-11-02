import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Users, AlertCircle, CheckCircle, ArrowRight, BookOpen, Filter } from 'lucide-react';
import { Student, Competency, RemedialActivity, AssessmentRecord, StudentGroup, SubjectType } from '../types';
import { diagnoseGaps, groupLearnersForRemediation } from '../engine/gapEngine';
import { getCompetencyTitle, getCompetencyDescription, getActivityTitle, ALL_SUBJECTS } from '../data/curriculumData';

interface GapAnalysisViewProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  activities: RemedialActivity[];
  onSelectGroupForPlan: (group: StudentGroup) => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  students,
  competencies,
  assessments,
  activities,
  onSelectGroupForPlan,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isEnglish = currentLang === 'en';

  const [selectedSubject, setSelectedSubject] = useState<'ALL' | SubjectType>('ALL');
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>('ALL');

  // Filter learners and assessments by selected class
  const filteredStudents = selectedClassGrade === 'ALL'
    ? students
    : students.filter(s => s.grade === parseInt(selectedClassGrade, 10));

  const filteredStudentIds = new Set(filteredStudents.map(s => s.id));
  const filteredAssessments = assessments.filter(a => filteredStudentIds.has(a.student_id));

  // Run on-device deterministic gap engine
  const diagnoses = diagnoseGaps(filteredStudents, competencies, filteredAssessments);
  const groups = groupLearnersForRemediation(diagnoses, filteredStudents, competencies, activities);

  const urgentCount = diagnoses.filter(d => d.severity === 'high').length;
  const moderateCount = diagnoses.filter(d => d.severity === 'moderate').length;
  const masteredCount = diagnoses.filter(d => d.severity === 'mastered').length;

  const filteredGroups = selectedSubject === 'ALL'
    ? groups
    : groups.filter(g => g.competency.subject === selectedSubject);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-100 text-brand-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('gaps.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {t('gaps.subtitle')}
          </p>
        </div>

        {/* Class & Subject Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Class Drag-Down Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <label htmlFor="gap-class-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Class:
            </label>
            <select
              id="gap-class-select"
              value={selectedClassGrade}
              onChange={(e) => setSelectedClassGrade(e.target.value)}
              className="text-xs font-bold rounded-lg border border-slate-300 py-1 px-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Classes (सर्व वर्ग)</option>
              <option value="5">Class 5th - A (इयत्ता ५ वी)</option>
              <option value="6">Class 6th - A (इयत्ता ६ वी)</option>
              <option value="7">Class 7th - A (इयत्ता ७ वी)</option>
              <option value="8">Class 8th - A (इयत्ता ८ वी)</option>
            </select>
          </div>

          {/* Subject Filter Dropdown / Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedSubject('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                selectedSubject === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Subjects
            </button>
            {ALL_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-rose-700 tracking-wider">
              {t('gaps.urgentRemediation')}
            </span>
            <div className="text-2xl font-bold text-rose-900 mt-1">
              {urgentCount}
            </div>
            <span className="text-xs text-rose-600">{t('gaps.urgentSub')}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-200/70 flex items-center justify-center text-rose-800">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-amber-700 tracking-wider">
              {t('gaps.moderateRemediation')}
            </span>
            <div className="text-2xl font-bold text-amber-900 mt-1">
              {moderateCount}
            </div>
            <span className="text-xs text-amber-600">{t('gaps.moderateSub')}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-200/70 flex items-center justify-center text-amber-800">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-700 tracking-wider">
              {t('gaps.mastered')}
            </span>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {masteredCount}
            </div>
            <span className="text-xs text-emerald-600">{t('gaps.masteredSub')}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-200/70 flex items-center justify-center text-emerald-800">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Transparent Rules Explainer Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-sm text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">
              {t('gaps.rulesTitle')}
            </span>
            <p className="text-slate-300 mt-1 leading-relaxed">
              {t('gaps.rulesBody')}
            </p>
          </div>
        </div>
      </div>

      {/* Competency Group Clusters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{t('gaps.clustersTitle')}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredGroups.length}
            </span>
          </h3>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            {t('gaps.noGapsMessage')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGroups.map((group) => {
              const comp = group.competency;
              const isUrgent = group.urgency === 'high';
              const activityTitle = getActivityTitle(group.suggestedActivity, currentLang);
              const reasoningText = isEnglish ? group.reasoning_en : (currentLang === 'mr' ? group.reasoning_mr : group.reasoning_en);

              return (
                <div
                  key={comp.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                    isUrgent ? 'border-rose-200 hover:border-rose-300' : 'border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <div>
                    {/* Header: Subject & Urgency Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                        {comp.subject} • {comp.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isUrgent ? t('urgency.highUrgency') : t('urgency.moderatePriority')}
                      </span>
                    </div>

                    {/* Competency Title */}
                    <h4 className="font-bold text-base text-slate-900">
                      {getCompetencyTitle(comp, currentLang)}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {getCompetencyDescription(comp, currentLang)}
                    </p>

                    {/* Student List in Group */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>{group.students.length} {t('gaps.studentsCount')}</span>
                        </span>
                        <span className="text-slate-400">{t('gaps.targetPct')} {comp.threshold_passing_pct}%</span>
                      </div>

                      {/* Student Chips */}
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {group.students.map(({ student, score_pct }) => (
                          <span
                            key={student.id}
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${
                              score_pct < 40
                                ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <span className="font-bold text-[9px] bg-white/80 px-1 rounded border border-slate-200">
                              {student.grade}th-A
                            </span>
                            <span>#{student.roll_number}</span>
                            <span className="text-[10px] opacity-75">({score_pct}%)</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Activity Teaser */}
                    <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider text-brand-700">
                        {t('gaps.suggestedActivityLabel')}
                      </span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {activityTitle}
                      </p>
                      <p className="text-slate-600 text-[11px] mt-1 italic">
                        "{reasoningText}"
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onSelectGroupForPlan(group)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition shadow-sm"
                    >
                      <span>{t('gaps.createPlanBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
