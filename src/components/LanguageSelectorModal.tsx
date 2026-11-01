import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Globe, X, Check, Trees } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageMeta } from '../i18n/languages';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'regional' | 'tribal_adivasi'>('all');

  if (!isOpen) return null;

  const currentLang = i18n.language || 'en';

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const matchesCategory = categoryFilter === 'all' || lang.category === categoryFilter;
    const matchesSearch =
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    onClose();
  };

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
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-100 text-brand-700">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('selectLanguage')} / Choose Language
            </h3>
            <p className="text-xs text-slate-500">
              Select any Indian regional, state, or Adivasi / indigenous tribal language
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchLanguages')}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-3 pb-2 border-b border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('allLanguages')} ({SUPPORTED_LANGUAGES.length})
          </button>
          <button
            onClick={() => setCategoryFilter('regional')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              categoryFilter === 'regional'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('regionalCategory')} (13)
          </button>
          <button
            onClick={() => setCategoryFilter('tribal_adivasi')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-1 ${
              categoryFilter === 'tribal_adivasi'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>{t('tribalCategory')} (10+)</span>
          </button>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 max-h-72 overflow-y-auto pr-1">
          {filteredLanguages.map((lang: LanguageMeta) => {
            const isSelected = currentLang === lang.code;
            const isTribal = lang.category === 'tribal_adivasi';

            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className={`p-2.5 rounded-xl border text-left flex items-start justify-between transition ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/30'
                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {lang.nativeName}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-600 font-medium">{lang.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isTribal
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isTribal ? 'आदिवासी / Tribal' : 'Regional'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                    {lang.region}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Supported: Major state languages &amp; tribal dialects</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
