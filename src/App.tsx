import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, seedInitialDataIfEmpty } from './db/indexedDB';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { InstallAppBanner } from './components/InstallAppBanner';
import { AssessmentManager } from './components/AssessmentManager';
import { GapAnalysisView } from './components/GapAnalysisView';
import { RemedialPlannerView } from './components/RemedialPlannerView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { DPDPComplianceModal } from './components/DPDPComplianceModal';
import { UserRole, StudentGroup, AssessmentRecord, RemedialPlan } from './types';
import { diagnoseGaps } from './engine/gapEngine';
import { WifiOff, Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('assessment');
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeGroupForPlan, setActiveGroupForPlan] = useState<StudentGroup | null>(null);

  // Initialize Dexie.js offline DB
  useEffect(() => {
    seedInitialDataIfEmpty().catch(console.error);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live Reactive Queries from IndexedDB
  const students = useLiveQuery(() => db.students.toArray()) || [];
  const competencies = useLiveQuery(() => db.competencies.toArray()) || [];
  const activities = useLiveQuery(() => db.activities.toArray()) || [];
  const assessments = useLiveQuery(() => db.assessments.toArray()) || [];
  const plans = useLiveQuery(() => db.plans.toArray()) || [];

  // Compute urgent gaps count for navigation pill badge
  const diagnoses = diagnoseGaps(students, competencies, assessments);
  const urgentGapsCount = diagnoses.filter(d => d.severity === 'high').length;

  // Handlers
  const handleAddAssessment = async (asmtData: Omit<AssessmentRecord, 'id'>) => {
    const newId = `asmt-${Date.now()}`;
    await db.assessments.put({
      ...asmtData,
      id: newId
    });

    // Queue for Supabase sync
    await db.syncQueue.put({
      id: `sync-${Date.now()}`,
      action: 'insert',
      table: 'assessments',
      payload: { ...asmtData, id: newId },
      created_at: new Date().toISOString()
    });
  };

  const handleBatchUpload = async (records: Omit<AssessmentRecord, 'id'>[]) => {
    const fullRecords = records.map((r, i) => ({
      ...r,
      id: `asmt-csv-${Date.now()}-${i}`
    }));
    await db.assessments.bulkPut(fullRecords);
  };

  const handleDeleteAssessment = async (id: string) => {
    await db.assessments.delete(id);
  };

  const handleSavePlan = async (plan: RemedialPlan) => {
    await db.plans.put(plan);
    // Queue sync
    await db.syncQueue.put({
      id: `sync-plan-${Date.now()}`,
      action: 'insert',
      table: 'remedial_plans',
      payload: plan,
      created_at: new Date().toISOString()
    });
  };

  const handleToggleConsent = async (studentId: string) => {
    const student = await db.students.get(studentId);
    if (student) {
      await db.students.update(studentId, {
        parental_consent_verified: !student.parental_consent_verified
      });
    }
  };

  const handleSelectGroupForPlan = (group: StudentGroup) => {
    setActiveGroupForPlan(group);
    setActiveTab('planner');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isOnline={isOnline}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Responsive Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        urgentGapsCount={urgentGapsCount}
      />

      {/* One-Tap PWA Install App Banner */}
      <InstallAppBanner />

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="no-print bg-amber-500 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-1.5 shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t('common.offlineBanner')}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 sm:pb-8">
        {activeTab === 'assessment' && (
          <AssessmentManager
            students={students}
            competencies={competencies}
            assessments={assessments}
            onAddAssessment={handleAddAssessment}
            onBatchUpload={handleBatchUpload}
            onDeleteAssessment={handleDeleteAssessment}
          />
        )}

        {activeTab === 'gaps' && (
          <GapAnalysisView
            students={students}
            competencies={competencies}
            assessments={assessments}
            activities={activities}
            onSelectGroupForPlan={handleSelectGroupForPlan}
          />
        )}

        {activeTab === 'planner' && (
          <RemedialPlannerView
            students={students}
            competencies={competencies}
            activities={activities}
            plans={plans}
            activeGroupForPlan={activeGroupForPlan}
            onSavePlan={handleSavePlan}
            onClearActiveGroup={() => setActiveGroupForPlan(null)}
          />
        )}

        {activeTab === 'dashboard' && (
          <ProgressDashboard
            students={students}
            competencies={competencies}
            assessments={assessments}
            plans={plans}
            userRole={currentRole}
          />
        )}

        {activeTab === 'privacy' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">
                {t('dpdp.title')}
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {t('dpdp.subtitle')}
            </p>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
            >
              {t('dpdp.consentRegisterTitle')}
            </button>
          </div>
        )}
      </main>

      {/* DPDP Compliance Modal */}
      <DPDPComplianceModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        students={students}
        onToggleConsent={handleToggleConsent}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {t('appName')} • {t('competitionBadge')} • {t('schoolName')}
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            NIPUN Bharat &amp; PARAKH Compliant PWA
          </span>
        </div>
      </footer>

    </div>
  );
};
