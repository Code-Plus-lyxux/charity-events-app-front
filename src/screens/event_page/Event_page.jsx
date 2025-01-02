import React, { useState,useEffect } from 'react';
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
    Animated
} from 'react-native';
import Event_Cover_Image from '../../assets/images/event-cover.png';
import UserCountIcon from '../../assets/images/user_count_icon.png';
import LocationIcon from '../../assets/images/location_icon.png';
import CalenderIcon from '../../assets/images/calendar.png';
import ShareIcon from '../../assets/images/export.png';
import ImInIcon from '../../assets/images/im_in_icon.png';
import CommentIcon from '../../assets/images/comment_icon.png';
import GalleryImportIcon from '../../assets/images/gallery-import-2.png';
import EditIcon from '../../assets/images/edit_icon_2.png';

const { height } = Dimensions.get('window');

const Event_page = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [userCount] = useState('500');
    const [eventHostedByUser, setEventHostedByUser] = useState(true);
    const [eventName] = useState('Support Animal Welfare: Spend a Day Volunteering at the Local Shelter and Make a Difference');
    const [dateTime] = useState('21 December 2024 at 9am to 4pm');
    const [location] = useState('Haven Paws Animal Shelter, Kandy');
    const [aboutEvent] = useState(
        `Join us for a meaningful day at the local animal shelter in Kandy, where you’ll have the opportunity to support animal welfare by directly engaging with the animals in need. Spend time feeding, cleaning, and playing with the sheltered animals to help them feel loved and cared for. Your efforts will contribute to the overall well-being of the animals and help raise awareness about the importance of adoption.`
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState('');

        // Animated value for modal slide
        const slideAnim = useState(new Animated.Value(0))[0];
    
    
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


    const renderTabContent = () => {
        if (activeTab === 'details') {
            return (
                <View style={styles.detailsContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={CalenderIcon} resizeMode="cover" style={styles.event_details_icon} />
                        <Text style={styles.detailText}>{dateTime}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={LocationIcon} resizeMode="cover" style={styles.event_details_icon} />
                        <Text style={styles.detailText}>{location}</Text>
                    </View>

                    <Text style={styles.detailTitle}>About Event:</Text>
                    <Text style={styles.detailText}>{aboutEvent}</Text>
                </View>
            );
        } else if (activeTab === 'media') {
            return (
                <View style={styles.mediaContainer}>
                    {eventHostedByUser ? (
                        <>
                            <Image source={GalleryImportIcon} style={[styles.commentIcon, { marginTop: '15%' }]} />
                            <Text style={styles.detailTitle}>Upload Media</Text>
                            <Text style={styles.mediaText}>Upload photos and videos here to share your amazing moments with others.</Text>
                        </>
                    ) : (
                        <Text style={styles.mediaText}>Media content shared by others will appear here.</Text>
                    )}
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <View style={styles.imageWrapper}>
                        <Image source={Event_Cover_Image} resizeMode="cover" style={styles.coverImage} />
                        <View style={styles.overlay} />
                        {eventHostedByUser && (
                            <TouchableOpacity
                                style={styles.editIconWrapper}
                                onPress={() => console.log('Edit event')}
                            >
                                <Image source={EditIcon} style={styles.editIcon} />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.userCount}>{userCount}</Text>
                        <Image source={UserCountIcon} resizeMode="cover" style={styles.icon} />
                        <Text style={styles.eventName}>{eventName}</Text>
                        <View style={styles.statusWrapper}>
                            <Text style={styles.statusText}>Upcoming</Text>
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
                </View>
            </ScrollView>
            <View style={styles.bottomBar}>
                {modalVisible ? (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Add a comment"
                                placeholderTextColor="#575757"
                                value={comment}
                                onChangeText={setComment}
                            />
                            <TouchableOpacity onPress={() => console.log('Send comment', comment)}>
                                <Text style={styles.sendIcon}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                ) : (
                    <>
                        <TouchableOpacity style={styles.imInButton}>
                            <Text style={styles.imInText}>I'm in!</Text>
                            <Image source={ImInIcon} style={styles.imInIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Text style={styles.shareText}>Share</Text>
                            <Image source={ShareIcon} style={styles.shareIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Image source={CommentIcon} style={styles.commentIcon} />
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                <Animated.View
                    style={[ styles.modalContent,{ transform: [{ translateY: slideAnim }] },]}
                    >
                
                    
                        <ScrollView>
                            {/* Display only the first comment */}
                            <Text style={styles.commentText}>User1: Great app!</Text>
                        </ScrollView>
                    
                
                </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    event_details_icon: {
        width: '5%',
        height: '60%',
        marginRight: '2%',
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
    detailsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 5,
    },
    detailText: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
        textAlign: 'justify',
    },
    mediaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mediaText: {
        paddingHorizontal: '15%',
        fontSize: 14,
        color: 'gray',
        textAlign:'center'
    },
    bottomBar: {
        position: 'absolute', // Ensure it's fixed at the bottom
        bottom: 0,  // Stick to the bottom
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
        zIndex: 20,  // Ensure it's above the modal
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
        fontWeight:'500'
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
        fontWeight:'500'
    },
    shareIcon: {
        marginTop:2,
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
    uploadButton: {
        backgroundColor: '#00B894',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 30,
        width: '85%', 
    },
    uploadText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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


    // Comment Input Wrapper styles
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
        paddingVertical: 5,
        borderRadius: 30,
        marginHorizontal: 20,
        elevation: 5, // shadow effect
        zIndex: 25,
    },
    commentInput: {
        width: '80%',
        height: 40,
        backgroundColor: '#ffffff',
        paddingLeft: 10,
        borderRadius: 20,
        fontSize: 14,
        color: '#333',
    },
    sendIcon: {
        color: '#00B894',
        fontSize: 14,
        fontWeight: '500',
    },
    
});


export default Event_page;

