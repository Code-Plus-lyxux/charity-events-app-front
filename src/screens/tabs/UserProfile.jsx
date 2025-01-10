import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Pressable } from 'react-native';
import user_image from '../../assets/images/user_image.png';
import icons from '../../constants/icons';
import events from '../../constants/events';
import EventCard from '../../components/EventCard';
import IconToggle from '../../components/IconToggle';
import { fetchEvents } from '../../api/events';
import { useUser } from '../../context/UserContext';
import { getLoggedUser } from '../../api/user';

const UserProfile = ({ navigation }) => {
    const userr = {
        name: 'Lucifer Barret',
        email: 'lucilebarret@gmail.com',
        image: user_image,
    };


    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getLoggedUser();
                console.log(userData, user);

                setUser(userData);

                // Combine all event arrays into one
                const allEvents = [
                    ...userData.eventsAttended,
                    ...userData.eventsCreated,
                    ...userData.eventsAttending,
                ];

                const seen = new Set();
                const uniqueEvents = allEvents.filter((event) => {
                    if (seen.has(event._id)) {
                        return false;
                    }
                    seen.add(event._id);
                    return true;
                });

                setEvents(uniqueEvents);

                setUser(userData);
                //setEvents(allEvents); // Set the combined events to state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleIconPress = (icon) => {
        if (icon === "hand") {
            setEvents(user.eventsAttending); // Only show attending events
        } else {
            setEvents(uniqueEvents);
        }
    };

    if (error) {
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <Pressable onPress={() => navigation.navigate('ProfilePage')} style={styles.header}>
                <View style={styles.header}>
                    <Image source={icons.SettingsIcon} />
                </View>
            </Pressable>
            <View style={styles.container}>
                <Image
                    source={user.image ? { uri: user.image } : user_image}
                    resizeMode="contain"
                    style={styles.imageStyle}
                />

                <Text style={styles.NameText}>{user.fullName}</Text>
                <Text style={styles.EmailText}>{user.email}</Text>
            </View>
            <IconToggle onIconPress={handleIconPress} />
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