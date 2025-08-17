import React from 'react';
import {Text, useColorScheme, View, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
};

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

export default EventCard;
