import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import EventCard from '../../components/EventCard';
import EventFilters from '../../components/EventFilters';
import { getLoggedUser } from '../../api/user';
import { useFocusEffect } from '@react-navigation/native';

const MyEvents = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Hosting');

  const filterLabels = {
    Hosting: 'Hosting',
    Upcoming: 'Upcoming Events',
    Past: 'Past Events',
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getLoggedUser();
      console.log('my events user data', userData);

      setUser(userData);
      setEvents({
        Hosting: userData.eventsCreated || [],
        Upcoming: userData.eventsAttending || [],
        Past: userData.eventsAttended || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // Get the events for the active tab
  const filteredEvents = events[activeTab] || [];

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
        <Pressable onPress={() => navigation.navigate('AddEvent')}>
          <Text style={{ color: '#00554A', fontWeight: 'bold', fontSize: 16 }}>
            Add Event +
          </Text>
        </Pressable>
      </View>

      {/* Event Filters */}
      <EventFilters
        activeTab={activeTab}
        onFilterChange={(filter) => setActiveTab(filter)}
        filterLabels={filterLabels}
      />

      {/* Event List */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} hostedByUser={true}/>
          )))}
        </ScrollView>
      </View>
    </View>
  );
};

export default MyEvents;

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
