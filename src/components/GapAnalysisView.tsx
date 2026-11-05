import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Filter } from 'lucide-react';
import { Student, Competency, RemedialActivity, AssessmentRecord, StudentGroup, SubjectType } from '../types';
import { diagnoseGaps, groupLearnersForRemediation } from '../engine/gapEngine';
import { getCompetencyTitle, getCompetencyDescription, getActivityTitle, ALL_SUBJECTS, formatClassDisplay, getSubjectName } from '../data/curriculumData';

interface GapAnalysisViewProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  activities: RemedialActivity[];
  selectedClassGrade?: string;
  onClassGradeChange?: (grade: string) => void;
  onSelectGroupForPlan: (group: StudentGroup) => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  students,
  competencies,
  assessments,
  activities,
  selectedClassGrade: externalClassGrade,
  onClassGradeChange,
  onSelectGroupForPlan,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isEnglish = currentLang === 'en';

  const [selectedSubject, setSelectedSubject] = useState<'ALL' | SubjectType>('ALL');
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>(externalClassGrade || 'ALL');

  // Sync with global class selection
  React.useEffect(() => {
    if (externalClassGrade) {
      setSelectedClassGrade(externalClassGrade);
    }
  }, [externalClassGrade]);

  const handleClassChange = (grade: string) => {
    setSelectedClassGrade(grade);
    onClassGradeChange?.(grade);
  };

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
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {t('gaps.title')}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t('gaps.subtitle')}
          </p>
        </div>

        {/* Class & Subject Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Class Drag-Down Selector */}
          <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1.5 rounded-xl border border-stone-200">
            <Filter className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <label htmlFor="gap-class-select" className="text-xs font-bold text-stone-700 whitespace-nowrap">
              {t('dashboard.selectClass') || 'Select Class'}
            </label>
            <select
              id="gap-class-select"
              value={selectedClassGrade}
              onChange={(e) => handleClassChange(e.target.value)}
              className="text-xs font-bold rounded-lg border border-stone-300 py-1 px-2 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">{formatClassDisplay('ALL', currentLang)}</option>
              <option value="5">{formatClassDisplay('5', currentLang)}</option>
              <option value="6">{formatClassDisplay('6', currentLang)}</option>
              <option value="7">{formatClassDisplay('7', currentLang)}</option>
              <option value="8">{formatClassDisplay('8', currentLang)}</option>
            </select>
          </div>

          {/* Subject Filter Dropdown / Pills */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedSubject('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                selectedSubject === 'ALL'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('subjects.all')}
            </button>
            {ALL_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-green-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {getSubjectName(sub, currentLang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards - National Tricolor Theme (Orange, Amber, Green) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold uppercase text-orange-800 tracking-wider">
              {t('gaps.urgentRemediation')}
            </span>
            <div className="text-2xl font-black text-orange-950 mt-1">
              {urgentCount}
            </div>
            <span className="text-xs text-orange-700">{t('gaps.urgentSub')}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">
              {t('gaps.moderateRemediation')}
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {moderateCount}
            </div>
            <span className="text-xs text-amber-700">{t('gaps.moderateSub')}</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
              {t('gaps.mastered')}
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {masteredCount}
            </div>
            <span className="text-xs text-emerald-700">{t('gaps.masteredSub')}</span>
          </div>
        </div>

      </div>

      {/* Transparent Rules Explainer Box */}
      <div className="bg-gradient-to-r from-green-950 via-emerald-950 to-green-900 border border-green-800 text-white p-4 sm:p-5 rounded-2xl shadow-xs text-xs sm:text-sm">
        <div>
          <span className="font-bold text-orange-300 block mb-1">
            {t('gaps.rulesTitle')}
          </span>
          <p className="text-stone-200 leading-relaxed">
            {t('gaps.rulesBody')}
          </p>
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
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition hover:shadow-sm flex flex-col justify-between ${
                    isUrgent ? 'border-orange-300 hover:border-orange-400' : 'border-stone-200 hover:border-green-400'
                  }`}
                >
                  <div>
                    {/* Header: Subject & Urgency Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-900 border border-stone-200">
                        {getSubjectName(comp.subject, currentLang)} • {comp.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isUrgent ? 'bg-orange-100 text-orange-950 border border-orange-300' : 'bg-amber-100 text-amber-950 border border-amber-300'
                        }`}
                      >
                        {isUrgent ? t('urgency.highUrgency') : t('urgency.moderatePriority')}
                      </span>
                    </div>

                    {/* Competency Title */}
                    <h4 className="font-bold text-base text-stone-900">
                      {getCompetencyTitle(comp, currentLang)}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {getCompetencyDescription(comp, currentLang)}
                    </p>

                    {/* Student List in Group */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
                        <span>
                          <strong>{group.students.length}</strong> {t('gaps.studentsCount')}
                        </span>
                        <span className="text-stone-400">{t('gaps.targetPct')} {comp.threshold_passing_pct}%</span>
                      </div>

                      {/* Student Chips */}
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {group.students.map(({ student, score_pct }) => (
                          <span
                            key={student.id}
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${
                              score_pct < 40
                                ? 'bg-orange-50 text-orange-950 border-orange-300 font-bold'
                                : 'bg-amber-50 text-amber-950 border-amber-300'
                            }`}
                          >
                            <span className="font-bold text-[9px] bg-white/80 px-1 rounded border border-stone-200">
                              {formatClassDisplay(student.grade, currentLang)}
                            </span>
                            <span>#{student.roll_number}</span>
                            <span className="text-[10px] opacity-75">({score_pct}%)</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Activity Teaser */}
                    <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <span className="font-bold text-green-950 block text-[11px] uppercase tracking-wider">
                        {t('gaps.suggestedActivityLabel')}
                      </span>
                      <p className="font-bold text-stone-900 mt-0.5">
                        {activityTitle}
                      </p>
                      <p className="text-stone-600 text-[11px] mt-1 italic">
                        "{reasoningText}"
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => onSelectGroupForPlan(group)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
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
