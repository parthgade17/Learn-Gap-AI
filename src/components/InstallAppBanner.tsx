import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Smartphone, X, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallAppBannerProps {
  onOpenModal: () => void;
  installPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({
  onOpenModal,
  installPrompt,
  isInstalled,
}) => {
  const { i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const [isDismissed, setIsDismissed] = useState(false);

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome !== 'accepted') {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <div className="no-print bg-gradient-to-r from-emerald-800 via-teal-800 to-brand-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md sticky top-16 sm:top-20 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <Smartphone className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight block leading-tight truncate">
                {isMarathi ? 'LearnGap AI मोबाईल ॲप (PWA)' : 'Install LearnGap AI (Mobile App)'}
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                100% Offline Ready
              </span>
            </div>
            <span className="text-[11px] text-emerald-100 hidden md:inline">
              {isMarathi 
                ? 'फोनवर होमस्क्रीनला जोडा • इंटरनेट नसतानाही अखंड काम करते' 
                : 'Add to Phone Home Screen • Works fast & offline with instant classroom sync'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap active:scale-95"
            title="Install app to your home screen or desktop"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{isMarathi ? 'ॲप इन्स्टॉल करा' : 'Install App'}</span>
          </button>

          <button
            onClick={onOpenModal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            title="Step by step install guide for Android, iOS & PC"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden md:inline">{isMarathi ? 'कसे वापरावे' : 'Guide'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
