import React from 'react';
import {AsyncStorageProvider} from './provider/AsyncStorage';
import {AppNavigator} from './AppNavigator';

export default function App() {
  return (
    <AsyncStorageProvider>
      <AppNavigator />
    </AsyncStorageProvider>
  );
}
