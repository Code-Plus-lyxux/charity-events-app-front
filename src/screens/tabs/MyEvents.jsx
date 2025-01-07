import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import EventCard from '../../components/EventCard';
import EventFilters from '../../components/EventFilters';
import { fetchEvents } from '../../api/events';

const MyEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Hosting');

  const getEventsByStatus = async (status) => {
    setLoading(true); 
    try {
      const eventsData = await fetchEvents(status, 0, 10);
      console.log(`Events with status ${status}:`, eventsData);
      setEvents(eventsData.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (activeFilter === 'Hosting') {
      getEventsByStatus(0);
    } else if (activeFilter === 'Upcoming Events') {
      getEventsByStatus(1);
    } else if (activeFilter === 'Past Events') {
      getEventsByStatus(2);
    }
  }, [activeFilter]);


  const filterEvents = (filter) => {
    setActiveFilter(filter);
  };

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

      
      <EventFilters activeTab={activeFilter} onFilterChange={filterEvents} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
});
