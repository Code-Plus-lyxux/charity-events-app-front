import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import EventCard from '../../components/EventCard';
import Hero from '../../assets/images/event-cover.png';
import EventFilters from '../../components/EventFilters';

const MyEvents = ({navigation}) => {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Hosting');

    const events = [
        {
            id: 1,
            title: 'Support Animal Welfare: Spend a Day Volunteering at the Local Shelter and Make a Difference',
            location: 'Haven Paws Animal Shelter, Kandy',
            date: '2024-10-05',
            image: Hero,
            description:
                'Join us for a day of fun and excitement as we volunteer at the local animal shelter. Spend time with the animals, help with feeding and cleaning, and make a difference in their lives. All are welcome, and no experience is necessary. We hope to see you there!',
        },
        {
            id: 2,
            title: 'Support Animal Welfare: Spend a Day Volunteering at the Local Shelter and Make a Difference',
            location: 'Haven Paws Animal Shelter, Kandy',
            date: '2025-01-11',
            image: Hero,
            description:
                'Join us for a day of fun and excitement as we volunteer at the local animal shelter. Spend time with the animals, help with feeding and cleaning, and make a difference in their lives. All are welcome, and no experience is necessary. We hope to see you there!',
        },
        {
            id: 3,
            title: 'Support Animal Welfare: Spend a Day Volunteering at the Local Shelter and Make a Difference',
            location: 'Haven Paws Animal Shelter, Kandy',
            date: '2024-12-31',
            image: Hero,
            description:
                'Join us for a day of fun and excitement as we volunteer at the local animal shelter. Spend time with the animals, help with feeding and cleaning, and make a difference in their lives. All are welcome, and no experience is necessary. We hope to see you there!',
        },
        {
            id: 4,
            title: 'Support Animal Welfare: Spend a Day Volunteering at the Local Shelter and Make a Difference',
            location: 'Haven Paws Animal Shelter, Kandy',
            date: '2024-07-09',
            image: Hero,
            description:
                'Join us for a day of fun and excitement as we volunteer at the local animal shelter. Spend time with the animals, help with feeding and cleaning, and make a difference in their lives. All are welcome, and no experience is necessary. We hope to see you there!',
        }
    ];

    const filterEvents = (filter) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let filtered = [];
      
        if (filter === 'Upcoming Events') {
          filtered = events.filter((event) => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate > today;
          });
        } else if (filter === 'Past Events') {
          filtered = events.filter((event) => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0); 
            return eventDate < today; 
          });
        } else if (filter === 'Hosting') {
          filtered = events.filter((event) => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0); 
            return eventDate.getTime() === today.getTime();
          });
        }
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
                <Pressable onPress={() => navigation.navigate('AddEvent')}>
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
