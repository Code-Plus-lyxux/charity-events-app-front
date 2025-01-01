import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import EventCard from '../../components/EventCard';
import EventFilters from '../../components/EventFilters';
import events from '../../constants/events';
import { parse, isAfter, isBefore, isSameDay } from 'date-fns';

const MyEvents = () => {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Hosting');

    
      const filterEvents = (filter) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    
        let filtered = [];
    
        events.forEach((event) => {
            const eventDate = parse(event.date, 'dd MMMM yyyy', new Date()); // Parse non-ISO format
    
            if (filter === 'Upcoming Events' && isAfter(eventDate, today)) {
                filtered.push(event);
            } else if (filter === 'Past Events' && isBefore(eventDate, today)) {
                filtered.push(event);
            } else if (filter === 'Hosting' && isSameDay(eventDate, today)) {
                filtered.push(event);
            }
        });
    
        setFilteredEvents(filtered);
        setActiveFilter(filter);
    };
    
      
      

    React.useEffect(() => {
        filterEvents(activeFilter);
    }, []);

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
            <EventFilters activeTab={activeFilter} onFilterChange={filterEvents} />

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {filteredEvents.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
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
