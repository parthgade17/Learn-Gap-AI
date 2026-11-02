import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  WifiOff,
  Zap,
  HardDrive
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
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                {isMarathi ? 'LearnGap AI मोबाईल ॲप (PWA)' : 'Install LearnGap AI (Mobile App)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMarathi ? 'प्रोग्रेसिव्ह वेब ॲप (PWA) • फोन व कॉम्प्युटरवर वापरा' : 'Progressive Web App • Install on Phone, Tablet & Desktop'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Pill Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900">
            <WifiOff className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
            <span className="font-bold block text-[11px]">100% Offline</span>
            <span className="text-[10px] text-emerald-700 opacity-80">Works without net</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900">
            <Zap className="w-4 h-4 mx-auto mb-1 text-indigo-700" />
            <span className="font-bold block text-[11px]">Fast Launch</span>
            <span className="text-[10px] text-indigo-700 opacity-80">1-tap from screen</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900">
            <HardDrive className="w-4 h-4 mx-auto mb-1 text-amber-700" />
            <span className="font-bold block text-[11px]">Local Store</span>
            <span className="text-[10px] text-amber-700 opacity-80">DPDP compliant</span>
          </div>
        </div>

        {/* Direct Install Button if supported by browser */}
        {installPrompt && !isInstalled && (
          <button
            onClick={handleNativeInstall}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
          >
            <Download className="w-4 h-4" />
            <span>{isMarathi ? 'आताच फोनवर इन्स्टॉल करा (1-Click Install)' : 'Install to Home Screen Now'}</span>
          </button>
        )}

        {/* Device Switcher Tabs */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">
            {isMarathi ? 'तुमचे डिव्हाइस निवडा:' : 'Step-by-step installation instructions for your device:'}
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActivePlatform('android')}
              className={`py-1.5 rounded-xl transition ${
                activePlatform === 'android'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Android (Phone)
            </button>
            <button
              onClick={() => setActivePlatform('ios')}
              className={`py-1.5 rounded-xl transition ${
                activePlatform === 'ios'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              iPhone / iPad
            </button>
            <button
              onClick={() => setActivePlatform('desktop')}
              className={`py-1.5 rounded-xl transition ${
                activePlatform === 'desktop'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            {isMarathi ? 'समजले (Close)' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
