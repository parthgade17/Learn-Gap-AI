import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Wifi, WifiOff, ShieldCheck, UserCheck, ChevronDown, Smartphone } from 'lucide-react';
import { UserRole } from '../types';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
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
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const activeLangCode = i18n.language || 'en';
  const activeLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === activeLangCode) || SUPPORTED_LANGUAGES[0];

  const installAppLabel = isInstalled
    ? t('common.appReady') || 'App Ready'
    : t('common.installApp') || 'Install App';

  const selectClassLabel = t('dashboard.selectClass') || 'Select Class';

  return (
    <>
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs" role="banner">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22 gap-2 sm:gap-4">
            
            {/* 1. Official Government Department & Institutional Identity */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <a
                href="#main-content"
                className="shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] rounded-lg p-0.5"
                title="महाराष्ट्र शासन व भारत सरकार अधिकृत पोर्टल"
              >
                <EmblemOfIndia size={44} variant="navy" className="hidden xs:block" />
              </a>

              <div className="min-w-0">
                {/* Department Banner Line */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#0B2545] uppercase tracking-wide truncate">
                    शालेय शिक्षण व क्रीडा विभाग, महाराष्ट्र शासन
                  </span>
                  <span className="hidden xl:inline-block text-[10px] text-slate-400">|</span>
                  <span className="hidden xl:inline-block text-[10px] text-slate-500 font-medium truncate">
                    Dept. of School Education, Govt. of Maharashtra
                  </span>
                </div>

                {/* Main App Title */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight truncate">
                    {t('appName')}
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {t('competitionBadge')}
                  </span>
                </div>

                {/* Subtitle & School UDISE+ Code */}
                <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-sm md:max-w-xl">
                  <span className="font-semibold text-slate-700">{t('schoolName')}</span>
                  <span className="mx-1 text-slate-400">•</span>
                  <span className="font-mono text-emerald-700 font-bold">UDISE+ 27260501234</span>
                  <span className="mx-1 text-slate-400">•</span>
                  <span>{t('schoolSub')}</span>
                </p>
              </div>
            </div>

            {/* 2. Official Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* NIPUN Bharat Mission Badge */}
              <div className="hidden lg:block">
                <NipunBharatBadge size="sm" />
              </div>

              {/* Online / Offline Sync Badge */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
                title={isOnline ? 'Connected to Supabase Cloud & Local Cache' : 'Offline Mode: Data stored in device memory'}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="hidden sm:inline font-semibold text-[11px]">{t('onlineMode')}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="hidden sm:inline font-semibold text-[11px]">{t('offlineMode')}</span>
                  </>
                )}
              </div>

              {/* Install PWA Mobile App Button */}
              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-bold transition shadow-2xs"
                  title="Install LearnGap AI as Mobile App (PWA)"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden md:inline">{installAppLabel}</span>
                </button>
              )}

              {/* Multilingual Selector Button */}
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition shadow-2xs"
                aria-label="Select Language / भाषा निवडा"
                title={t('selectLanguage') || 'Select Language'}
              >
                <Globe className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                <span className="font-bold text-xs">{activeLangMeta.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Class Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedClassGrade}
                  onChange={(e) => onClassGradeChange(e.target.value)}
                  className="appearance-none bg-blue-50 hover:bg-blue-100 text-[#0B2545] text-xs sm:text-sm font-bold py-1.5 pl-2.5 pr-7 rounded-lg border border-blue-200 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] cursor-pointer shadow-2xs"
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
                <ChevronDown className="w-3.5 h-3.5 text-[#0B2545] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Government Officer Role Switcher */}
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-semibold py-1.5 pl-2.5 pr-8 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] cursor-pointer shadow-2xs"
                  title="अधिकृत शासकीय पद (Authorized Role)"
                  aria-label="Authorized User Role"
                >
                  <option value="teacher">{t('roles.teacher')}</option>
                  <option value="head_teacher">{t('roles.head_teacher')}</option>
                </select>
                <UserCheck className="w-3.5 h-3.5 text-[#0B2545] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* DPDP Act 2023 Child Privacy Protection Icon */}
              <button
                onClick={onOpenPrivacy}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition border border-transparent hover:border-emerald-200"
                title="DPDP Act 2023 Child Privacy Protection / बाल गोपनीयता"
                aria-label="DPDP Act 2023 Privacy Overview"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </>
  );
};