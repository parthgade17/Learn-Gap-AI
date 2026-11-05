import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, SunMoon, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

interface GovAccessibilityToolbarProps {
  fontScale: 'sm' | 'normal' | 'lg';
  onFontScaleChange: (scale: 'sm' | 'normal' | 'lg') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenAccessibilityModal: () => void;
  onOpenLanguageModal: () => void;
}

/**
 * GIGW 3.0 Mandatory Top Accessibility & National Identity Bar
 * Conforms to Guidelines for Indian Government Websites (GIGW 3.0) and W3C WCAG 2.1 AA.
 */
export const GovAccessibilityToolbar: React.FC<GovAccessibilityToolbarProps> = ({
  fontScale,
  onFontScaleChange,
  highContrast,
  onToggleHighContrast,
  onOpenAccessibilityModal,
  onOpenLanguageModal
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const activeLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="no-print bg-[#064E3B] text-white border-b border-emerald-800 text-[11px] select-none">
      {/* 1. Official National Tricolor Strip (Saffron, White, Green) */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]" title="National Saffron (शौर्य व त्याग)" />
        <div className="bg-[#FFFFFF]" title="National White (शांतता व सत्य)" />
        <div className="bg-[#138808]" title="National Green (समृद्धी व विश्वास)" />
      </div>

      {/* 2. Top Accessibility & Government Identification Toolbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3">
        
        {/* Left: Official Bilingual Government Title */}
        <div className="flex items-center gap-2 text-emerald-100 font-medium whitespace-nowrap">
          <span className="font-bold text-white tracking-wide">
            {t('gov.goi') || 'भारत सरकार | Government of India'}
          </span>
          <span className="text-emerald-400 hidden xl:inline">•</span>
          <span className="hidden xl:inline text-emerald-200">
            {t('gov.stateGov') || 'शालेय शिक्षण व क्रीडा विभाग, महाराष्ट्र शासन'}
          </span>
        </div>

        {/* Right: GIGW Mandatory Accessibility Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto flex-wrap">
          
          {/* Skip to Main Content (Mandatory GIGW & WCAG 2.1) */}
          <a
            href="#main-content"
            className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-orange-200 hover:text-white hover:bg-emerald-900 focus:outline-hidden focus:ring-2 focus:ring-orange-400 transition"
            title="मुख्य मजकुराकडे थेट जा (Skip directly to main content for screen readers)"
          >
            {t('gov.skipToMain') || 'Skip to Main Content'}
          </a>

          <span className="text-emerald-700 hidden sm:inline">|</span>

          {/* Screen Reader Access Modal Trigger */}
          <button
            onClick={onOpenAccessibilityModal}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-900 transition"
            title="Screen Reader & Keyboard Accessibility Information"
            aria-label="Screen Reader Access information"
          >
            <Volume2 className="w-3 h-3 text-orange-300" />
            <span className="hidden lg:inline">{t('gov.screenReader') || 'Screen Reader Access'}</span>
          </button>

          <span className="text-emerald-700 hidden sm:inline">|</span>

          {/* Font Size Adjusters: A- (90%), A (100%), A+ (115%) */}
          <div
            className="inline-flex items-center rounded bg-[#022C22] p-0.5 border border-emerald-800"
            role="group"
            aria-label="Text size controls"
          >
            <button
              onClick={() => onFontScaleChange('sm')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                fontScale === 'sm'
                  ? 'bg-orange-500 text-white font-black shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
              title="A- (लहान अक्षर / Decrease font size to 90%)"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button
              onClick={() => onFontScaleChange('normal')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                fontScale === 'normal'
                  ? 'bg-orange-500 text-white font-black shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
              title="A (सामान्य अक्षर / Default font size 100%)"
              aria-label="Reset text size to default"
            >
              A
            </button>
            <button
              onClick={() => onFontScaleChange('lg')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                fontScale === 'lg'
                  ? 'bg-orange-500 text-white font-black shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
              title="A+ (मोठे अक्षर / Increase font size to 115%)"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          <span className="text-emerald-700 hidden sm:inline">|</span>

          {/* High Contrast Mode Switcher (WCAG AAA High Contrast) */}
          <button
            onClick={onToggleHighContrast}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold transition border ${
              highContrast
                ? 'bg-orange-500 text-white border-orange-400 font-extrabold shadow-xs'
                : 'bg-[#022C22] text-emerald-100 border-emerald-800 hover:bg-emerald-800 hover:text-white'
            }`}
            title="उच्च कॉन्ट्रास्ट मोड (Toggle High Contrast Mode)"
            aria-pressed={highContrast}
          >
            <SunMoon className="w-3 h-3 text-orange-300" />
            <span>{highContrast ? (t('gov.highContrast') || 'High Contrast') : (t('gov.standardContrast') || 'Standard')}</span>
          </button>

          <span className="text-emerald-700 hidden sm:inline">|</span>

          {/* Quick Language Switcher */}
          <button
            onClick={onOpenLanguageModal}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#022C22] hover:bg-emerald-900 text-white font-medium border border-emerald-800 text-[10px] sm:text-[11px] transition"
            title="२४ भारतीय भाषांमध्ये उपलब्ध (Select from 24 Indian Languages)"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="font-bold text-orange-300">{activeLangMeta.nativeName}</span>
            <span className="text-emerald-300 text-[9px] hidden sm:inline">({activeLangMeta.code.toUpperCase()})</span>
          </button>

        </div>
      </div>
    </div>
  );
};