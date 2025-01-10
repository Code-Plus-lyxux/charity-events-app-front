import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Modal, Animated, FlatList, Alert } from 'react-native';
import BackArrowIcon from '../../assets/images/back_arrow_icon_2.png';
import SearchNormalIcon from '../../assets/images/search-normal.png';
import SearchPressedIcon from '../../assets/images/search-pressed.png';
import { EventDetail } from '../../components/EventDetail';
import { LocationDetail } from '../../components/LocationDetail';
import { AboutEvent } from '../../components/AboutEvent';
import DateTimePickerComponent from '../../components/DateTimePicker';
import { BackgroundImageUploadPortal } from '../../components/BackgroundImageUploadPortal';
import { UploadCover } from '../../components/UploadCover';
import Hero from '../../assets/images/event-cover.png';
import axios from 'axios';


const EditEvent = ({ navigation,route }) => {
     const [eventDetails, setEventDetails] = useState({
            backgroundImage: '',
            eventName: '',
            startDateTime: '',
            endDateTime: '',
            location: '',
            aboutEvent: '',
            status: '0'
        });  
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeLocationSearching, setActiveLocationSearching] = useState(false);
    const [suggestions, setSuggestions] = useState(['Kandy', 'Kandy,Sri Lanka']);
    //const eventID = route.params?.eventID;
    const eventID = '677f59ac0f5d27206ba283d9'
    // Animated value for modal slide
    const slideAnim = useState(new Animated.Value(0))[0];
    

    useEffect(() => {
        if (eventID) {
            getEventById();
        }
    }, [eventID]);

    // Trigger slide-up animation when modal is shown
    useEffect(() => {
        if (isModalVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isModalVisible]);

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            // Replace with API call (e.g., Google Places API)
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=YOUR_API_KEY`);
            const data = await response.json();
            const places = data.predictions.map((item) => item.description);
            setSuggestions(places);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            location: suggestion, // Set the new location value
        }));
        setIsModalVisible(false);
    };

    const getEventById = async () => {
        try {
            const response = await axios.get(
                `http://10.0.3.2:5001/api/events/${eventID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2Q1ZDZhNTg5MjY5YWI4OTA1OGRiMiIsImlhdCI6MTczNjM5NjA1MCwiZXhwIjoxNzM2NDM5MjUwfQ.qP9D5PWN-G5gw1h4DjtKuKxOxmbz4ks1pV4uMrvNiMw`,
                    },
                }
            );
    
            const data = response.data;
            

            // Map the data to match your state structure if necessary
            setEventDetails({
                backgroundImage: data.backgroundImage || '',
                eventName: data.eventName || '',
                startDateTime: data.startDate || '',
                endDateTime: data.endDate || '',
                location: data.location || '',
                aboutEvent: data.aboutEvent || '',
                status: data.status?.toString() || '0', // Convert status to string for the form
            });
    
            console.log('Fetched event:', data);
        } catch (error) {
            console.error('Error fetching event:', error.response ? error.response.data : error.message);
        }
    };
    

    const updateEventDetails = async () => {
        // Check for missing details
        const missingDetails = [];
        if (!eventDetails.eventName) missingDetails.push('Event Name');
        if (!eventDetails.startDateTime) missingDetails.push('Start Date/Time');
        if (!eventDetails.endDateTime) missingDetails.push('End Date/Time');
        if (!eventDetails.location) missingDetails.push('Location');
        if (!eventDetails.aboutEvent) missingDetails.push('About Event');
    
        if (missingDetails.length > 0) {
            // Show alert for missing details
            Alert.alert(
                'Missing Details',
                `Please add the following details:\n${missingDetails.join('\n')}`,
                [{ text: 'OK', style: 'cancel' }]
            );
            return; // Exit function if validation fails
        }
    
        // Format event details for the API
        const formattedEventDetails = {
            ...eventDetails,
            eventId: eventID, // Include the eventId explicitly
            startDate: eventDetails.startDateTime, // Map startDateTime to startDate
            endDate: eventDetails.endDateTime, // Map endDateTime to endDate
            backgroundImage: eventDetails.backgroundImage || null, // Handle null backgroundImage
            status: parseInt(eventDetails.status, 10), // Ensure status is a number
        };
    
        try {
            const response = await axios.put(
                'http://10.0.3.2:5001/api/events/update',
                formattedEventDetails,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2Q1ZDZhNTg5MjY5YWI4OTA1OGRiMiIsImlhdCI6MTczNjM5NjA1MCwiZXhwIjoxNzM2NDM5MjUwfQ.qP9D5PWN-G5gw1h4DjtKuKxOxmbz4ks1pV4uMrvNiMw`, // Replace YOUR_ACCESS_TOKEN with the actual token
                    },
                }
            );
            console.log('Event updated successfully:', response.data);
    
            // Show success alert and navigate to EventPage with route parameter
            Alert.alert('Success', 'Event updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('EventPage', { hostedByUser: true }),
                },
            ]);
        } catch (error) {
            console.error(
                'Error updating event:',
                error.response ? error.response.data : error.message
            );
    
            // Show error alert for API issues
            Alert.alert(
                'Error',
                error.response ? error.response.data.message || 'Failed to update event' : 'Something went wrong',
                [{ text: 'OK', style: 'cancel' }]
            );
        }
    };
    
    const updateBackgroundImage = (uri) => {
        setEventDetails((prevDetails) => ({
          ...prevDetails,
          backgroundImage: uri,
        }));
        
      };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', minHeight: '100%' }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '8%', paddingHorizontal: 26, }}>
                <TouchableOpacity onPress={() => navigation.navigate('EventPage')}>
                    <Image source={BackArrowIcon} resizeMode="contain" style={styles.iconStyle} />
                </TouchableOpacity>
                <Text style={[styles.AddEventText]}>Edit Event</Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    backgroundColor: 'white',
                    minHeight: '100%',
                    paddingHorizontal: 10,
                }}
                showsVerticalScrollIndicator={false}
            >
            
                <View style={styles.container}>
                    <BackgroundImageUploadPortal onBackgroundImageChange={updateBackgroundImage} previousBackgroundImage={eventDetails.backgroundImage}/>
                    <EventDetail 
                        property="Event Name" 
                        value={eventDetails.eventName} 
                        onChangeText={(text) => 
                            setEventDetails((prev) => ({ ...prev, eventName: text }))
                        } 
                    />
                    <DateTimePickerComponent 
                        property="Start date and time" 
                        value={eventDetails.startDateTime} 
                        start_or_end="Start" 
                        onChangeDateTime={(datetime) => 
                            setEventDetails((prev) => ({ ...prev, startDateTime: datetime.toISOString() }))
                        } 
                    />
                    <DateTimePickerComponent 
                        property="End date and time" 
                        value={eventDetails.endDateTime} 
                        start_or_end="End" 
                        onChangeDateTime={(datetime) => 
                            setEventDetails((prev) => ({ ...prev, endDateTime: datetime.toISOString() }))
                        } 
                    />
                    <LocationDetail 
                        property="Location" 
                        value={eventDetails.location} 
                        onPress={() => setIsModalVisible(true)} 
                        onChangeLocation={(location) => 
                            setEventDetails((prev) => ({ ...prev, location }))
                        }
                    />
                    <AboutEvent 
                        property="About Event" 
                        value={eventDetails.aboutEvent} 
                        onChangeText={(text) => 
                            setEventDetails((prev) => ({ ...prev, aboutEvent: text }))
                        } 
                    />
                </View>

        
            </ScrollView>

            {/* Modal for Editing Details */}
            <Modal
                        animationType="none"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                            <Animated.View
                                style={[
                                    styles.modalContainer,
                                    { transform: [{ translateY: slideAnim }] },
                                ]}
                            >
                                <Pressable
                                    style={[
                                        activeLocationSearching
                                            ? styles.activeModalInput
                                            : styles.modalInput,
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        },
                                    ]}
                                    onPress={() => setActiveLocationSearching(true)}
                                >
                                    <TextInput
                                        style={[styles.locationInput, { flex: 1 }]}
                                        value={eventDetails.location}
                                        onChangeText={(text) => {
                                            setLocation(text);
                                            setActiveLocationSearching(true);
                                            fetchSuggestions(text)
                                        }}
                                        onFocus={() => setActiveLocationSearching(true)}
                                        placeholder="Search for location"
                                        placeholderTextColor="#888"
                                    />
                                    <Image
                                        source={activeLocationSearching ? SearchPressedIcon : SearchNormalIcon}
                                        resizeMode="contain"
                                        style={[styles.iconStyle, { marginLeft: 10 }]}
                                    />
                                </Pressable>

                                {suggestions.length > 0 && (
                                    <>
                                        <Text style={styles.suggestionsTitle}>Location Suggestions</Text>
                                        <FlatList
                                            data={suggestions}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity onPress={() => handleSuggestionSelect(item)} >
                                                    <View style={styles.separator} />
                                                    <Text style={styles.suggestionText}>{item}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </>
                                )}


                            </Animated.View>
                        </View>
                    </Modal>


            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.Edit_Event_Button} onPress={()=>updateEventDetails()}>
                    <Text style={styles.buttonTextEditEvent}>Save Details</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    },
    TitleText: {
        fontSize: 20,
        color: '#000',
        marginTop: '10',
    },
    AddEventText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
    },
    iconStyle: {
        maxWidth: '100%',
        maxHeight: '40%',
    },
    input: {
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
    },
    inputWrapper: {
        width: '11%',
        height: '100%',
        backgroundColor: '#fff',
        marginHorizontal: 5,
        borderRadius: 8,
        borderColor: '#A29494',
        borderWidth: 1,
        marginVertical: 5,
        marginInlineStart: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    Edit_Event_Button: {
        backgroundColor: '#00B894',
        width: '95%',
        height: 35,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#00B894',
        borderWidth: 1,
        marginTop: '9%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonTextEditEvent: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '400',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    headerContainer: {
        width: '110%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    modalContainer: {
        height: '80%',
        backgroundColor: '#fff',
        paddingHorizontal: '10%',
        paddingVertical: '5%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: 'rgba(87, 87, 87, 0.3)',
        borderRadius: 50,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
    },
    activeModalInput: {
        borderWidth: 1,
        borderColor: 'rgba(0, 184, 148, 0.3)',
        borderRadius: 50,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
    },
    suggestionsTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 10,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
    suggestionText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 10
    },
    bottomContainer: {
        height: 100,
        width: '100%',
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 15 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 6, 
        elevation: 1,
        zIndex: 1,
    },
    
});


export default EditEvent