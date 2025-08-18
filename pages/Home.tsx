import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import EventsList from '../components/EventsList';
import {Colors as ColorThemes} from '../constants/colors';
import {useAsyncStorageContext} from '../context/AsyncStorage';
import {useDebounce} from '../hooks/debounce';

const API_KEY = 'gcsYbSYzfVJvD4LAFevXycQG0Abh7a1k';

const Home = () => {
  const colorScheme = useColorScheme();
  const theme = ColorThemes[colorScheme ?? 'light'];
  const isDarkMode = colorScheme === 'dark';
  const {searchQuery, setSearchQuery} = useAsyncStorageContext();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const backgroundStyle = {
    backgroundColor: theme.background,
  };
  const textStyle = {
    color: theme.text,
    borderColor: theme.border,
    backgroundColor: theme.inputBackground,
  };

  useEffect(() => {
    const fetchEvents = async (query: string) => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${query}&apikey=${API_KEY}`,
          );
          const data = await response.json();
          if (data._embedded?.events) {
            setEvents(data._embedded.events);
          } else {
            setEvents([]);
            Alert.alert('No results', 'No events found for your search.');
          }
        } catch (error) {
          console.error('Error fetching events:', error);
          Alert.alert('Error', 'Failed to fetch events.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setEvents([]);
      }
    };

    fetchEvents(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.profileSection}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    if (events.length > 0) {
      return <EventsList events={events} />;
    }
    return (
      <View style={styles.profileSection}>
        <Text style={styles.name}>Search for Events</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {renderContent()}
      <View style={styles.searchSection}>
        <TextInput
          style={[styles.searchInput, textStyle]}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventsSection: {
    flex: 1,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
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

export default Home;
