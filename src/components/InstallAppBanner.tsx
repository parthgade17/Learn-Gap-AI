import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

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
    <div className="no-print bg-gradient-to-r from-green-900 via-emerald-900 to-green-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-xs border-b border-green-950">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight block leading-tight truncate">
              {isMarathi ? 'LearnGap AI मोबाईल ॲप (PWA)' : 'Install LearnGap AI (Mobile App)'}
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/30 text-orange-200 border border-orange-400/40">
              100% Offline Ready
            </span>
          </div>
          <span className="text-[11px] text-emerald-100 hidden md:inline">
            {isMarathi 
              ? 'फोनवर होमस्क्रीनला जोडा • इंटरनेट नसतानाही अखंड काम करते' 
              : 'Add to Phone Home Screen • Works fast & offline with instant classroom sync'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition shadow-xs whitespace-nowrap active:scale-95 cursor-pointer"
            title="Install app to your home screen or desktop"
          >
            <span>{isMarathi ? 'ॲप इन्स्टॉल करा' : 'Install App'}</span>
          </button>

          <button
            onClick={onOpenModal}
            className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/20 cursor-pointer"
            title="Step by step install guide for Android, iOS & PC"
          >
            <span className="hidden md:inline">{isMarathi ? 'कसे वापरावे' : 'Guide'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
