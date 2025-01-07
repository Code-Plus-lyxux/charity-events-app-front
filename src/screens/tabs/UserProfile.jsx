import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Pressable } from 'react-native';
import user_image from '../../assets/images/user_image.png';
import icons from '../../constants/icons';
import events from '../../constants/events';
import EventCard from '../../components/EventCard';
import IconToggle from '../../components/IconToggle';
import { fetchEvents } from '../../api/events';
import { useUser } from '../../context/UserContext';

const UserProfile = ({ navigation }) => {
    const user = {
        name: 'Lucifer Barret',
        email: 'lucilebarret@gmail.com',
        image: user_image,
    };


    const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const getEvents = async () => {
            if (!user) {
                console.log("User not logged in");
                return; // Stop if user is not logged in
              }
          try {
            const eventsData = await fetchEvents(1, user.userId, 10);
            setEvents(eventsData.events || []);
          } catch (error) {
            console.error('Error fetching events:', error);
          } finally {
            setLoading(false);
          }
        };
    
        getEvents();
      }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Pressable onPress={() => navigation.navigate('ProfilePage')} style={styles.header}>
                <View style={styles.header}>
                    <Image source={icons.SettingsIcon} />
                </View>
            </Pressable>
            <View style={styles.container}>
                <Image source={user.image} resizeMode="contain" style={styles.imageStyle} />
                <Text style={styles.NameText}>{user.name}</Text>
                <Text style={styles.EmailText}>{user.email}</Text>
            </View>
            <IconToggle />
            <View style={styles.eventsSection}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>
                    {events.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
    },
    container: {
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    NameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
    EmailText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    eventsSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    eventsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollContainer: {
        paddingBottom: 20,
        alignItems: 'center',
    },
});
