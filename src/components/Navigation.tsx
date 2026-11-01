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
      mobileLabel: 'Data',
      icon: ClipboardList,
    },
    {
      id: 'gaps' as ActiveTab,
      label: t('nav.gapAnalysis'),
      mobileLabel: 'Gaps',
      icon: Sparkles,
      badge: urgentGapsCount > 0 ? urgentGapsCount : undefined,
    },
    {
      id: 'planner' as ActiveTab,
      label: t('nav.remedialPlan'),
      mobileLabel: 'Plan',
      icon: FileText,
    },
    {
      id: 'dashboard' as ActiveTab,
      label: t('nav.dashboard'),
      mobileLabel: 'Progress',
      icon: BarChart3,
    },
    {
      id: 'privacy' as ActiveTab,
      label: t('nav.dpdp'),
      mobileLabel: 'Privacy',
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      {/* 1. Desktop & Tablet Top Navigation Bar */}
      <nav className="no-print hidden sm:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all-standard ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. Mobile App Bottom Navigation Bar (Native Mobile Feel) */}
      <nav className="no-print sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold transition ${
                  isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600 stroke-[2.5]' : 'text-slate-400'}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
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
