import {createContext, useContext} from 'react';
import {type Event} from '../components/EventCard';

interface AsyncStorageContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: string;
  setLanguage: (language: 'en' | 'ar') => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  favorites: Event[];
  setFavorites: (favorites: Event[]) => void;
}

const AsyncStorageContext = createContext<AsyncStorageContextType | undefined>(
  undefined,
);

const useAsyncStorageContext = () => {
  const context = useContext(AsyncStorageContext);
  if (context === undefined) {
    throw new Error(
      'useAsyncStorageContext must be used within an AsyncStorageProvider',
    );
  }
  return context;
};

export {useAsyncStorageContext, AsyncStorageContext};
