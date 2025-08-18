import React, {useState, useCallback, useEffect} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';
import {I18nManager, useColorScheme, StatusBar} from 'react-native';

import {Colors} from './constants/colors';
import i18n from './i18n';
import Main from './pages/Main';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';

const Stack = createNativeStackNavigator();

GoogleSignin.configure({
  webClientId:
    '221394927329-q1mln7gfg9ai12i30iufgmratsdphats.apps.googleusercontent.com', // From Google Console
});

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const navigationRef = useNavigationContainerRef();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    const checkLanguage = () => {
      const isArabic = i18n.language === 'ar';
      if (I18nManager.isRTL !== isArabic) {
        I18nManager.forceRTL(isArabic);
        RNRestart.restart();
      } else {
        setLangReady(true);
      }
    };

    if (i18n.isInitialized) {
      checkLanguage();
    } else {
      i18n.on('initialized', checkLanguage);
    }

    return () => {
      i18n.off('initialized', checkLanguage);
    };
  }, []);

  const handleAuthStateChanged = useCallback(
    function (loggedInUser: any) {
      setUser(loggedInUser);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [handleAuthStateChanged]);

  if (initializing || !langReady) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar backgroundColor={theme.background} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export {AppNavigator};
