import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  Linking,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {type Event} from '../components/EventCard';
import {useAsyncStorageContext} from '../context/AsyncStorage';

const EventDetails = ({route}: {route: any}) => {
  const {item} = route.params as {item: Event};
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const {favorites, setFavorites} = useAsyncStorageContext();
  const isFavorite = favorites.some(fav => fav.id === item.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== item.id));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  const handleBookNow = () => {
    if (item.url) {
      Linking.openURL(item.url).catch(err =>
        console.error("Couldn't load page", err),
      );
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#F4F4F4',
  };
  const textStyle = {
    color: isDarkMode ? Colors.light : Colors.dark,
  };
  const titleStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };
  const titleAlign = {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  };
  const cardStyle = {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderColor: isDarkMode ? '#2C2C2C' : '#E0E0E0',
    alignItems: I18nManager.isRTL ? 'end' : 'start',
  };

  const image = item.images?.find(img => img.ratio === '16_9');
  const venue = item._embedded?.venues[0];

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {image && <Image source={{uri: image.url}} style={styles.image} />}
        <View style={[styles.header, cardStyle]}>
          <Text style={[styles.title, titleStyle, titleAlign]}>
            {item.name}
          </Text>
        </View>

        <View style={[styles.card, cardStyle]}>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={20} color="#888" />
            <Text style={[styles.detailText, textStyle]}>
              {item.dates?.start?.localDate || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={20} color="#888" />
            <Text style={[styles.detailText, textStyle]}>
              {item.dates?.start?.localTime || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={20} color="#888" />
            <Text style={[styles.detailText, textStyle]}>
              {venue?.name || 'N/A'}
            </Text>
          </View>
        </View>

        {item.seatmap?.staticUrl && (
          <View style={[styles.card, cardStyle]}>
            <Text style={[styles.sectionTitle, titleStyle]}>Seat Map</Text>
            <Image
              source={{uri: item.seatmap.staticUrl}}
              style={styles.seatmapImage}
            />
          </View>
        )}

        {venue?.boxOfficeInfo && (
          <View style={[styles.card, cardStyle]}>
            <Text style={[styles.sectionTitle, titleStyle]}>Booking Info</Text>
            <Text style={[styles.infoText, textStyle]}>
              {venue.boxOfficeInfo.phoneNumberDetail}
            </Text>
            <Text style={[styles.infoText, textStyle]}>
              {venue.boxOfficeInfo.openHoursDetail}
            </Text>
          </View>
        )}

        {item.promoter && (
          <View style={[styles.card, cardStyle]}>
            <Text style={[styles.sectionTitle, titleStyle]}>Promoter</Text>
            <Text style={[styles.infoText, textStyle]}>
              {item.promoter.name}
            </Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Icon
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? '#FF3B30' : '#fff'}
        />
      </TouchableOpacity>
      {item.url && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 250,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  seatmapImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 75,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 75,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventDetails;
