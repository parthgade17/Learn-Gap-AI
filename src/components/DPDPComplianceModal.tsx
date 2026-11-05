import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Student } from '../types';
import { formatStudentDisplay } from '../data/curriculumData';

interface DPDPComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onToggleConsent: (studentId: string) => void;
}

export const DPDPComplianceModal: React.FC<DPDPComplianceModalProps> = ({
  isOpen,
  onClose,
  students,
  onToggleConsent,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  if (!isOpen) return null;

  const consentedCount = students.filter(s => s.parental_consent_verified).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('dpdp.title')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('dpdp.subtitle')}
            </p>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="font-bold text-stone-900 mb-1">
              <span>{t('dpdp.dataMinimization')}</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              {t('dpdp.dataMinimizationDesc')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="font-bold text-stone-900 mb-1">
              <span>{t('dpdp.purposeLimitation')}</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              {t('dpdp.purposeLimitationDesc')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="font-bold text-stone-900 mb-1">
              <span>{t('dpdp.parentalConsent')}</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              {t('dpdp.parentalConsentDesc')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="font-bold text-stone-900 mb-1">
              <span>{t('dpdp.syntheticDemo')}</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              {t('dpdp.syntheticDemoDesc')}
            </p>
          </div>

        </div>

        {/* Live Parental Consent Registry Table */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
            <span>{t('dpdp.consentRegisterTitle')} ({consentedCount}/{students.length})</span>
            <span className="text-emerald-800 font-bold">{t('dpdp.consentTarget')}</span>
          </div>

          <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl divide-y divide-stone-100 text-xs">
            {students.slice(0, 10).map((st) => (
              <div key={st.id} className="p-2.5 flex items-center justify-between hover:bg-stone-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-800">{formatStudentDisplay(st, currentLang)}</span>
                </div>

                <button
                  onClick={() => onToggleConsent(st.id)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    st.parental_consent_verified
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                      : 'bg-orange-50 text-orange-950 border border-orange-300'
                  }`}
                >
                  {st.parental_consent_verified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('dpdp.consentVerifiedBadge')}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-orange-700" />
                      <span>{t('dpdp.consentPendingBadge')}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            {t('dpdp.closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
