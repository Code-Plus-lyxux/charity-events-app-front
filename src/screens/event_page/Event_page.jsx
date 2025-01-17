import React, { useState, useEffect } from 'react';

import {
    Image,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    PanResponder,
    Alert
} from 'react-native';
import Comment from '../../components/Comment';

import Event_Cover_Image from '../../assets/images/event-cover.png';
import UserCountIcon from '../../assets/images/user_count_icon.png';
import ShareIcon from '../../assets/images/export.png';
import ImInIcon from '../../assets/images/im_in_icon.png';
import CommentIcon from '../../assets/images/comment_icon.png';
import DeleteIcon from '../../assets/images/trash_icon.png';
import axios, { all } from 'axios';
import GalleryImportIcon from '../../assets/images/gallery-import-2.png';
import EditIcon from '../../assets/images/edit_icon_2.png';
import SendIcon from '../../assets/images/send_icon.png';
import BackArrowButton2 from '../../assets/images/back_arrow_icon_3.png';
import Media_tab from './Media_tab'
import { launchImageLibrary } from 'react-native-image-picker';
import Event_tab from './Event_tab';
import { getEventById } from '../../api/events';
import { fi } from 'date-fns/locale';
import CommentsList from '../../components/CommentsList';
import { addCommentToEvent } from '../../api/events';
import { addUserToEvent } from '../../api/events';
import { removeUserFromEvent } from '../../api/events';
import { getLoggedUser } from '../../api/user';
import { format } from 'date-fns';
import { API_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const Event_page = ({ navigation, route }) => {
    const [activeTab, setActiveTab] = useState('details');
    const eventHostedByUser = route.params?.hostedByUser;
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState('');
    //const [no_of_UploadedImages, set_No_of_UploadedImages] = useState(0);
    const [selectImage, setSelectImage] = useState(false);
    const [coverImage, setCoverImage] = useState(false)
    const [selectedImages, setSelectedImages] = useState([]);
    const [refreshMediaTab, setRefreshMediaTab] = useState(false);
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [isAttending, setIsAttending] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingAttend, setLoadingAttend] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    let no_of_UploadedImages = 0;

    // Animated value for modal slide
    const slideAnim = useState(new Animated.Value(0))[0];


    const handleSelectImage = (images) => {
        setSelectImage(true);
        console.log(images);
    
        setSelectedImages((prevSelectedImages) => [
            ...(Array.isArray(images) ? images : []), // Fallback to an empty array if not an array
        ]);
    
        console.log('Selected images:', images);
    };

    const { id, hostedByUser } = route.params;
    const eventID = id
    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        return token;
    };

    // Usage
    const token = getToken();

    console.log('eventHostedByUser', id, hostedByUser);

    const statusText = {
        0: 'Hosting',
        1: 'Upcoming',
        2: 'Past',
    }

    useEffect(() => {
        setEvent(null);  // Reset event data
        setUser(null);   // Reset user data
        setLoading(true);  // Reset loading states if necessary
        setLoadingUser(true);
        setLoadingAttend(true);
    
        let isMounted = true;
    
        const fetchData = async () => {
            try {
                const userData = await getLoggedUser();
                if (isMounted) {
                    setUser(userData);
                    console.log('User:', userData);
                }
    
                const eventData = await getEventById(id);
                if (isMounted) {
                    setEvent(eventData);
                    no_of_UploadedImages= eventData.images.length;
                }
    
                if (isMounted && eventData?.attendUsers) {
                    const isUserAttending = eventData.attendUsers.includes(userData?._id);
                    setIsAttending(isUserAttending);
                    console.log('User is attending:', isUserAttending);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setLoadingUser(false);
                    setLoadingAttend(false);
                }
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false;
        };
    }, [id, refreshKey]);


    const getHostedByUser = (event) => {
        return user?._id === event?.userId;
    };

    console.log(user?._id, event?.userId._id);
    console.log('Event Hosted by User:', getHostedByUser(event));


    const renderBottomBar = () => {
        if (activeTab === 'media') {
            return (
                <View style={styles.bottomBar}>
                    {(!selectedImages?.length && eventHostedByUser) && (
                        <TouchableOpacity
                            style={styles.uploadButton1}
                            onPress={() => {
                                if (no_of_UploadedImages < 5) {
                                    console.log('no of uploaded images 2 : ',no_of_UploadedImages )
                                    pickImages(eventID);
                                    
                                } else {
                                    Alert.alert('Error', 'You can only upload 5 images per event.');
                                }
                            }}
                        >
                            <Text style={styles.uploadText}>Upload</Text>
                        </TouchableOpacity>
                    )}
    
                    {(selectedImages?.length > 0 && eventHostedByUser) && (
                        <>
                            <TouchableOpacity
                                style={styles.uploadButton2}
                                onPress={() => {
                                    if (no_of_UploadedImages < 5) {
                                        console.log('no of uploaded images 2 : ',no_of_UploadedImages )
                                        pickImages(eventID);
                                        
                                    } else {
                                        Alert.alert('Error', 'You can only upload 5 images per event.');
                                    }
                                }}
                            >
                                <Text style={styles.uploadText}>Upload</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.deleteButton, { color: '#DA4F4F', flexDirection: 'row' }]}
                                onPress={handleDeleteSelectedImages}
                            >
                                <Text style={styles.deleteText}>Delete</Text>
                                <Image source={DeleteIcon} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            );
        } else {
            return (
                <View style={styles.bottomBar}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <TouchableOpacity
                            style={[styles.imInButton, isAttending && { borderColor: '#00B894', backgroundColor: '#00B894' }, getHostedByUser(event) && styles.disabledButton]}
                            onPress={handleAddUserToEvent}
                            disabled={getHostedByUser(event)}
                        >
                            <Text style={[styles.imInText, isAttending && { color: 'white' },
                            getHostedByUser(event) && {
                                color: '#00b893',
                                opacity: 0.7,
                            }]}>
                                {isAttending ? 'You are in!' : "I'm in!"}
                            </Text>
                            <Image source={ImInIcon} style={styles.imInIcon} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.shareButton}>
                        <Text style={styles.shareText}>Share</Text>
                        <Image source={ShareIcon} style={styles.shareIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image source={CommentIcon} style={styles.commentIcon} />
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const formatEventDates = (startDate, endDate) => {
        const formattedStartDate = format(new Date(startDate), "yyyy MMMM dd 'from' h:mm a"); // Escaped 'from'
        const formattedEndDate = format(new Date(endDate), "h:mm a");

        return `${formattedStartDate} to ${formattedEndDate}`;
    };

    const startDate = "2025-02-03T09:30:00.000Z";
    const endDate = "2025-02-03T12:00:00.000Z";

    //console.log(formatEventDates(startDate, endDate));



    // Add comment
    const handleAddComment = async () => {
        if (comment.trim() === '') {
            return;
        }


        try {
            const newComment = await addCommentToEvent(id, comment);
            setComments((prevComments) => {
                console.log("Previous Comments:", prevComments);
                console.log("New Comment:", newComment);
                return [...prevComments, newComment];
            });

            setComment('');
            setRefreshKey((prev) => prev + 1);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    };




    // Trigger slide-up animation when modal is shown
    useEffect(() => {
        if (modalVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 1000,
                useNativeDriver: true,
            }).start();

        }
    }, [modalVisible]);



    //I'm in button
    const handleAddUserToEvent = async () => {
        if (loading) return;
        setError(null);

        try {
            if (isAttending) {
                await removeUserFromEvent(event._id);
                setIsAttending(false);
                console.log('User Removed from Event', event._id, user._id);
            } else {
                const updatedEvent = await addUserToEvent(event._id, user._id);
                setIsAttending(true);
                console.log('User Added to Event', event._id, user._id);
            }
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (err) {
            setError(`Could not update user in the event: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    if (error) {
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }
    if (loading) {
        return (

            <Text>Loading...</Text>

        );
    }
    if (loadingUser || !user) {
        return (

            <Text>Loading...</Text>

        );
    }
    if (loadingAttend) {
        return (
            <Text>Loading user status...</Text>

        );
    }
    const userCount = event.attendUsers.length;

    const renderTabContent = () => {
        if (activeTab === 'details') {
            return (
                <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white' }}>
                    <Event_tab dateTime={formatEventDates(event.startDate, event.endDate)} location={event.location} aboutEvent={event.aboutEvent} />
                </ScrollView>
            );
        } else if (activeTab === 'media') {
            return <Media_tab eventHostedByUser={eventHostedByUser} eventID={eventID} no_of_UploadedImages={no_of_UploadedImages} onSelectImage={handleSelectImage} refreshMediaTab={refreshMediaTab}/>;
        }
    };


    const handleDeleteSelectedImages = async () => {
        let allImages = [];
        const token = await AsyncStorage.getItem('token');
        const getEventImagesById = async (eventID) => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/events/${eventID}`,
                    {
                        headers: {
                            'content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        timeout: 10000
                    }
                );
    
                const data = response.data;
    
                // Filter out selected images
                allImages = data.images.filter((image) => !selectedImages.includes(image));
                no_of_UploadedImages=allImages.length;
    
                //console.log('Filtered Images:', allImages);
            } catch (error) {
                console.error(
                    'Error fetching event:',
                    error.response ? error.response.data : error.message
                );
            }
        };
    
        const deleteImages = async (eventID) => {
            const token = await AsyncStorage.getItem('token');
            try {
                await axios.put(
                    `${API_URL}/api/events/update`,
                    {
                        eventId: eventID,
                        images: allImages,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
    
                //console.log('Updated Images:', allImages);
            } catch (error) {
                console.error(
                    'Error updating event:',
                    error.response ? error.response.data : error.message
                );
            }
        };
    
        await getEventImagesById(eventID);
        await deleteImages(eventID);
    
        // Reset selected images
        setSelectedImages([]);
        
        // Trigger media tab refresh
        setRefreshMediaTab(prev => !prev);
    };
    

    const pickImages = async (eventID) => {
        try {
            // Fetch event data to determine the number of uploaded images
            const eventData = await getEventById(eventID);
            const no_of_UploadedImages = eventData.images.length;
    
            // Check if the limit is exceeded
            if (no_of_UploadedImages >= 5) {
                Alert.alert('Sorry!', 'You can only upload 5 images per event.');
                return; // Exit if limit is exceeded
            }
    
            // Launch the image picker if the limit is not exceeded
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    quality: 0.5,
                    selectionLimit: 5 - no_of_UploadedImages, // Allow the remaining number of images
                },
                async (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.errorMessage) {
                        console.log('ImagePicker Error: ', response.errorMessage);
                    } else {
                        const images = response.assets.map((asset) => {
                            const uniqueIdentifier = Date.now();
                            const originalFileName = asset.fileName || `image_${uniqueIdentifier}`;
                            const uniqueFileName = `${uniqueIdentifier}_${originalFileName}`;
                            const fileType = asset.type;
    
                            return {
                                uri: asset.uri,
                                fileName: uniqueFileName,
                                type: fileType,
                            };
                        });
    
                        const formData = new FormData();
                        images.forEach((image) => {
                            formData.append('images', {
                                uri: image.uri,
                                name: image.fileName,
                                type: image.type,
                            });
                        });
    
                        const token = await AsyncStorage.getItem('token');
                        try {
                            const uploadResponse = await axios.post(
                                `${API_URL}/api/events/upload-images`,
                                formData,
                                {
                                    headers: {
                                        'content-Type': 'multipart/form-data',
                                        Authorization: `Bearer ${token}`,
                                        'cache-control': 'no-cache',
                                    },
                                    timeout: 10000,
                                }
                            );
    
                            if (uploadResponse.status === 200 && uploadResponse.data.files?.length > 0) {
                                const uploadedImageUrls = uploadResponse.data.files.map((file) => file.url);
    
                                const eventDetailsResponse = await axios.get(
                                    `${API_URL}/api/events/${eventID}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
    
                                let existingImages = [];
                                if (eventDetailsResponse.status === 200 && eventDetailsResponse.data.images) {
                                    existingImages = eventDetailsResponse.data.images;
                                }
    
                                const allImages = [...existingImages, ...uploadedImageUrls];
    
                                const formattedEventDetails = {
                                    eventId: eventID,
                                    images: allImages,
                                };
    
                                const updateResponse = await axios.put(
                                    `${API_URL}/api/events/update`,
                                    formattedEventDetails,
                                    {
                                        headers: {
                                            'content-Type': 'application/json',
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
    
                                if (updateResponse.status === 200) {
                                    Alert.alert('Success', 'Event updated successfully with all images');
                                    setRefreshMediaTab((prev) => !prev);
                                } else {
                                    Alert.alert('Error', 'Failed to update the event');
                                }
                            } else {
                                Alert.alert('Error', 'Failed to upload the images');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Something went wrong while uploading images or updating the event');
                            console.error(error);
                            if (error.response) {
                                console.error('Response:', error.response.data);
                            }
                        }
                    }
                }
            );
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while fetching event details');
            console.error(error);
        }
    };
    
    


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.container}>
                <View style={styles.imageWrapper}>               
                    <Image source={{uri:event.backgroundImage}} resizeMode="cover" style={styles.coverImage} />                 
                    <View style={styles.overlay} />
                    <TouchableOpacity onPress={() => navigation.navigate('Tabs')} style={styles.backIconWrapper}>
                        <Image
                            source={BackArrowButton2}
                            style={styles.backArrowButton2}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {eventHostedByUser && (
                        <TouchableOpacity
                            style={styles.editIconWrapper}
                            onPress={() => navigation.navigate('EditEvent', {
                                eventID: event._id,
                                eventName: event.eventName,
                                location: event.location,
                                startDate: event.startDate,
                                endDate: event.endDate,
                                aboutEvent: event.aboutEvent,

                            })}
                        >
                            <Image source={EditIcon} style={styles.editIcon} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.userCount}>{userCount}</Text>
                    <Image source={UserCountIcon} resizeMode="cover" style={styles.icon} />

                    <Text style={styles.eventName}>{event.eventName}</Text>
                    <View style={styles.statusWrapper}>
                        <Text style={styles.statusText}>{statusText[event.status] || 'Unknown'}</Text>
                    </View>
                </View>
                <View style={styles.tabWrapper}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'details' && styles.activeTab]}
                        onPress={() => setActiveTab('details')}
                    >
                        <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Event Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'media' && styles.activeTab]}
                        onPress={() => setActiveTab('media')}
                    >
                        <Text style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>Media</Text>
                    </TouchableOpacity>
                </View>
                {renderTabContent()}
                {renderBottomBar()}
            </View>


            <Modal
                visible={modalVisible}
                animationType="slide"
                fullscreen={false}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                setRefreshKey={setRefreshKey}
            >
                <View style={styles.modalContainer}>
                    <Animated.View
                        style={[styles.modalContent, { transform: [{ translateY: slideAnim }] },]}
                    >

                        <View style={styles.horizontalLine} />
                        <ScrollView style={{ marginBottom: 40, padding: 5 }}>

                            <View style={{ paddingRight: 45 }}>
                                <CommentsList comments={event.comments} setRefreshKey={setRefreshKey} />
                            </View>
                        </ScrollView>

                        {/* Add comment section */}
                        <View style={styles.bottomBar}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Add a comment"
                                    placeholderTextColor="#575757"
                                    value={comment}
                                    onChangeText={setComment}
                                />
                                {loading ? (
                                    <Text>Loading...</Text>
                                ) : (
                                    <TouchableOpacity onPress={handleAddComment}>
                                        <Image source={SendIcon} style={styles.sendIcon} setRefreshKey={setRefreshKey} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>


                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    horizontalLine: {
        height: 1.5,
        backgroundColor: 'black',
        width: '20%',
        position: 'relative',
        top: 0,
        alignSelf: 'center',
        marginBottom: 15
    },
    container: {
        flex: 1,
    },
    backArrowButton2: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 25,
        height: 25,
    },
    modalContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: -1,
    },
    modalContent: {
        position: 'absolute',
        bottom: -60,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: '70%',
        padding: 20,
        paddingTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 0,
        zIndex: -1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentText: {
        fontSize: 14,
        marginBottom: 8,
    },
    closeModalButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeModalText: {
        fontSize: 16,
        color: '#00B894',
        fontWeight: '600',
    },
    icon: {
        position: 'absolute',
        bottom: '52%',
        left: '5%',
        width: '3%',
        height: '6%',
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: height * 0.3,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.45,
    },
    userCount: {
        position: 'absolute',
        bottom: '52%',
        left: '9%',
        color: 'white',
        fontSize: 11,
        fontWeight: '400',
    },
    eventName: {
        position: 'absolute',
        bottom: '22%',
        left: '5%',
        color: 'white',
        fontSize: 17,
        paddingRight: 20,
        fontWeight: '500',
    },
    statusWrapper: {
        position: 'absolute',
        bottom: '3%',
        left: '5%',
        backgroundColor: '#FFFFFF',
        width: '20%',
        height: '10%',
        paddingHorizontal: 5,
        borderRadius: 60,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        marginBottom: 10,
        marginTop: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        color: '#00B894',
        fontSize: 12,
        fontWeight: '800',
    },
    tabWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    tab: {
        width: '50%',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#00B894',
    },
    tabText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#00B894',
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 5,
        zIndex: 20,
    },

    imInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#00B894',
        borderRadius: 30,
        width: '40%',
        marginRight: '15'
    },
    imInText: {
        color: '#00B894',
        fontSize: 14,
        marginRight: 3,
        fontWeight: '500'
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#00B894',
        borderRadius: 30,
        marginRight: '15'
    },
    shareText: {
        color: '#000',
        fontSize: 14,
        marginRight: 3,
        fontWeight: '500'
    },
    shareIcon: {
        marginTop: 2,
        width: 12,
        height: 12,
    },
    imInIcon: {
        width: 9,
        height: 12,
    },
    commentIcon: {
        width: 30,
        height: 30,
    },
    deleteIcon: {
        width: 12,
        height: 12,
    },
    uploadButton1: {
        backgroundColor: '#00B894',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 30,
        width: '85%',
    },
    uploadButton2: {
        backgroundColor: '#00B894',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 30,
        width: '55%',
        marginRight: '3%'
    },
    deleteButton: {
        backgroundColor: '#DA4F4F',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 30,
        width: '25%',
    },
    uploadText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    deleteText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 25,
        height: 25,
    },
    editIconWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    backIconWrapper: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '70%',
        paddingHorizontal: 0,
        backgroundColor: '#ffffff',
        borderColor: 'rgba(87, 87, 87, 0.3)',
        borderWidth: 1,
        paddingVertical: 5,
        borderRadius: 30,
        zIndex: 0,
    },
    commentInput: {
        width: '80%',
        height: 40,
        paddingRight: 5,
        borderRadius: 20,
        fontSize: 14,
        color: '#333',
    },
    sendIcon: {
        width: 16,
        height: 16,
    },
    disabledButton: {
        borderColor: '#00b893',
        opacity: 0.5,
    },

});


export default Event_page;