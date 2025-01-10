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


const { height } = Dimensions.get('window');

const Event_page = ({ navigation, route }) => {
    const [activeTab, setActiveTab] = useState('details');
    const eventHostedByUser = route.params?.hostedByUser;
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState('');
    const [no_of_UploadedImages, set_No_of_UploadedImages] = useState(4);
    const [selectImage, setSelectImage] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);
    const [refreshMediaTab, setRefreshMediaTab] = useState(false);
    //const eventID = '677f536a0f5d27206ba283d1'
    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2Q1ZDZhNTg5MjY5YWI4OTA1OGRiMiIsImlhdCI6MTczNjQ3OTI3NiwiZXhwIjoxNzM2NTY1Njc2fQ.kUa6pxJH81aJ_u4J5t2NYyi79iEmz0-7MLl0pNRXneQ'
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [isAttending, setIsAttending] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingAttend, setLoadingAttend] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Animated value for modal slide
    const slideAnim = useState(new Animated.Value(0))[0];

    // const handleSelectImage = (state) => {
    //     setSelectImage(state);
    //     console.log('Select Mode:', state ? 'Enabled' : 'Disabled');
    // };

    const handleSelectImage = (images) => {
        setSelectImage(true);
        console.log(images[0]);
        setSelectedImages((prevSelectedImages) => [
            ...prevSelectedImages,
            ...(Array.isArray(images) ? images : []),  // Fallback to an empty array if not an array
        ]);
        console.log('Selected images:', images);
    };


    const { id, hostedByUser } = route.params;

    console.log('eventHostedByUser', id, hostedByUser);

    const statusText = {
        0: 'Hosting',
        1: 'Upcoming',
        2: 'Past',
    };

    useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
            try {
                // Fetch user data
                const userData = await getLoggedUser();
                if (isMounted) {
                    setUser(userData);
                    console.log('User:', userData);
                }
    
                // Fetch event data
                const eventData = await getEventById(id);
                if (isMounted) {
                    setEvent(eventData);
                }
    
                // Check if the user is attending the event
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
    



    const formatEventDates = (startDate, endDate) => {
        const formattedStartDate = format(new Date(startDate), "yyyy MMMM 'from' h a"); // Escaped 'from'
        const formattedEndDate = format(new Date(endDate), "h a"); // 12 PM
        
        return `${formattedStartDate} to ${formattedEndDate}`;
    };
    
    const startDate = "2025-02-03T09:00:00.000Z";
    const endDate = "2025-02-03T12:00:00.000Z";
    
    console.log(formatEventDates(startDate, endDate));
    
    

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
            return <Media_tab eventHostedByUser={eventHostedByUser} no_of_UploadedImages={no_of_UploadedImages} onSelectImage={handleSelectImage} />;
        }
    };


    const handleDeleteSelectedImages = async () => {
        let allImages = [];
    
        const getEventImagesById = async (eventID) => {
            try {
                const response = await axios.get(
                    `http://10.0.3.2:5001/api/events/${eventID}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
    
                const data = response.data;
    
                // Filter out selected images
                allImages = data.images.filter((image) => !selectedImages.includes(image));
    
                console.log('Filtered Images:', allImages);
            } catch (error) {
                console.error(
                    'Error fetching event:',
                    error.response ? error.response.data : error.message
                );
            }
        };
    
        const deleteImages = async (eventID) => {
            try {
                await axios.put(
                    `http://10.0.3.2:5001/api/events/update`,
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
    
                console.log('Updated Images:', allImages);
            } catch (error) {
                console.error(
                    'Error updating event:',
                    error.response ? error.response.data : error.message
                );
            }
        };
    
        await getEventImagesById(eventID);
        await deleteImages(eventID);
    
        // Trigger media tab refresh
        setRefreshMediaTab(prev => !prev);
    };
    

    const pickImages = async (eventID) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.5,
                selectionLimit: 5, // Limit to 5 images
            },
            async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                    // Prepare images for upload
                    const images = response.assets.map((asset, index) => {
                        // Extract the correct file extension
                        const fileName = asset.fileName || `image_${Date.now()}`;
                        const fileType = asset.type;
                        const fileExtension = fileType.split('/')[1]; // Get file extension from MIME type

                        // Ensure fileName includes extension
                        return {
                            uri: asset.uri,
                            fileName: `${fileName}`,
                            type: fileType,
                        };
                    });

                    const formData = new FormData();

                    images.forEach((image, index) => {
                        formData.append('images', {
                            uri: image.uri,
                            name: image.fileName, // Ensure fileName includes extension
                            type: image.type,
                        });
                    });

                    try {
                        // Upload images
                        const uploadResponse = await axios.post(
                            'http://10.0.3.2:5001/api/events/upload-images',
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (uploadResponse.status === 200 && uploadResponse.data.files?.length > 0) {
                            // Extract the URLs of the uploaded images
                            const uploadedImageUrls = uploadResponse.data.files.map((file) => file.url);

                            Alert.alert('Success', 'Images uploaded successfully');

                            // Update event details with uploaded image URLs
                            const formattedEventDetails = {
                                eventId: eventID, // Include the eventId explicitly
                                images: uploadedImageUrls, // Add the uploaded image URLs
                            };

                            const updateResponse = await axios.put(
                                'http://10.0.3.2:5001/api/events/update',
                                formattedEventDetails,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );

                            if (updateResponse.status === 200) {
                                Alert.alert('Success', 'Event updated successfully with images');
                                // Refresh media tab after successful upload
                                setRefreshMediaTab((prev) => !prev); 
                            } else {
                                Alert.alert('Error', 'Failed to update the event');
                            }
                        } else {
                            Alert.alert('Error', 'Failed to upload the images');
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Something went wrong while uploading images or updating the event');
                        console.error(error); // Log the error for debugging
                        const { response } = error;
                        if (response) {
                            console.error('Response:', response.data);
                        }
                    }
                }
            }
        );
        
        
    };




    const renderBottomBar = () => {
        if (activeTab === 'media') {
            return (
                <View style={styles.bottomBar}>
                    {!selectImage && eventHostedByUser && (
                        <TouchableOpacity style={styles.uploadButton1} onPress={() => pickImages(eventID)}>
                            <Text style={styles.uploadText}>Upload</Text>
                        </TouchableOpacity>
                    )}

                    {selectImage && eventHostedByUser && (
                        <>

                            <TouchableOpacity style={styles.uploadButton2} onPress={() => pickImages(eventID)}>

                            <TouchableOpacity style={styles.uploadButton2} onPress={pickImage}>

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
                        style={[styles.imInButton, isAttending && { borderColor: '#00B894', backgroundColor: '#00B894' }]}
                        onPress={handleAddUserToEvent}
                        disabled={loading} // Disable while loading
                    >
                        <Text style={[styles.imInText, isAttending && { color: 'white' }]}>
                            {isAttending ? 'You are in!' : "I'm in!"}
                        </Text>
                        <Image source={ImInIcon} style={styles.imInIcon} />
                    </TouchableOpacity>)}
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

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.container}>
                <View style={styles.imageWrapper}>


                    <Image source={{ uri: event.images[0] }} resizeMode="cover" style={styles.coverImage} />
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
                            onPress={() => navigation.navigate('EditEvent')}
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
                                    <Image source={SendIcon} style={styles.sendIcon} setRefreshKey={setRefreshKey}/>
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

});


export default Event_page;

