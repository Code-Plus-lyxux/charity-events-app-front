import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { View, Text,StyleSheet,Image,SafeAreaView,ScrollView,TextInput,Pressable,TouchableOpacity,Modal,Animated,FlatList,Alert} from 'react-native';
import BackArrowIcon from '../../assets/images/back_arrow_icon_2.png';
import { EventDetail } from '../../components/EventDetail';
import { LocationDetail } from '../../components/LocationDetail';
import { AboutEvent } from '../../components/AboutEvent';
import DateTimePickerComponent from '../../components/DateTimePicker';
import { BackgroundImageUploadPortal } from '../../components/BackgroundImageUploadPortal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../constants/api';
import LocationModal from '../../components/LocationModal';

const Add_event = ({navigation}) => {

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

    const handleFieldChange = (field, value) => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const submitEventDetails = async () => {
        // Check for missing details
        
        const missingDetails = [];
        if (!eventDetails.eventName) missingDetails.push('Event Name');
        if (!eventDetails.startDateTime) missingDetails.push('Start Date/Time');
        if (!eventDetails.endDateTime) missingDetails.push('End Date/Time');
        if (!eventDetails.location) missingDetails.push('Location');
        if (!eventDetails.aboutEvent) missingDetails.push('About Event');
        console.log('submit uri: ',eventDetails.backgroundImage)

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
            backgroundImage: eventDetails.backgroundImage,
            startDate: eventDetails.startDateTime,
            endDate: eventDetails.endDateTime,
            images: [],
            status: parseInt(eventDetails.status, 0), // Convert status to a number
        };

        const token = await AsyncStorage.getItem('token');
        console.log('Token', token);

        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/events/add`,
                formattedEventDetails,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Use backticks for interpolation
                    },
                }
            );
            console.log('Event saved:', response.data);

            // Show success alert
            Alert.alert('Success', 'Event created successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Tabs'), // Navigate to the Event page
                },
            ]);
        } catch (error) {
            console.error('Error saving event:', error.response ? error.response.data : error.message);

            // Show error alert for API issues
            Alert.alert(
                'Error',
                error.response ? error.response.data.message || 'Failed to create event' : 'Something went wrong',
                [{ text: 'OK', style: 'cancel' }]
            );
        }
    };
    

    // Function to handle location selection
    const handleSuggestionSelect = (location) => {
        handleFieldChange('location', location);
    };

    const updateBackgroundImage = (uri) => {
        setEventDetails((prevDetails) => ({
          ...prevDetails,
          backgroundImage: uri,
        }));
        
      };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', minHeight: '100%' }}>
    
        
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '8%',marginBottom: '24',paddingHorizontal: 26,}}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image source={BackArrowIcon} resizeMode="contain" style={styles.iconStyle} />
                </TouchableOpacity>
                <Text style={[styles.AddEventText]}>Add Event</Text>
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
                    <BackgroundImageUploadPortal onBackgroundImageChange={updateBackgroundImage} previousBackgroundImage={''}/>
                    <EventDetail property='Event Name' value={eventDetails.eventName} onChangeText={(text) => handleFieldChange('eventName', text)}/>
                    <DateTimePickerComponent property='Start date and time' value={eventDetails.startDateTime} start_or_end='Start' onChangeDateTime={(datetime) => handleFieldChange('startDateTime', datetime.toISOString())} />
                    <DateTimePickerComponent property='End date and time' value={eventDetails.endDateTime} start_or_end='End' onChangeDateTime={(datetime) => handleFieldChange('endDateTime', datetime.toISOString())} />
                    <LocationDetail property='Location' value={eventDetails.location} onPress={() => setIsModalVisible(true)}/>
                    <AboutEvent property='About Event' value={eventDetails.aboutEvent} onChangeText={(text) => handleFieldChange('aboutEvent', text)}/>

                    

                </View>
            </ScrollView>


            {/* Modal for Editing Details */}
            <LocationModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectLocation={handleSuggestionSelect}
            />
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.Create_Event_Button} onPress={()=>submitEventDetails()}>
                    <Text style={styles.buttonTextCreateEvent}>Create Event</Text>
                </TouchableOpacity>
            </View>
                    
                    
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingHorizontal: 30,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'space-between',
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

    Create_Event_Button: {
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
    buttonTextCreateEvent: {
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
        height:'80%',
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
        marginVertical:10
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


export default Add_event