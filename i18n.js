import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const savedDataJSON = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
    const lng = savedDataJSON || 'en';
    callback(lng);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

const resources = {
  en: {
    translation: {
      Home: 'Home',
      Profile: 'Profile',
      SwitchTo: 'التبديل إلى',
    },
  },
  ar: {
    translation: {
      Home: 'الرئيسية',
      Profile: 'الملف الشخصي',
      SwitchTo: 'Switch to',
    },
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, //   <---- this will do the magic
    },
  });

export default i18n;
