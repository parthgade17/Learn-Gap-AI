import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Sparkles, FileText, BarChart3, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'assessment' | 'gaps' | 'planner' | 'dashboard' | 'privacy';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  urgentGapsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  urgentGapsCount,
}) => {
  const { t } = useTranslation();

  const navItems = [
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
      label: t('nav.dashboard'),
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

  return (
    <>
      {/* 1. Desktop & Tablet Top Navigation Bar (Official Government Style) */}
      <nav
        className="no-print hidden sm:block bg-slate-100/90 border-b border-slate-300 shadow-2xs"
        role="navigation"
        aria-label="Government Portal Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none"
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
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all-standard focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] focus:ring-offset-1 ${
                    isActive
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 bg-white border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse">
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
        className="no-print sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 shadow-xl px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        role="navigation"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 gap-1" role="tablist">
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
                    ? 'text-[#0B2545] bg-blue-50 font-bold border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0B2545] stroke-[2.5]' : 'text-slate-400'}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 animate-pulse">
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