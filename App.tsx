import React, {useState, useCallback, useEffect} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Image, View, Text, I18nManager, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import i18n from './i18n';

const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
GoogleSignin.configure({
  webClientId:
    '221394927329-q1mln7gfg9ai12i30iufgmratsdphats.apps.googleusercontent.com', // From Google Console
});

const HomeTabIcon = ({size, color}: {size: number; color: string}) => (
  <Icon name="home" size={size} color={color} />
);

const ProfileTabIcon = ({size}: {size: number}) => {
  const user = auth().currentUser;
  if (user?.photoURL) {
    return (
      <Image
        source={{uri: user.photoURL}}
        style={{width: size, height: size, borderRadius: size / 2}}
      />
    );
  }
  return null; // Fallback icon can be added here
};

const DummyComponent = () => null;

function MainApp() {
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';

  const changeLanguage = async (lang: 'en' | 'ar') => {
    if (i18n.language === lang) {
      return;
    }
    await AsyncStorage.setItem('settings.lang', lang);
    I18nManager.forceRTL(lang === 'ar');
    RNRestart.restart();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          flexDirection: 'row', // This will force LTR for the tab bar
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: HomeTabIcon,
          title: t('Home'),
        }}
      />
      <Tab.Screen
        name="Language"
        component={DummyComponent}
        options={{
          tabBarIcon: () => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 64,
              }}>
              <TouchableOpacity
                onPress={() => changeLanguage(isArabic ? 'en' : 'ar')}>
                <Text
                  style={{
                    fontSize: 12,
                    padding: 5,
                    marginTop: 15,
                    borderRightWidth: 0,
                  }}>
                  Switch to
                </Text>
              </TouchableOpacity>
            </View>
          ),
          tabBarLabel: isArabic ? 'EN' : 'AR',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ProfileTabIcon,
          title: t('Profile'),
        }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={MainApp} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [initialState, setInitialState] = useState();
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

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(
          NAVIGATION_STATE_KEY,
        );
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        setInitialState(state);
      } finally {
        setInitializing(false);
      }
    };

    if (initializing) {
      restoreState();
    }
  }, [initializing]);

  // Handle user state changes
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
    <NavigationContainer
      ref={navigationRef}
      initialState={initialState}
      onStateChange={state =>
        AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state))
      }>
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
