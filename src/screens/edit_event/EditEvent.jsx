import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Modal, Animated, FlatList, TouchableWithoutFeedback } from 'react-native';
import BackArrowIcon from '../../assets/images/back_arrow_icon_2.png';
import GalleryImportIcon from '../../assets/images/gallery-import.png';
import CalenderIcon from '../../assets/images/calendar.png';
import SearchNormalIcon from '../../assets/images/search-normal.png';
import SearchPressedIcon from '../../assets/images/search-pressed.png';
import { EventDetail } from '../../components/EventDetail';
import { LocationDetail } from '../../components/LocationDetail';
import { AboutEvent } from '../../components/AboutEvent';
import DateTimePickerComponent from '../../components/DateTimePicker';
import { CoverPhotoUploadPortal } from '../../components/CoverPhotoUploadPortal';
import { UploadCover } from '../../components/UploadCover';
import Hero from '../../assets/images/event-cover.png';


const EditEvent = ({ navigation }) => {
    const [eventName, setEventName] = useState('Support Animal Welfare: Spend a Day Volunteering at the Local Shelter and Make a Difference');
    const [startDateTime, setStartDateTime] = useState('2025-01-01T10:00:00');
    const [endDateTime, setEndDateTime] = useState('2025-01-01T15:00:00');
    const [location, setLocation] = useState('Kandy, Sri Lanka');
    const [aboutEvent, setAboutEvent] = useState('Join us for a meaningful day at the local animal shelter in Kandy, where you’ll have the opportunity to support animal welfare by directly engaging with the animals in need. Spend time feeding, cleaning, and playing with the sheltered animals to help them feel loved and cared for. Your efforts will contribute to the overall well-being of the animals and help raise awareness about the importance of adoption. ');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeLocationSearching, setActiveLocationSearching] = useState(false);
    const [suggestions, setSuggestions] = useState(['Kandy', 'Kandy,Sri Lanka']);

    // Animated value for modal slide
    const slideAnim = useState(new Animated.Value(0))[0];


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
        setLocation(suggestion);
        setIsModalVisible(false);
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
                       
                        <UploadCover source={Hero} />
                        <EventDetail property='Event Name' value={eventName} onChangeText={(text) => setEventName(text)} />
                        <DateTimePickerComponent property='Start date and time' value={startDateTime} start_or_end='Start' onChangeDateTime={(datetime) => setStartDateTime(datetime.toISOString())} />
                        <DateTimePickerComponent property='End date and time' value={endDateTime} start_or_end='End' onChangeDateTime={(datetime) => setEndDateTime(datetime.toISOString())} />
                        <LocationDetail property='Location' value={location} onPress={() => setIsModalVisible(true)} />
                        <AboutEvent property='About Event' value={aboutEvent} onChangeText={(text) => setAboutEvent(text)} />
                   
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
                                        value={location}
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
                <TouchableOpacity style={styles.Edit_Event_Button} onPress={''}>
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
    },
    
});


export default EditEvent