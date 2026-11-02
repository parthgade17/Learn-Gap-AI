import React from 'react';
import { useTranslation } from 'react-i18next';
import { Competency, RemedialActivity, Student, RemedialPlan } from '../types';
import { CheckCircle2, Calendar, Clock, School, UserCheck } from 'lucide-react';
import {
  getCompetencyTitle,
  getCompetencyDescription,
  getActivityTitle,
  getActivityInstructions,
  getActivityMaterials,
  getActivityReasoning
} from '../data/curriculumData';

interface PrintablePlanProps {
  plan: RemedialPlan;
  competency: Competency;
  activity: RemedialActivity;
  students: Student[];
}

export const PrintablePlan: React.FC<PrintablePlanProps> = ({
  plan,
  competency,
  activity,
  students,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const planStudents = students.filter(s => plan.student_ids.includes(s.id));
  const isApproved = plan.status === 'approved' || plan.status === 'completed';

  return (
    <div
      id="printable-action-plan"
      className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm max-w-3xl mx-auto my-4 text-slate-900 page-break-avoid"
      style={{ minHeight: '842px', width: '100%' }}
    >
      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xl">
              <School className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                {t('printable.officialHeading')}
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                {t('printable.planSubtitle')}
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              {t('printable.competitionHeader')}
            </span>
            <p className="text-slate-500 text-[10px] mt-1">{t('printable.udiseCode')}</p>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">{t('printable.gradeSectionLabel')}</span>
            <span className="font-bold text-slate-800">{t('printable.gradeSectionVal')}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">{t('printable.subjectLabel')}</span>
            <span className="font-bold text-slate-800">
              {competency.subject}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">{t('printable.scheduleLabel')}</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-700" />
              {plan.scheduled_day || 'Week 1'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">{t('printable.statusLabel')}</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {isApproved ? t('printable.statusApproved') : t('printable.statusDraft')}
            </span>
          </div>
        </div>
      </div>

      {/* Target Competency Banner */}
      <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            {t('printable.targetCompHeading')} • {competency.code}
          </span>
          <span className="text-[11px] font-semibold text-slate-600">
            {t('printable.passThresholdLabel')} {competency.threshold_passing_pct}%
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
          {getCompetencyTitle(competency, currentLang)}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          {getCompetencyDescription(competency, currentLang)}
        </p>
      </div>

      {/* Target Learners Section */}
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-1.5 flex items-center gap-1.5">
          <span>{t('printable.targetLearnersHeading')} ({planStudents.length})</span>
        </h3>
        <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-300 text-[11px] text-slate-700">
              <tr>
                <th className="py-1 px-3">{t('printable.tableRoll')}</th>
                <th className="py-1 px-3">{t('printable.tableLearner')}</th>
                <th className="py-1 px-3">{t('printable.tableLevel')}</th>
                <th className="py-1 px-3 text-right">{t('printable.tableConsent')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {planStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-1 px-3 font-bold">#{st.roll_number}</td>
                  <td className="py-1 px-3">{`Learner ${st.roll_number}`}</td>
                  <td className="py-1 px-3 text-amber-800 font-medium">{t('printable.remedialNeeded')}</td>
                  <td className="py-1 px-3 text-right text-emerald-700 font-semibold">{t('printable.consentVerified')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Teacher-Reviewed Activity */}
      <div className="p-4 border-2 border-emerald-700/60 rounded-xl bg-emerald-50/30 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-emerald-900 tracking-wider">
            {t('printable.activityHeading')}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            {activity.estimated_minutes} {t('planner.minutes')}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900">
          {getActivityTitle(activity, currentLang)}
        </h3>

        {/* Step-by-step instructions */}
        <div className="mt-2 text-xs text-slate-700 space-y-1.5">
          <p className="font-semibold text-slate-800">{t('printable.procedureLabel')}</p>
          <p className="leading-relaxed bg-white p-2.5 rounded border border-emerald-200">
            {getActivityInstructions(activity, currentLang)}
          </p>
        </div>

        {/* Materials */}
        <div className="mt-2 text-xs flex items-start gap-2">
          <span className="font-bold text-slate-800 shrink-0">{t('printable.materialsLabel')}</span>
          <span className="text-slate-600">
            {getActivityMaterials(activity, currentLang)}
          </span>
        </div>

        {/* Pedagogical Reason */}
        <div className="mt-2 text-[11px] text-slate-600 italic bg-amber-50 p-2 rounded border border-amber-200">
          <span className="font-bold text-amber-900 not-italic">{t('printable.reasoningLabel')} </span>
          {getActivityReasoning(activity, currentLang)}
        </div>
      </div>

      {/* Teacher Notes & Customization */}
      {plan.teacher_notes && (
        <div className="mb-4 text-xs">
          <span className="font-bold text-slate-700">{t('printable.teacherNotesHeading')}</span>
          <p className="mt-0.5 text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            {plan.teacher_notes}
          </p>
        </div>
      )}

      {/* Teacher-in-the-Loop Verification Sign-off Box */}
      <div className="mt-auto pt-4 border-t-2 border-slate-800 grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-emerald-700 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">{t('printable.signOffTitle')}</p>
            <p className="text-[10px] text-slate-500">
              {t('printable.signOffDeclaration')}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block border-b border-slate-400 w-36 mb-1"></div>
          <p className="font-bold text-slate-800">{t('printable.teacherSignatureLabel')}</p>
          <p className="text-[10px] text-slate-500">{t('printable.dateLabel')} {plan.plan_date}</p>
        </div>
      </div>

    </div>
  );
};
