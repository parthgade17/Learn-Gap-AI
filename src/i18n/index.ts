import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ALL_RESOURCES } from './moreLanguages';

i18n
  .use(initReactI18next)
  .init({
    resources: ALL_RESOURCES,
    lng: 'en', // Default to English or saved preference
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
