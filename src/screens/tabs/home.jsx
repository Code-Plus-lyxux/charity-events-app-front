import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import SearchBar from '../../components/SearchBar';
import Location from '../../assets/icons/location-black.png';
import events from '../../constants/events';
import { fetchEvents } from '../../api/events';

const Home = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventsData = await fetchEvents(1, 1, 10);
        setEvents(eventsData.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const handleAddEvent = () => {
    navigation.navigate('MyEventsNew');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30 }}>
        <Image source={Location} style={{ marginTop: 5 }} />
        <Text style={styles.location}>Kandy, Sri Lanka</Text>
      </View>
      <Text style={{ fontSize: 20, marginLeft: 30, fontWeight: 'bold' }} >Discover and Join Community Events</Text>
      <Text style={{ fontSize: 14, marginLeft: 30, marginTop: 10, fontWeight: 'bold', color: '#00B894' }} >Join hands and be a part of something meaningful</Text>

      <View style={{ marginTop: 20 }}>
        <SearchBar />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Upcoming Events</Text>
        <Pressable onPress={handleAddEvent}>
          <Text style={{ color: '#00554A', fontWeight: 'bold', fontSize: 16 }}>Add Event +</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            events.map((event, index) => (
              <EventCard key={index} event={event} hostedByUser={true} />
            ))
          )}
        </ScrollView>

      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: 'white',
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 25,
    marginLeft: 10
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: '5%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
