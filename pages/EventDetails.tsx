import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {type Event} from '../components/EventCard';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventDetails = ({route}: {route: any}) => {
  const {item} = route.params as {item: Event};
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        const isFav = favoritesArray.some((fav: Event) => fav.id === item.id);
        setIsFavorite(isFav);
      }
    };
    checkIfFavorite();
  }, [item.id]);

  const toggleFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    let favoritesArray = favorites ? JSON.parse(favorites) : [];
    if (isFavorite) {
      favoritesArray = favoritesArray.filter(
        (fav: Event) => fav.id !== item.id,
      );
    } else {
      favoritesArray.push(item);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    setIsFavorite(!isFavorite);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const contentContainerStyle = {
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
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView>
        {image && <Image source={{uri: image.url}} style={styles.image} />}
        <View style={[styles.contentContainer, contentContainerStyle]}>
          <Text style={[styles.title, titleStyle]}>{item.name}</Text>
          <Text style={textStyle}>
            Date: {item.dates?.start?.localDate || 'N/A'}
          </Text>
          <Text style={textStyle}>
            Venue: {item._embedded?.venues[0]?.name || 'N/A'}
          </Text>
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
});

export default EventDetails;
