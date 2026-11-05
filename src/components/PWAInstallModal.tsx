import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  installPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  installPrompt,
  isInstalled,
}) => {
  const { i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';

  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>('android');

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-black text-stone-900 text-base">
              {isMarathi ? 'LearnGap AI मोबाईल ॲप (PWA)' : 'Install LearnGap AI (Mobile App)'}
            </h3>
            <p className="text-xs text-stone-500">
              {isMarathi ? 'प्रोग्रेसिव्ह वेब ॲप (PWA) • फोन व कॉम्प्युटरवर वापरा' : 'Progressive Web App • Install on Phone, Tablet & Desktop'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Pill Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <span className="font-bold block text-[11px]">100% Offline</span>
            <span className="text-[10px] text-emerald-800 opacity-90">Works without net</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950">
            <span className="font-bold block text-[11px]">Fast Launch</span>
            <span className="text-[10px] text-orange-800 opacity-90">1-tap from screen</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900">
            <span className="font-bold block text-[11px]">Local Store</span>
            <span className="text-[10px] text-stone-600 opacity-90">DPDP compliant</span>
          </div>
        </div>

        {/* Direct Install Button if supported by browser */}
        {installPrompt && !isInstalled && (
          <button
            onClick={handleNativeInstall}
            className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isMarathi ? 'आताच फोनवर इन्स्टॉल करा (1-Click Install)' : 'Install to Home Screen Now'}</span>
          </button>
        )}

        {/* Device Switcher Tabs */}
        <div>
          <span className="text-xs font-bold text-stone-700 block mb-2">
            {isMarathi ? 'तुमचे डिव्हाइस निवडा:' : 'Step-by-step installation instructions for your device:'}
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActivePlatform('android')}
              className={`py-1.5 rounded-xl transition ${
                activePlatform === 'android'
                  ? 'bg-green-700 text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Android (Phone)
            </button>
            <button
              onClick={() => setActivePlatform('ios')}
              className={`py-1.5 rounded-xl transition ${
                activePlatform === 'ios'
                  ? 'bg-green-700 text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              iPhone / iPad
            </button>
            <button
              onClick={() => setActivePlatform('desktop')}
              className={`py-1.5 rounded-xl transition ${
                activePlatform === 'desktop'
                  ? 'bg-green-700 text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              PC / Laptop
            </button>
          </div>
        </div>

        {/* Platform Specific Instructions */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5 text-slate-700">
          {activePlatform === 'android' && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <span>Open in <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Firefox</strong> on Android.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <span>Tap the <strong>three dots (⋮)</strong> menu in the top-right corner.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
              </div>
            </>
          )}

          {activePlatform === 'ios' && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <span>Open in <strong>Safari</strong> on your iPhone or iPad.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <span className="flex items-center gap-1">
                  Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> at the bottom of the screen.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <span className="flex items-center gap-1">
                  Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-600" /> then tap <strong>Add</strong>.
                </span>
              </div>
            </>
          )}

          {activePlatform === 'desktop' && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <span>Look for the <strong>Install</strong> icon in Chrome or Edge's address bar (right side).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <span>Or click browser menu (⋮) &rarr; <strong>"Install LearnGap AI..."</strong></span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <span>Click <strong>Install</strong> to launch as a standalone desktop window.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>NIPUN Bharat &amp; PARAKH Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs transition cursor-pointer"
          >
            {isMarathi ? 'समजले (Close)' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
