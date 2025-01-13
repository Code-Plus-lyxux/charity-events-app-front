import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import SearchBar from '../../components/SearchBar';
import Location from '../../assets/icons/location-black.png';
import { getLoggedUser } from '../../api/user';
import { getAllUpcomingEventsByLocation, getEventsByStatus } from '../../api/events';

const Home = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const userData = await getLoggedUser();
        let eventsData = [];
        if (userData.location === null) {
          eventsData = await getEventsByStatus('1');
        } else {
          eventsData = await getAllUpcomingEventsByLocation(userData.location);
        }

        if (isMounted) {
          setEvents(eventsData);
          setFilteredEvents(eventsData); // Initialize filteredEvents with all events
          setUser(userData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching events:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  console.log('Events:', events);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredEvents(events); // Reset to full list if search is empty
    } else {
      const filtered = events?.filter((event) =>
        event.eventName.toLowerCase().includes(query.toLowerCase())

      );
      setFilteredEvents(filtered);
    }
  };

  const handleAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  const getHostedByUser = (event) => {
    return String(user?._id) === String(event?.userId);
  };

  console.log('Event Hosted by User:', getHostedByUser(events[2]), events[2]?.userId, user?._id);

  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30 }}>
        <Image source={Location} style={{ marginTop: 5 }} />
        <Pressable onPress={() => navigation.navigate('ProfilePage')}>
          <Text style={styles.location}>
            {user?.location ? user.location : 'Set your location'}
          </Text>
        </Pressable>
      </View>
      <Text style={{ fontSize: 20, marginLeft: 30, fontWeight: 'bold' }}>
        Discover and Join Community Events
      </Text>
      <Text style={{ fontSize: 14, marginLeft: 30, marginTop: 10, fontWeight: 'bold', color: '#00B894' }}>
        Join hands and be a part of something meaningful
      </Text>

      <View style={{ marginTop: 20 }}>
        <SearchBar value={searchQuery} onChangeText={handleSearch} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Upcoming Events</Text>
        <Pressable onPress={handleAddEvent}>
          <Text style={{ color: '#00554A', fontWeight: 'bold', fontSize: 16 }}>Add Event +</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text>Loading...</Text>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (

              <EventCard key={index} event={event} hostedByUser={getHostedByUser(event)} />
            ))
          ) : (
            <Text>No events found</Text>
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
    marginLeft: 10,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: '5%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
