import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native';

import Home from './Home';
import Profile from './Profile';
import TabBarIconLanguage from '../components/TabBarIconLanguage';
import TabBarIconHome from '../components/TabBarIconHome';
import TabBarIconProfile from '../components/TabBarIconProfile';
import DummyComponent from '../components/Dummy';
import {useAsyncStorageContext} from '../context/AsyncStorage';
import {Colors as ColorThemes} from '../constants/colors';

const Tab = createBottomTabNavigator();

function Main() {
  const colorScheme = useColorScheme();
  const theme = ColorThemes[colorScheme ?? 'light'];
  const {t} = useTranslation();
  const {currentTab, setCurrentTab} = useAsyncStorageContext();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          flexDirection: 'row', // This will force LTR for the tab bar
          backgroundColor: theme.card,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
      }}
      initialRouteName={(() => currentTab)()}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: TabBarIconHome,
          title: t('Home'),
        }}
        listeners={{
          tabPress: () => {
            setCurrentTab('Home');
          },
        }}
      />
      <Tab.Screen
        name="Language"
        component={DummyComponent}
        options={{
          tabBarIcon: TabBarIconLanguage,
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: TabBarIconProfile,
          title: t('Profile'),
        }}
        listeners={{
          tabPress: () => {
            setCurrentTab('Profile');
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;
