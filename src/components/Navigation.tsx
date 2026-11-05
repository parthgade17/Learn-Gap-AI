import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Sparkles, FileText, BarChart3, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab = 'assessment' | 'gaps' | 'planner' | 'dashboard' | 'privacy';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  urgentGapsCount: number;
  userRole?: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  urgentGapsCount,
  userRole = 'teacher',
}) => {
  const { t } = useTranslation();
  const isHeadTeacher = userRole === 'head_teacher';

  const allNavItems = [
    {
      id: 'assessment' as ActiveTab,
      label: t('nav.assessment'),
      mobileLabel: 'डेटा / Data',
      icon: ClipboardList,
    },
    {
      id: 'gaps' as ActiveTab,
      label: t('nav.gapAnalysis'),
      mobileLabel: 'अंतर / Gaps',
      icon: Sparkles,
      badge: urgentGapsCount > 0 ? urgentGapsCount : undefined,
    },
    {
      id: 'planner' as ActiveTab,
      label: t('nav.remedialPlan'),
      mobileLabel: 'आराखडा / Plan',
      icon: FileText,
    },
    {
      id: 'dashboard' as ActiveTab,
      label: isHeadTeacher ? 'शाळा प्रगती डॅशबोर्ड (Progress Dashboard)' : t('nav.dashboard'),
      mobileLabel: 'प्रगती / Progress',
      icon: BarChart3,
    },
    {
      id: 'privacy' as ActiveTab,
      label: t('nav.dpdp'),
      mobileLabel: 'DPDP',
      icon: ShieldCheck,
    },
  ];

  // For Head Teacher: ONLY Progress Dashboard is visible, no other dashboards
  const navItems = isHeadTeacher
    ? allNavItems.filter((item) => item.id === 'dashboard')
    : allNavItems;

  return (
    <>
      {/* 1. Desktop & Tablet Top Navigation Bar (Official Government Style) */}
      <nav
        className="no-print hidden sm:block bg-stone-100/80 border-b border-green-200/70 shadow-2xs"
        role="navigation"
        aria-label="Government Portal Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 scrollbar-none"
            role="tablist"
            aria-label="Portal Functional Sections"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tab-panel-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all-standard focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:ring-offset-1 ${
                    isActive
                      ? 'bg-[#064E3B] text-white shadow-sm'
                      : 'text-stone-700 hover:text-green-950 hover:bg-green-50 bg-white border border-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-orange-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {/* Active Tricolor Bottom Accent Strip */}
                  {isActive && (
                    <div className="absolute bottom-0 left-3 right-3 h-1 rounded-t-sm bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. Mobile App Bottom Navigation Bar (Accessible Mobile Standard) */}
      <nav
        className="no-print sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-green-200 shadow-xl px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        role="navigation"
        aria-label="Mobile Bottom Navigation"
      >
        <div
          className={`grid gap-1 ${isHeadTeacher ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-5'}`}
          role="tablist"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold transition ${
                  isActive
                    ? 'text-green-900 bg-green-50 font-bold border border-green-300'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-green-800 stroke-[2.5]' : 'text-stone-400'}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-orange-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1 truncate max-w-full text-[10px] tracking-tight">{item.mobileLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};