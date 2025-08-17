import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar:
    'https://www.gravatar.com/avatar/2c7d99fe281a137a2633b446917ab9e?d=mp',
};

const favoriteEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    date: '2025-08-20',
    location: 'Central Park, NYC',
  },
  {
    id: '2',
    title: 'Art & Wine Night',
    date: '2025-09-05',
    location: 'Downtown Gallery',
  },
  {
    id: '3',
    title: 'Tech Conference 2025',
    date: '2025-10-15',
    location: 'Convention Center',
  },
  {
    id: '4',
    title: 'Local Charity Run',
    date: '2025-11-01',
    location: 'City Waterfront',
  },
];

type Event = (typeof favoriteEvents)[0];

const EventCard = ({item}: {item: Event}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const cardStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.white,
  };
  const textStyle = {
    color: isDarkMode ? Colors.light : Colors.dark,
  };
  const titleStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  return (
    <View style={[styles.card, cardStyle]}>
      <Text style={[styles.cardTitle, titleStyle]}>{item.title}</Text>
      <Text style={textStyle}>Date: {item.date}</Text>
      <Text style={textStyle}>Location: {item.location}</Text>
    </View>
  );
};

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const textStyle = {
    color: isDarkMode ? Colors.light : Colors.dark,
  };
  const titleStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.favoritesSection}>
        <FlatList
          data={favoriteEvents}
          renderItem={({item}) => <EventCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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
  },
  favoritesSection: {
    flex: 1,
    paddingTop: 20,
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

export default Home;
