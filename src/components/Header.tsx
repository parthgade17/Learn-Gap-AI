import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff, ShieldCheck, UserCheck, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';
import { formatClassDisplay } from '../data/curriculumData';
import { EmblemOfIndia } from './EmblemOfIndia';
import { NipunBharatBadge } from './NipunBharatBadge';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedClassGrade: string;
  onClassGradeChange: (grade: string) => void;
  isOnline: boolean;
  onOpenPrivacy: () => void;
  onOpenInstallModal?: () => void;
  isInstalled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedClassGrade,
  onClassGradeChange,
  isOnline,
  onOpenPrivacy,
  onOpenInstallModal,
  isInstalled = false
}) => {
  const { t, i18n } = useTranslation();
  const activeLangCode = i18n.language || 'en';

  const installAppLabel = isInstalled
    ? t('common.appReady') || 'App Ready'
    : t('common.installApp') || 'Install App';

  const selectClassLabel = t('dashboard.selectClass') || 'Select Class';

  return (
    <header className="no-print bg-white border-b border-green-200/80 sticky top-0 z-30 shadow-xs" role="banner">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6">
          
          {/* 1. Official Government Identity & Portal Branding (Priority No-Truncate Zone) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="#main-content"
              className="shrink-0 focus:outline-hidden focus:ring-2 focus:ring-green-800 rounded-xl p-0.5 hover:opacity-90 transition"
              title="महाराष्ट्र शासन व भारत सरकार अधिकृत राज्य चिन्ह"
              aria-label="Skip to main content - State Emblem of India"
            >
              <EmblemOfIndia size={46} variant="green" className="block drop-shadow-2xs" />
            </a>

            <div className="min-w-0">
              {/* Department Line */}
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[11px] sm:text-xs font-bold text-green-900 tracking-tight">
                  शालेय शिक्षण व क्रीडा विभाग, महाराष्ट्र शासन
                </span>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="hidden md:inline text-[10px] text-green-700 font-medium">
                  Govt. of Maharashtra
                </span>
              </div>

              {/* Main Portal Title & Competition Badge */}
              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="font-black text-xl sm:text-2xl text-green-950 tracking-tight whitespace-nowrap leading-tight">
                  {t('appName')}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-900 border border-orange-300 whitespace-nowrap shadow-2xs">
                  {t('competitionBadge')}
                </span>
              </div>

              {/* School Identification & UDISE+ Code */}
              <p className="text-[11px] text-slate-600 whitespace-nowrap mt-0.5">
                <span className="font-semibold text-slate-800">{t('schoolName')}</span>
                <span className="mx-1.5 text-slate-400">•</span>
                <span className="font-mono text-green-700 font-extrabold">UDISE+ 27260501234</span>
              </p>
            </div>
          </div>

          {/* 2. Official Action Controls (Clean, Compact & Aligned) */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap lg:justify-end ml-auto lg:ml-0">
            
            {/* NIPUN Bharat Mission Badge */}
            <div className="hidden xl:block shrink-0">
              <NipunBharatBadge size="sm" />
            </div>

            {/* Online / Offline Sync Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition shadow-2xs ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-orange-50 text-orange-800 border-orange-300'
              }`}
              title={isOnline ? 'Connected to Supabase Cloud & Local Cache' : 'Offline Mode: Data stored safely in device memory'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="whitespace-nowrap text-[11px]">{t('onlineMode')}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="whitespace-nowrap text-[11px]">{t('offlineMode')}</span>
                </>
              )}
            </div>

            {/* Install PWA Mobile App Button (Compact Pill) */}
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold transition shadow-2xs whitespace-nowrap cursor-pointer"
                title="Install LearnGap AI as Mobile App (PWA)"
              >
                <span>{installAppLabel}</span>
              </button>
            )}

            {/* Class Selector Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedClassGrade}
                onChange={(e) => onClassGradeChange(e.target.value)}
                className="appearance-none bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-bold py-1.5 pl-3 pr-7 rounded-lg border border-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-green-700 cursor-pointer shadow-2xs whitespace-nowrap"
                title={selectClassLabel}
                aria-label={selectClassLabel}
              >
                {currentRole === 'head_teacher' && (
                  <option value="ALL">{formatClassDisplay('ALL', activeLangCode)}</option>
                )}
                <option value="5">{formatClassDisplay('5', activeLangCode)}</option>
                <option value="6">{formatClassDisplay('6', activeLangCode)}</option>
                <option value="7">{formatClassDisplay('7', activeLangCode)}</option>
                <option value="8">{formatClassDisplay('8', activeLangCode)}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Government Officer Role Switcher */}
            <div className="relative shrink-0">
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="appearance-none bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs sm:text-sm font-bold py-1.5 pl-3 pr-8 rounded-lg border border-orange-300 focus:outline-hidden focus:ring-2 focus:ring-orange-600 cursor-pointer shadow-2xs whitespace-nowrap"
                title="अधिकृत शासकीय पद (Authorized Role)"
                aria-label="Authorized User Role"
              >
                <option value="teacher">{t('roles.teacher')}</option>
                <option value="head_teacher">{t('roles.head_teacher')}</option>
              </select>
              <UserCheck className="w-3.5 h-3.5 text-orange-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* DPDP Act 2023 Child Privacy Protection Icon */}
            <button
              onClick={onOpenPrivacy}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition border border-emerald-200 hover:border-emerald-300 cursor-pointer shadow-2xs"
              title="DPDP Act 2023 Child Privacy Protection / बाल गोपनीयता"
              aria-label="DPDP Act 2023 Privacy Overview"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};