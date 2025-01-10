import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import SearchBar from '../../components/SearchBar';
import Location from '../../assets/icons/location-black.png';
import { getLoggedUser } from '../../api/user';
import { getAllUpcomingEventsByLocation } from '../../api/events';
import { getEventsByStatus } from '../../api/events';
import { set } from 'date-fns';
import { is } from 'date-fns/locale';

const Home = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const userData = await getLoggedUser();
        if (userData.location === null) {
          const events = await getEventsByStatus('1');
          if (isMounted) {
            setEvents(events);
          }
        } else {
          const events = await getAllUpcomingEventsByLocation(userData.location);
          if (isMounted) {
            setEvents(events);
          }
        }

        if (isMounted) {
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
  }, []);

  const handleAddEvent = () => {
    navigation.navigate('Event');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30 }}>
        <Image source={Location} style={{ marginTop: 5 }} />
        <Pressable onPress={() => navigation.navigate('ProfilePage')} >
        <Text style={styles.location}>
          {user?.location ? user.location : 'Set your location'}
        </Text>
        </Pressable>
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
              <EventCard key={index} event={event} hostedByUser={false} />
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
