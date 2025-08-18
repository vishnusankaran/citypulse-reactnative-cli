import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAsyncStorageContext} from '../context/AsyncStorage';
import {Colors as ColorThemes} from '../constants/colors';

const TabBarIconLanguage = () => {
  const colorScheme = useColorScheme();
  const theme = ColorThemes[colorScheme ?? 'light'];
  const {t} = useTranslation();
  const {language, setLanguage} = useAsyncStorageContext();
  const isArabic = language === 'ar';
  const textStyles = {
    color: theme.text,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setLanguage(isArabic ? 'en' : 'ar')}>
        <Text style={[styles.text, textStyles]}>
          {t('SwitchTo')} {isArabic ? 'EN' : 'AR'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
  },
  text: {
    fontSize: 12,
    padding: 5,
    marginTop: 15,
    borderRightWidth: 0,
  },
});

export default TabBarIconLanguage;
