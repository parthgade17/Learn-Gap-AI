import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Printer, Share2, CheckCircle, Clock, FileText, Filter } from 'lucide-react';
import { Student, Competency, RemedialActivity, RemedialPlan, StudentGroup } from '../types';
import { PrintablePlan } from './PrintablePlan';
import {
  getCompetencyTitle,
  getActivityTitle,
  getActivityReasoning
} from '../data/curriculumData';

interface RemedialPlannerViewProps {
  students: Student[];
  competencies: Competency[];
  activities: RemedialActivity[];
  plans: RemedialPlan[];
  selectedClassGrade?: string;
  onClassGradeChange?: (grade: string) => void;
  activeGroupForPlan: StudentGroup | null;
  onSavePlan: (plan: RemedialPlan) => Promise<void>;
  onClearActiveGroup: () => void;
}

export const RemedialPlannerView: React.FC<RemedialPlannerViewProps> = ({
  students,
  competencies,
  activities,
  plans,
  selectedClassGrade: externalClassGrade,
  onClassGradeChange,
  activeGroupForPlan,
  onSavePlan,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Selected Class Grade (5th A, 6th A, 7th A, 8th A, or All)
  const initialGrade = externalClassGrade || activeGroupForPlan?.students[0]?.student.grade?.toString() || '6';
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>(initialGrade);

  // Sync class grade if externalClassGrade changes
  useEffect(() => {
    if (externalClassGrade) {
      setSelectedClassGrade(externalClassGrade);
    }
  }, [externalClassGrade]);

  // Sync class grade if activeGroupForPlan changes
  useEffect(() => {
    if (activeGroupForPlan?.students[0]?.student.grade) {
      const g = activeGroupForPlan.students[0].student.grade.toString();
      setSelectedClassGrade(g);
      onClassGradeChange?.(g);
      setSelectedCompId(activeGroupForPlan.competency.id);
      setSelectedActivityId(activeGroupForPlan.suggestedActivity.id);
      setSelectedStudentIds(activeGroupForPlan.students.map(s => s.student.id));
    }
  }, [activeGroupForPlan]);

  // Selected Competency
  const [selectedCompId, setSelectedCompId] = useState<string>(
    activeGroupForPlan?.competency.id || competencies[0]?.id || ''
  );

  // Selected Activity
  const matchedActivities = activities.filter(a => a.competency_id === selectedCompId);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    activeGroupForPlan?.suggestedActivity.id || matchedActivities[0]?.id || ''
  );

  // Filter students and plans by selected class
  const classStudents = selectedClassGrade === 'ALL'
    ? students
    : students.filter(s => s.grade === parseInt(selectedClassGrade, 10));

  const classPlans = selectedClassGrade === 'ALL'
    ? plans
    : plans.filter(p => p.grade === parseInt(selectedClassGrade, 10));

  // Selected Students
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    activeGroupForPlan
      ? activeGroupForPlan.students.map(s => s.student.id)
      : classStudents.slice(0, 3).map(s => s.id)
  );

  // Handle class grade change
  const handleClassChange = (grade: string) => {
    setSelectedClassGrade(grade);
    onClassGradeChange?.(grade);
    const stdsInClass = grade === 'ALL'
      ? students
      : students.filter(s => s.grade === parseInt(grade, 10));
    const inClassIds = selectedStudentIds.filter(id => stdsInClass.some(s => s.id === id));
    if (inClassIds.length > 0) {
      setSelectedStudentIds(inClassIds);
    } else {
      setSelectedStudentIds(stdsInClass.slice(0, 3).map(s => s.id));
    }
  };

  // Schedule & Notes
  const [scheduledDay, setScheduledDay] = useState<string>(t('planner.schedulePlaceholder'));
  const [teacherNotes, setTeacherNotes] = useState<string>(t('planner.teacherNotesPlaceholder'));
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [activePlanId, setActivePlanId] = useState<string | null>(plans[0]?.id || null);

  const handleSelectSavedPlan = (planId: string) => {
    setActivePlanId(planId);
    const saved = plans.find(p => p.id === planId);
    if (saved) {
      if (saved.grade) {
        setSelectedClassGrade(saved.grade.toString());
      }
      setSelectedCompId(saved.competency_id);
      setSelectedActivityId(saved.activity_id);
      setSelectedStudentIds(saved.student_ids);
      setTeacherNotes(saved.teacher_notes);
      if (saved.scheduled_day) setScheduledDay(saved.scheduled_day);
      setIsApproved(saved.status === 'approved' || saved.status === 'completed');
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const currentComp = competencies.find(c => c.id === selectedCompId) || competencies[0];
  const currentActivity = activities.find(a => a.id === selectedActivityId) || matchedActivities[0] || activities[0];

  const currentGradeNum = selectedClassGrade !== 'ALL'
    ? parseInt(selectedClassGrade, 10)
    : (classStudents[0]?.grade || 6);

  // Current draft plan representation
  const draftPlan: RemedialPlan = {
    id: activePlanId || `plan-${Date.now()}`,
    school_id: 'ZP-KPG-01',
    grade: currentGradeNum,
    competency_id: currentComp.id,
    activity_id: currentActivity.id,
    plan_date: new Date().toISOString().split('T')[0],
    student_ids: selectedStudentIds.length > 0 ? selectedStudentIds : classStudents.slice(0, 4).map(s => s.id),
    status: isApproved ? 'approved' : 'draft',
    teacher_notes: teacherNotes,
    scheduled_day: scheduledDay,
    created_at: new Date().toISOString(),
    synced: false
  };

  const handleApproveAndSave = async () => {
    setIsApproved(true);
    await onSavePlan({
      ...draftPlan,
      status: 'approved'
    });
    alert(t('planner.planApprovedSuccess'));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const compTitle = getCompetencyTitle(currentComp, currentLang);
    const actTitle = getActivityTitle(currentActivity, currentLang);
    const studentCount = draftPlan.student_ids.length;

    const message = encodeURIComponent(
      `*${t('appName')} - ${t('planner.title')}*\n` +
      `${t('printable.officialHeading')}\n` +
      `${t('printable.gradeSectionLabel')} Class ${draftPlan.grade}th - Section A | ${t('printable.subjectLabel')} ${currentComp.subject}\n` +
      `${t('printable.targetCompHeading')}: ${compTitle} (${currentComp.code})\n` +
      `${t('planner.targetStudentsLabel')}: ${studentCount}\n` +
      `${t('planner.selectActivityLabel')}: ${actTitle}\n` +
      `${t('planner.activityDuration')}: ${currentActivity.estimated_minutes} ${t('planner.minutes')}\n` +
      `${t('printable.scheduleLabel')} ${scheduledDay}\n` +
      `${t('printable.statusLabel')} ${t('printable.statusApproved')}\n\n` +
      `_${t('appSubtitle')}_`
    );

    if (navigator.share) {
      navigator.share({
        title: `${t('appName')} - Remedial Plan`,
        text: `Remedial Plan for ${compTitle}`,
        url: window.location.href,
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Banner */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('planner.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {t('planner.subtitle')}
          </p>
        </div>

        {/* Class Selection & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Class Drag-down Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <label htmlFor="planner-class-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Class:
            </label>
            <select
              id="planner-class-select"
              value={selectedClassGrade}
              onChange={(e) => handleClassChange(e.target.value)}
              className="text-xs font-bold rounded-lg border border-slate-300 py-1 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
            >
              <option value="5">Class 5th - A (इयत्ता ५ वी)</option>
              <option value="6">Class 6th - A (इयत्ता ६ वी)</option>
              <option value="7">Class 7th - A (इयत्ता ७ वी)</option>
              <option value="8">Class 8th - A (इयत्ता ८ वी)</option>
              <option value="ALL">All Classes (सर्व वर्ग)</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t('planner.exportPdf')}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('planner.shareWhatsApp')}</span>
          </button>
        </div>
      </div>

      {/* Plan Customizer Form (Hidden on Print) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step 1: Select Competency & Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 text-xs flex items-center justify-center font-bold">1</span>
            <span>{t('planner.step1Title')}</span>
          </h3>

          {plans.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('planner.loadSavedPlan')}
              </label>
              <select
                value={activePlanId || ''}
                onChange={(e) => handleSelectSavedPlan(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-slate-300 py-1.5 px-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">{t('planner.createNewPlan')}</option>
                {classPlans.map((p, idx) => {
                  const comp = competencies.find(c => c.id === p.competency_id);
                  return (
                    <option key={p.id} value={p.id}>
                      [Class {p.grade}th-A] Plan #{idx + 1} - [{comp?.code}] ({p.status})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('planner.selectCompLabel')}
            </label>
            <select
              value={selectedCompId}
              onChange={(e) => {
                setSelectedCompId(e.target.value);
                const firstAct = activities.find(a => a.competency_id === e.target.value);
                if (firstAct) setSelectedActivityId(firstAct.id);
              }}
              className="w-full text-xs font-medium rounded-lg border border-slate-300 py-2 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {competencies.map(comp => (
                <option key={comp.id} value={comp.id}>
                  [{comp.code}] {getCompetencyTitle(comp, currentLang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('planner.selectActivityLabel')}
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-slate-300 py-2 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {matchedActivities.map(act => (
                <option key={act.id} value={act.id}>
                  {getActivityTitle(act, currentLang)} ({act.estimated_minutes} {t('planner.minutes')})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <div className="flex items-center gap-1 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentActivity.estimated_minutes} {t('planner.minutes')} {t('planner.activityDuration')}</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              {getActivityReasoning(currentActivity, currentLang)}
            </p>
          </div>
        </div>

        {/* Step 2: Schedule & Teacher Notes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 text-xs flex items-center justify-center font-bold">2</span>
            <span>{t('planner.step2Title')}</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('planner.scheduleForWeek')}
            </label>
            <input
              type="text"
              value={scheduledDay}
              onChange={(e) => setScheduledDay(e.target.value)}
              placeholder={t('planner.schedulePlaceholder')}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {t('planner.targetStudentsLabel')} ({selectedStudentIds.length} Selected)
              </label>
              <span className="text-[11px] font-bold text-slate-500">
                Class {selectedClassGrade !== 'ALL' ? `${selectedClassGrade}th-A` : 'All School'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50">
              {classStudents.map(st => {
                const isSelected = selectedStudentIds.includes(st.id);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => toggleStudent(st.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] opacity-75">#{st.roll_number}</span>
                    <span>{st.student_alias.split(' ')[0]}</span>
                    {isSelected && <span className="text-white text-[10px] font-black">&#10003;</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('planner.teacherNotesLabel')}
            </label>
            <textarea
              rows={3}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder={t('planner.teacherNotesPlaceholder')}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Step 3: Teacher-in-the-Loop Sign-off */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>{t('planner.step3Title')}</span>
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t('planner.approveNotice')}
            </p>

            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">{t('planner.ethicsNoticeTitle')}</span>
              {t('planner.ethicsNoticeBody')}
            </div>
          </div>

          <button
            onClick={handleApproveAndSave}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{t('planner.approvePlanBtn')}</span>
          </button>
        </div>

      </div>

      {/* The Printable / Exportable 1-Page Plan Canvas */}
      <div className="bg-slate-200/60 p-2 sm:p-6 rounded-2xl border border-slate-300">
        <div className="no-print flex items-center justify-between mb-2 px-2 text-xs text-slate-600">
          <span className="font-semibold">
            {t('planner.previewBanner')}
          </span>
          <span>{t('planner.previewSub')}</span>
        </div>

        <PrintablePlan
          plan={draftPlan}
          competency={currentComp}
          activity={currentActivity}
          students={students}
        />
      </div>

    </div>
  );
};
