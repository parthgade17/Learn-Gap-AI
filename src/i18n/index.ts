import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ALL_RESOURCES } from './moreLanguages';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('i18nextLng');
    if (saved && Object.prototype.hasOwnProperty.call(ALL_RESOURCES, saved)) {
      return saved;
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: ALL_RESOURCES,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Synchronize document attributes on language change
const applyDocumentLanguageAttributes = (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ur' ? 'rtl' : 'ltr';
  }
};

applyDocumentLanguageAttributes(initialLang);

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
  applyDocumentLanguageAttributes(lng);
});

export default i18n;
