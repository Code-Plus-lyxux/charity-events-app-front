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
import { API_URL } from '../../constants/api';
import { se } from 'date-fns/locale';
import DeleteIcon from '../../assets/images/trash_icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeleteEventByID} from '../../api/events'
import { getEventById } from '../../api/events';
import LocationModal from '../../components/LocationModal';

const EditEvent = ({ navigation, route }) => {
    const [eventDetails, setEventDetails] = useState({
        backgroundImage: '',
        eventName: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        aboutEvent: '',
        images: [],
        status: '0'
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { eventID, eventName, location, startDate, endDate, aboutEvent, backgroundImage } = route.params;
    

    // Pre-fill the fields with the data passed in route.params
    useEffect(() => {
        setEventDetails(prevDetails => ({
            ...prevDetails,
            eventName: eventName || '',
            location: location || '',
            startDateTime: startDate || '',
            endDateTime: endDate || '',
            aboutEvent: aboutEvent || '',
            backgroundImage: backgroundImage || ''
        }));
    }, [eventName, location, startDate, endDate, aboutEvent, backgroundImage]);

    useEffect(() => {
        if (eventID) {
            getEventById();
        }
    }, [eventID]);


     // Function to handle location selection
     const handleSuggestionSelect = (location) => {
        handleFieldChange('location', location);
    };

    const handleFieldChange = (field, value) => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const getEventById = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('Token', token);

        if (!token) {
            throw new Error('No token found');
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/api/events/${eventID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
                status: data.status?.toString() || '0', 
                images: data.images || []// Convert status to string for the form
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

            eventName:eventDetails.eventName,
            eventId: eventID, // Include the eventId explicitly
            startDate: eventDetails.startDateTime, // Map startDateTime to startDate
            endDate: eventDetails.endDateTime, // Map endDateTime to endDate
            backgroundImage: eventDetails.backgroundImage || null, // Handle null backgroundImage
            aboutEvent: eventDetails.aboutEvent,
            location:eventDetails.location,
            status: parseInt(eventDetails.status, 10),// Ensure status is a number
            images: eventDetails.images 
        };
        console.log('formattedEventDetails: ',formattedEventDetails);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/api/events/update`,
                formattedEventDetails,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Replace YOUR_ACCESS_TOKEN with the actual token
                    },
                }
            );
            console.log('Event updated successfully:', response.data);
    
            // Show success alert and navigate to EventPage with route parameter
            Alert.alert('Success', 'Event updated successfully!', [
                {
                    text: 'OK',
                    // onPress:() => navigation.navigate('EventPage', { 
                    //     id: route.params?.id , 
                    //     hostedByUser: route.params?.hostedByUser 
                    //   }),
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

    const handleDeleteEvent = async (event_ID) => {
        try {
            // Fetch event details
            const event = await getEventById(event_ID);
    
            // Confirm deletion
            Alert.alert(
                "Delete Event",
                `Do you want to delete this event "${eventDetails.eventName}"?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            try {
                                // Call delete API
                                const response = await DeleteEventByID(event_ID);
    
                                // Handle successful deletion
                                Alert.alert(
                                    "Event Deleted",
                                    `The event "${eventDetails.eventName}" has been successfully deleted.`,
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate('Tabs'), // Redirect on success
                                        },
                                    ]
                                );
                            } catch (error) {
                                console.error("Delete Event Error:", error.message);
                                Alert.alert(
                                    "Error",
                                    error.message || "An unexpected error occurred. Please try again later."
                                );
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Fetch Event Error:", error.message);
            Alert.alert(
                "Error",
                error.message || "Failed to fetch event details. Please try again later."
            );
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', minHeight: '100%' }}>

            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginTop: '8%', 
                paddingHorizontal: 26,
            }}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('EventPage', { id: eventID, hostedByUser: true })}
                    style={{ marginRight: 10 }}
                >
                    <Image source={BackArrowIcon} resizeMode="contain" style={styles.iconStyle} />
                </TouchableOpacity>
                <Text style={[styles.AddEventText, { flex: 1 }]}>Edit Event</Text>
                <TouchableOpacity
                    style={[styles.deleteButton, { flexDirection: 'row', alignItems: 'center' }]}
                    onPress={()=>handleDeleteEvent(eventID)}
                >
                    <Text style={styles.deleteText}>Delete Event</Text>
                    <Image source={DeleteIcon} style={styles.deleteIcon} />
                </TouchableOpacity>
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
                    <BackgroundImageUploadPortal
                        onBackgroundImageChange={updateBackgroundImage}
                        previousBackgroundImage={eventDetails.backgroundImage}
                    />

                    <EventDetail
                        property="Event Name"
                        value={eventDetails.eventName}
                        onChangeText={(text) => handleFieldChange('eventName', text)}
                    />
                    <DateTimePickerComponent
                        property="Start date and time"
                        value={eventDetails.startDateTime}
                        start_or_end="Start"
                        onChangeDateTime={(datetime) => handleFieldChange('startDateTime', datetime.toISOString())}
                    />
                    <DateTimePickerComponent
                        property="End date and time"
                        value={eventDetails.endDateTime}
                        start_or_end="End"
                        onChangeDateTime={(datetime) => handleFieldChange('endDateTime', datetime.toISOString())}
                    />
                    <LocationDetail
                        property="Location"
                        value={eventDetails.location}
                        onPress={() => setIsModalVisible(true)}
                        onChangeLocation={(text) => setEventDetails(prevDetails => ({
                            ...prevDetails,
                            location: text
                        }))}
                    />
                    <AboutEvent
                        property="About Event"
                        value={eventDetails.aboutEvent}
                        onChangeText={(text) => handleFieldChange('aboutEvent', text)}
                    />
                </View>


            </ScrollView>
            {/* Modal for Editing Details */}
            <LocationModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectLocation={handleSuggestionSelect}
            />
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.Edit_Event_Button} onPress={() => updateEventDetails()}>
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

    headerContainer: {
        width: '110%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    activeModalInput: {
        borderWidth: 1,
        borderColor: 'rgba(0, 184, 148, 0.3)',
        borderRadius: 50,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
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
    deleteButton: {
        backgroundColor: '#DA4F4F',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 30,
        width: '31%',
    },
    deleteIcon: {
        width: 12,
        height: 12,
    },
    deleteText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },


});


export default EditEvent