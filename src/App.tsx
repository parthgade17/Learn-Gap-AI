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
import { HeadTeacherDashboard } from './components/HeadTeacherDashboard';
import { FacultyProfileSubpage } from './components/FacultyProfileSubpage';
import { DPDPComplianceModal } from './components/DPDPComplianceModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { GovAccessibilityToolbar } from './components/GovAccessibilityToolbar';
import { GovAccessibilityModal } from './components/GovAccessibilityModal';
import { GovFooter } from './components/GovFooter';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { UserRole, StudentGroup, AssessmentRecord, RemedialPlan } from './types';
import { diagnoseGaps } from './engine/gapEngine';
import {
  syncAssessmentInsert,
  syncAssessmentUpsert,
  syncAssessmentUpdate,
  syncAssessmentDelete,
  syncRemedialPlan,
  subscribeToRealtimeChanges
} from './lib/supabaseClient';
import { WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>('6');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeGroupForPlan, setActiveGroupForPlan] = useState<StudentGroup | null>(null);

  // PWA Install State
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Dedicated Faculty Subpage Route State (#faculty/:id)
  const [activeFacultyProfileId, setActiveFacultyProfileId] = useState<string | null>(null);

  // GIGW 3.0 Mandatory Accessibility States
  const [fontScale, setFontScale] = useState<'sm' | 'normal' | 'lg'>(() => {
    return (localStorage.getItem('gov_font_scale') as 'sm' | 'normal' | 'lg') || 'normal';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('gov_high_contrast') === 'true';
  });
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isToolbarLangModalOpen, setIsToolbarLangModalOpen] = useState<boolean>(false);

  // Synchronize font scale & high contrast theme to root <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-sm', 'font-scale-normal', 'font-scale-lg');
    root.classList.add(`font-scale-${fontScale}`);
    localStorage.setItem('gov_font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('gov_high_contrast', String(highContrast));
  }, [highContrast]);

  // Hash URL listener for deep-linking & Principal search redirection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#faculty/')) {
        const fid = hash.replace('#faculty/', '').trim();
        if (fid) {
          setActiveFacultyProfileId(fid);
        }
      } else if (hash === '' || !hash.startsWith('#faculty/')) {
        setActiveFacultyProfileId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'head_teacher') {
      setActiveTab('dashboard');
      setSelectedClassGrade('ALL');
    } else if (role === 'teacher' && selectedClassGrade === 'ALL') {
      setSelectedClassGrade('6');
    }
  };

  // Guard: when logged in as Head Teacher, strictly ensure ONLY the Progress Dashboard is active
  useEffect(() => {
    if (currentRole === 'head_teacher' && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  }, [currentRole, activeTab]);

  // Initialize Dexie.js offline DB, PWA install prompts, and Realtime Supabase listeners
  useEffect(() => {
    seedInitialDataIfEmpty().catch(console.error);

    // Detect standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to realtime database updates
    const unsubscribe = subscribeToRealtimeChanges(
      () => {
        console.log('Realtime change received on assessments');
      },
      () => {
        console.log('Realtime change received on remedial plans');
      }
    );

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Live Reactive Queries from IndexedDB (Dexie live queries automatically re-render on any change)
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
    const newRecord: AssessmentRecord = {
      ...asmtData,
      id: newId
    };

    // 1. Local IndexedDB
    await db.assessments.put(newRecord);

    // 2. Queue for offline sync
    await db.syncQueue.put({
      id: `sync-${Date.now()}`,
      action: 'insert',
      table: 'assessments',
      payload: newRecord,
      created_at: new Date().toISOString()
    });

    // 3. Live Supabase sync
    await syncAssessmentInsert(newRecord);
  };

  const handleUpdateAssessment = async (id: string, updates: Partial<AssessmentRecord>) => {
    // 1. Update local IndexedDB
    await db.assessments.update(id, updates);
    const fullRecord = await db.assessments.get(id);

    // 2. Queue for sync
    await db.syncQueue.put({
      id: `sync-update-${Date.now()}`,
      action: 'update',
      table: 'assessments',
      payload: fullRecord || { id, ...updates },
      created_at: new Date().toISOString()
    });

    // 3. Live Supabase sync (always upsert full record so row is guaranteed to exist in DB)
    if (fullRecord) {
      await syncAssessmentUpsert(fullRecord);
    } else {
      await syncAssessmentUpdate(id, updates);
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    // 1. Local IndexedDB
    await db.assessments.delete(id);

    // 2. Queue for sync
    await db.syncQueue.put({
      id: `sync-del-${Date.now()}`,
      action: 'delete',
      table: 'assessments',
      payload: { id },
      created_at: new Date().toISOString()
    });

    // 3. Live Supabase sync
    await syncAssessmentDelete(id);
  };

  const handleBatchUpload = async (records: Omit<AssessmentRecord, 'id'>[]) => {
    const fullRecords = records.map((r, i) => ({
      ...r,
      id: `asmt-csv-${Date.now()}-${i}`
    }));
    await db.assessments.bulkPut(fullRecords);
    for (const r of fullRecords) {
      syncAssessmentInsert(r).catch(console.warn);
    }
  };

  const handleSavePlan = async (plan: RemedialPlan) => {
    await db.plans.put(plan);
    await db.syncQueue.put({
      id: `sync-plan-${Date.now()}`,
      action: 'insert',
      table: 'remedial_plans',
      payload: plan,
      created_at: new Date().toISOString()
    });
    await syncRemedialPlan(plan);
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
      
      {/* 0. GIGW 3.0 Mandatory Skip to Main Content Link (Keyboard Focused) */}
      <a href="#main-content" className="skip-to-main-link">
        {t('gov.skipToMain') || 'Skip to Main Content'}
      </a>

      {/* 1. GIGW 3.0 Mandatory Top Accessibility & Government Identification Toolbar */}
      <GovAccessibilityToolbar
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        onOpenAccessibilityModal={() => setIsAccessibilityModalOpen(true)}
        onOpenLanguageModal={() => setIsToolbarLangModalOpen(true)}
      />

      {/* 2. Official Institutional Government Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedClassGrade={selectedClassGrade}
        onClassGradeChange={setSelectedClassGrade}
        isOnline={isOnline}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
      />

      {/* 3. Responsive Institutional Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (currentRole === 'head_teacher') {
            setActiveTab('dashboard');
          } else {
            setActiveTab(tab);
          }
        }}
        urgentGapsCount={urgentGapsCount}
        userRole={currentRole}
      />

      {/* 4. One-Tap PWA Install App Banner */}
      <InstallAppBanner
        onOpenModal={() => setIsInstallModalOpen(true)}
        installPrompt={installPrompt}
        isInstalled={isInstalled}
      />

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="no-print bg-amber-500 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-1.5 shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t('common.offlineBanner')}</span>
        </div>
      )}

      {/* 5. Main Tab Content (Accessible Main Landmark) */}
      <main
        id="main-content"
        tabIndex={-1}
        role="main"
        aria-label="Portal Main Content"
        className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 sm:pb-8 focus:outline-hidden"
      >
        {activeFacultyProfileId ? (
          <FacultyProfileSubpage
            facultyId={activeFacultyProfileId}
            userRole={currentRole}
            students={students}
            competencies={competencies}
            assessments={assessments}
            plans={plans}
            onBack={() => {
              setActiveFacultyProfileId(null);
              window.location.hash = '';
            }}
            onSwitchToHeadTeacher={() => {
              setCurrentRole('head_teacher');
            }}
          />
        ) : currentRole === 'head_teacher' ? (
          /* For Head Teacher: ONLY Progress Dashboard is visible, no other dashboards */
          <HeadTeacherDashboard
            students={students}
            competencies={competencies}
            assessments={assessments}
            plans={plans}
            userRole={currentRole}
            onOpenFacultyProfile={(fid) => {
              setActiveFacultyProfileId(fid);
              window.location.hash = `#faculty/${fid}`;
            }}
          />
        ) : (
          /* For Classroom Teacher: All standard workflow dashboards available */
          <>
            {activeTab === 'assessment' && (
              <AssessmentManager
                students={students}
                competencies={competencies}
                assessments={assessments}
                selectedClassGrade={selectedClassGrade}
                onClassGradeChange={setSelectedClassGrade}
                onAddAssessment={handleAddAssessment}
                onUpdateAssessment={handleUpdateAssessment}
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
                selectedClassGrade={selectedClassGrade}
                onClassGradeChange={setSelectedClassGrade}
                onSelectGroupForPlan={handleSelectGroupForPlan}
              />
            )}

            {activeTab === 'planner' && (
              <RemedialPlannerView
                students={students}
                competencies={competencies}
                activities={activities}
                plans={plans}
                selectedClassGrade={selectedClassGrade}
                onClassGradeChange={setSelectedClassGrade}
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
                selectedClassGrade={selectedClassGrade}
                onClassGradeChange={setSelectedClassGrade}
                onNavigateToAssessment={() => setActiveTab('assessment')}
                onNavigateToPlanner={() => setActiveTab('planner')}
              />
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-stone-100">
                  <h2 className="text-xl font-black text-stone-900">
                    {t('dpdp.title')}
                  </h2>
                </div>
                <p className="text-sm text-stone-600">
                  {t('dpdp.subtitle')}
                </p>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-green-700 text-white text-xs font-bold hover:bg-green-800 transition shadow-xs cursor-pointer"
                >
                  {t('dpdp.consentRegisterTitle')}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* DPDP Compliance Modal */}
      <DPDPComplianceModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        students={students}
        onToggleConsent={handleToggleConsent}
      />

      {/* PWA Mobile & Desktop Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        installPrompt={installPrompt}
        isInstalled={isInstalled}
      />

      {/* GIGW 3.0 Mandatory Institutional Government Footer */}
      <GovFooter />

      {/* GIGW 3.0 Accessibility Guide Modal */}
      <GovAccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />

      {/* Language Selector Modal (Triggered from Top Toolbar) */}
      <LanguageSelectorModal
        isOpen={isToolbarLangModalOpen}
        onClose={() => setIsToolbarLangModalOpen(false)}
      />

    </div>
  );
};
