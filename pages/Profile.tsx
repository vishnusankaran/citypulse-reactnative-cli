import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Button,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {type Event} from '../components/EventCard';
import EventsList from '../components/EventsList';

const Profile = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [favorites, setFavorites] = useState<Event[]>([]);

  useFocusEffect(
    useCallback(() => {
      const getFavorites = async () => {
        const favoritesFromStorage = await AsyncStorage.getItem('favorites');
        if (favoritesFromStorage) {
          setFavorites(JSON.parse(favoritesFromStorage));
        }
      };
      getFavorites();
    }, []),
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const textStyle = {
    color: isDarkMode ? Colors.light : Colors.dark,
  };
  const titleStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };
  const user = auth().currentUser;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: user?.photoURL || 'https://www.gravatar.com/avatar/?d=mp',
          }}
          style={styles.avatar}
        />
        <Text style={[styles.name, titleStyle]}>{user?.displayName}</Text>
        <Text style={[textStyle, styles.email]}>{user?.email}</Text>
        <View style={styles.logoutButton}>
          <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
        </View>
      </View>
      <EventsList title="Favourites" events={favorites} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
  },
  email: {
    textAlign: 'left',
  },
  logoutButton: {
    marginTop: 16,
  },
  favoritesSection: {
    flex: 1,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default Profile;
