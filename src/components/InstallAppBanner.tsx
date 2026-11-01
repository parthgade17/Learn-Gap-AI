import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppBanner: React.FC = () => {
  const { i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  if (isInstalled || isDismissed || !installPrompt) {
    return null;
  }

  return (
    <div className="no-print bg-gradient-to-r from-brand-700 via-emerald-700 to-teal-800 text-white px-4 py-2.5 shadow-md sticky top-16 sm:top-20 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold block leading-tight">
              {isMarathi ? 'मोबाईल ॲप इन्स्टॉल करा (Install PWA App)' : 'Install LearnGap AI App'}
            </span>
            <span className="text-[11px] text-emerald-100 hidden sm:inline">
              {isMarathi 
                ? 'इंटरनेटशिवाय थेट फोनवर चालते • जलद १-क्लिक वापर' 
                : 'Fast 1-tap launch • Works completely offline on Android phones'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-brand-800 font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isMarathi ? 'ॲप इन्स्टॉल करा' : 'Install App'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
