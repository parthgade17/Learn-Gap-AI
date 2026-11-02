import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Wifi, WifiOff, ShieldCheck, UserCheck, School, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOnline: boolean;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isOnline,
  onOpenPrivacy
}) => {
  const { t, i18n } = useTranslation();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const activeLangCode = i18n.language || 'en';
  const activeLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === activeLangCode) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & School Context */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <School className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                    {t('appName')}
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {t('competitionBadge')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xs md:max-w-md">
                  {t('schoolName')} • {t('schoolSub')}
                </p>
              </div>
            </div>

            {/* Action Controls: Network Status, Language, Role, Privacy */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Online / Offline Sync Badge */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                title={isOnline ? 'Connected to Supabase' : 'Offline Mode: Data stored in phone memory'}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">{t('onlineMode')}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">{t('offlineMode')}</span>
                  </>
                )}
              </div>

              {/* Multilingual Selector Button */}
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition shadow-sm"
                aria-label="Select Language"
                title="Change language (All Indian Regional & Tribal Languages supported)"
              >
                <Globe className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-bold">{activeLangMeta.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Role Switcher */}
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-medium py-1.5 pl-3 pr-8 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="teacher">{t('roles.teacher')}</option>
                  <option value="head_teacher">{t('roles.head_teacher')}</option>
                </select>
                <UserCheck className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Privacy Compliance Icon */}
              <button
                onClick={onOpenPrivacy}
                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition"
                title="DPDP Act 2023 Child Privacy Protection"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
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
