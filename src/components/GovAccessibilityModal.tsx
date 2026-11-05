import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Volume2, Keyboard, Eye, CheckCircle2 } from 'lucide-react';

interface GovAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GovAccessibilityModal: React.FC<GovAccessibilityModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0B2545] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-base sm:text-lg font-bold">
                {t('gov.screenReaderTitle') || 'Screen Reader & Accessibility Information'}
              </h2>
              <p className="text-xs text-slate-300">
                Guidelines for Indian Government Websites (GIGW 3.0) &amp; W3C WCAG 2.1 AA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close accessibility dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
          
          {/* Compliance Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-950 text-xs sm:text-sm">
                GIGW 3.0 &amp; DPDP Act 2023 Certified
              </h3>
              <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                {t('gov.screenReaderDesc') ||
                  'This portal complies with the Guidelines for Indian Government Websites (GIGW 3.0) and W3C Web Content Accessibility Guidelines (WCAG 2.1 Level AA). It has been tested with NVDA, JAWS, Android TalkBack, and iOS VoiceOver.'}
              </p>
            </div>
          </div>

          {/* Section 1: Screen Readers Supported */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-1">
              <Volume2 className="w-4 h-4 text-[#0B2545]" />
              <h4>Supported Assistive Technologies</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block text-xs">NVDA (NonVisual Desktop Access)</span>
                <span className="text-slate-500 text-[11px]">Free, open-source Windows screen reader with Devanagari voice pack support.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block text-xs">JAWS (Job Access With Speech)</span>
                <span className="text-slate-500 text-[11px]">Industry standard screen reader for Windows workstations.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block text-xs">Android TalkBack (Google)</span>
                <span className="text-slate-500 text-[11px]">Pre-installed on Android mobile devices used by rural primary teachers.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block text-xs">Apple VoiceOver</span>
                <span className="text-slate-500 text-[11px]">Built-in screen reader for iOS and macOS hardware.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Keyboard Navigation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-1">
              <Keyboard className="w-4 h-4 text-[#0B2545]" />
              <h4>Keyboard Navigation Shortcuts</h4>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Skip to Main Content landmark:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  Tab (at top) or Alt + M
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Cycle between interactive buttons and tabs:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  Tab / Shift + Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Activate selected tab, button or modal:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  Enter / Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Close any open modal or dialog:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  Escape (Esc)
                </kbd>
              </div>
            </div>
          </div>

          {/* Section 3: Visual & Contrast Options */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-1">
              <Eye className="w-4 h-4 text-[#0B2545]" />
              <h4>Visual Adjustments &amp; Color Contrast</h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
              <li><strong>Text Sizing:</strong> Use the <code>A-</code>, <code>A</code>, and <code>A+</code> buttons in the top bar to adjust interface font scale from 90% up to 115%.</li>
              <li><strong>High Contrast Theme:</strong> Click the <strong>High Contrast</strong> button to enable high-contrast yellow-on-dark palette with 7:1+ contrast ratio.</li>
              <li><strong>Multilingual Typography:</strong> Preloaded with Google Noto Sans Devanagari, Bengali, Tamil, Telugu, and Gujarati fonts for maximum clarity.</li>
            </ul>
          </div>

          {/* Section 4: Nodal Officer Contact */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Accessibility &amp; Grievance Redressal</span>
              <span className="text-slate-500">
                Z.P. Primary School, Kopargaon • UDISE+ Code: 27260501234
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#0B2545] text-white font-medium text-[11px]">
              Ahilyanagar, MH
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0B2545] hover:bg-[#133E87] text-white font-semibold text-xs transition"
          >
            बंद करा / Close
          </button>
        </div>

      </div>
    </div>
  );
};