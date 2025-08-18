import React from 'react';
import {View, Text, FlatList, StyleSheet, useColorScheme} from 'react-native';
import EventCard, {type Event} from './EventCard';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const EventsList = ({
  title = '',
  events,
}: {
  events: Event[];
  title?: string;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const titleStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  return (
    <View style={styles.eventsSection}>
      {title && <Text style={[styles.eventsTitle, titleStyle]}>{title}</Text>}
      <FlatList
        data={events}
        renderItem={({item}: {item: Event}) => <EventCard item={item} />}
        keyExtractor={(item: Event) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  eventsSection: {
    flex: 1,
  },
  eventsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default EventsList;
