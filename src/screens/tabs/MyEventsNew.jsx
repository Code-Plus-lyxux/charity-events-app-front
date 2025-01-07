import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import EventCard from '../../components/EventCard';
import Hero from '../../assets/images/event-cover.png';
import EventFilters from '../../components/EventFilters';
import { getLoggedUser } from '../../api/user';

const MyEventsNew = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Hosting'); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getLoggedUser();
        console.log(userData);

        setUser(userData);
        
        // Combine all event arrays into one
        const allEvents = [
          ...userData.eventsAttended,
          ...userData.eventsCreated,
          ...userData.eventsAttending,
        ];

        setUser(userData);
        setEvents(allEvents); // Set the combined events to state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 25,
          paddingHorizontal: 30,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>My Events</Text>
        <Pressable onPress={''}>
          <Text style={{ color: '#00554A', fontWeight: 'bold', fontSize: 16 }}>
            Add Event +
          </Text>
        </Pressable>
      </View>

      <EventFilters activeTab={'Hosting'} onFilterChange={() => { }} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </ScrollView>
      </View>

    </View>
  );

};

export default MyEventsNew;

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
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: '5%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});