import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import i18n from '../i18n';
import {AsyncStorageContext} from '../context/AsyncStorage';
import {type Event} from '../components/EventCard';

const AsyncStorageProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguageState] = useState(i18n.language);
  const [currentTab, setCurrentTab] = useState('');
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const storedSearchQuery = await AsyncStorage.getItem('searchQuery');
      if (storedSearchQuery) {
        setSearchQuery(storedSearchQuery);
      }
      const storedTab = await AsyncStorage.getItem('currentTab');
      if (storedTab) {
        setCurrentTab(storedTab);
      }
      const favoritesFromStorage = await AsyncStorage.getItem('favorites');
      if (favoritesFromStorage) {
        setFavorites(JSON.parse(favoritesFromStorage));
      }
      // Language is already loaded by i18next, we just sync it to state
      setLanguageState(i18n.language);
      setIsHydrated(true);
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem('searchQuery', searchQuery);
    }
  }, [searchQuery, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      if (currentTab) {
        AsyncStorage.setItem('currentTab', currentTab);
      }
    }
  }, [currentTab, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isHydrated]);

  const setLanguage = async (lang: 'en' | 'ar') => {
    if (i18n.language === lang) {
      return;
    }
    await AsyncStorage.setItem('settings.lang', lang);
    I18nManager.forceRTL(lang === 'ar');
    RNRestart.restart();
  };

  return (
    <AsyncStorageContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        language,
        setLanguage,
        currentTab,
        setCurrentTab,
        favorites,
        setFavorites,
      }}>
      {children}
    </AsyncStorageContext.Provider>
  );
};

export {AsyncStorageProvider};
