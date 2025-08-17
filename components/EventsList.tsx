import React from 'react';
import {View, Text, FlatList} from 'react-native';

const EventsList = () => {
  // This component will render a list of events
  return (
    <View style={styles.favoritesSection}>
      <Text style={[styles.favoritesTitle, titleStyle]}>Favourites</Text>
      <FlatList
        data={favoriteEvents}
        renderItem={({item}) => <EventCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};
