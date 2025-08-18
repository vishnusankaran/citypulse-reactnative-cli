import React from 'react';
import {
  Text,
  useColorScheme,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';

export type Event = {
  id: string;
  name: string;
  url: string;
  images?: {
    url: string;
    ratio?: string;
  }[];
  dates: {
    start: {
      localDate: string;
    };
  };
  _embedded?: {
    venues: {
      name: string;
    }[];
  };
};

const EventCard = ({item}: {item: Event}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();
  const cardStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.white,
  };
  const cardContentStyle = {
    alignItems: I18nManager.isRTL ? 'end' : 'start',
  };
  const textStyle = {
    color: isDarkMode ? Colors.light : Colors.dark,
  };
  const titleStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  const image = item.images?.find(img => img.ratio === '16_9');

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetails', {item})}>
      <View style={[styles.card, cardStyle]}>
        {image && <Image source={{uri: image.url}} style={styles.cardImage} />}
        <View style={[styles.cardContent, cardContentStyle]}>
          <Text style={[styles.cardTitle, titleStyle]}>
            {item.name || 'No Name'}
          </Text>
          <Text style={textStyle}>
            Date: {item.dates?.start?.localDate || 'N/A'}
          </Text>
          <Text style={textStyle}>
            Venue: {item._embedded?.venues[0]?.name || 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default EventCard;
