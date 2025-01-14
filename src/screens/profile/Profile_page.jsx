import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Animated,Alert } from 'react-native';
import user_image from '../../assets/images/user_image.png';
import edit_icon from '../../assets/images/edit_icon.png';
import BackArrowButton from '../../components/BackArrowButton';
import close_icon from '../../assets/images/close_icon.png';
import { ProfileDetail } from '../../components/ProfileDetail';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoggedUser } from '../../api/user';
//import ImageCropPicker from 'react-native-image-crop-picker';



const Profile_page = ({ navigation }) => {
    const [user, setUser] = useState({
        fullname: '',
        email: '',
        about: '',
        location: '',
        mobile: '',
        imageUri:'',
      });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDetail, setCurrentDetail] = useState({ property: '', value: '' });
    const [newValue, setNewValue] = useState('');
   
    
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
        setLoading(true);
        setError(null);

        // Replace `getLoggedUser()` with actual API call
        const userData = await getLoggedUser();

        // Handle successful response
        setUser(prevUser => ({
            ...prevUser,  // Preserve existing fields
            fullname: userData.fullName,
            about: userData.about,
            location: userData.location,
            email: userData.email,
            mobile: userData.mobile,
            imageUri: userData.profileImage,
        }));

        } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    const submitProfileDetails = async (fullName, about, location, mobile) => {
        const formattedProfileDetails = {
            fullName,
            about,
            location,
            mobile
        };
        console.log('Formatted Profile Details:', formattedProfileDetails);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const response = await axios.put(
                'http://10.0.3.2:5001/api/user/profile',
                formattedProfileDetails,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            console.log('Profile updated:', response.data);
        } catch (error) {
            console.error(
                'Error updating profile:', 
                error.response ? error.response.data : error.message
            );
        }
    };
    // Animated value for modal slide
    const slideAnim = useState(new Animated.Value(0))[0];

    // Open Modal and Set Current Detail
    const handleProfileDetailPress = (property, value) => {
        setCurrentDetail({ property, value });
        setNewValue(value);
        setIsModalVisible(true);
        
    };

    // Save Updated Detail
    const handleSave = async () => {
        // Remove password from the update payload
        const { password, ...updatedUserDetails } = {
            ...user,
            [currentDetail.property]: newValue
        };
    
        // Update user state before sending the request
        setUser(updatedUserDetails);
    
        try {
            await submitProfileDetails(
                updatedUserDetails.fullname,
                updatedUserDetails.about,
                updatedUserDetails.location,
                updatedUserDetails.mobile,
                updatedUserDetails.imageUri
            );
            console.log('Updated User Details:', updatedUserDetails)
            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error saving details:', error);
        }
    
        setIsModalVisible(false);
    };
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

    // Open Image Gallery and Crop Image
    const handleEditImage = async () => {
        ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5,
        }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const imageUri = response.assets[0].uri;
    
                // Display alert to confirm upload
                Alert.alert(
                    "Update Profile Picture",
                    "Are you sure you want to update your profile picture?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Yes", onPress: () => uploadProfileImage(imageUri)
                        }
                    ]
                );
            }
        });
    };
    
    const uploadProfileImage = async (imageUri) => {
        const formData = new FormData();
    
        formData.append('profileImage', {
            uri: imageUri,
            type: 'image/jpeg', // Adjust based on file type if necessary
            name: imageUri.split('/').pop(), // Use file name from the path
        });
    
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const response = await axios.put('http://10.0.3.2:5001/api/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            // Update the imageUri in state on success
            const updatedImageUrl = response.data.user.profileImage;

            setUser(prevState => ({
                ...prevState,
                imageUri: updatedImageUrl,
            }));
            console.log('user.imageuri: ',user.imageUri)
            console.log('Profile updated successfully:', response.data);
            Alert.alert("Success", "Profile picture updated successfully!");
        } catch (error) {
            console.error('Error uploading profile image:', error.response || error);
            Alert.alert("Error", "Failed to update profile picture.");
        }
    };
    
    const handleLogout = () => {
        Alert.alert(
            'Logout Confirmation',
            'Do you want to logout from your profile?',
            [
                
                {
                    text: 'Yes',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: 'No',
                    onPress: () => console.log('Logout cancelled'),
                    style: 'cancel',
                },
                
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={{ minHeight: '100%', backgroundColor: 'white' }}>
            <BackArrowButton ReturnPage="UserProfile" />
            <ScrollView showsVerticalScrollIndicator={false} >
                
                {!loading &&
                <View style={styles.container}>
                    <Text style={styles.TitleText}>Profile</Text>
                    <Image 
                        source={user.imageUri ? { uri: `http://10.0.3.2:5001${user.imageUri}` } : user_image} 
                        style={styles.circularImg} 
                        />
                    <TouchableOpacity onPress={handleEditImage}>
                        <Image source={edit_icon} resizeMode="contain" style={styles.iconStyle} />
                    </TouchableOpacity>

                    <Text style={styles.fullnameText}>{user.fullname}</Text>
                    <Text style={styles.EmailText}>{user.email}</Text>
                    <ProfileDetail property="Name" value={user.fullname} onPress={() => handleProfileDetailPress('fullname', user.fullname)} />
                    <ProfileDetail property="About" value={user.about} onPress={() => handleProfileDetailPress('about', user.about)} />
                    <ProfileDetail property="Location" value={user.location} onPress={() => handleProfileDetailPress('location', user.location)} />
                    <ProfileDetail property="Phone Number" value={user.mobile} onPress={() => handleProfileDetailPress('mobile', user.mobile)} />

                    <TouchableOpacity style={styles.Logout_Button} onPress={handleLogout}>
                        <Text style={styles.buttonTextLogout}>LOGOUT</Text>
                    </TouchableOpacity>
                </View>}

                {/* Modal for Editing Details */}
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                { transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            <TouchableOpacity style={styles.headerContainer} onPress={() => setIsModalVisible(false)}>
                                <Image source={close_icon} resizeMode="contain" style={styles.closeIconStyle} />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.modalInput}
                                value={newValue}
                                onChangeText={(text) => setNewValue(text)}
                                placeholder={`Enter new ${currentDetail.property ? currentDetail.property.toLowerCase() : ''}`}
                            />
                            <TouchableOpacity style={styles.Save_Details_Button} onPress={handleSave}>
                                <Text style={styles.buttonTextLogout}>SAVE DETAILS</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingHorizontal: 30,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TitleText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
    },
    fullnameText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
    EmailText: {
        fontSize: 11,
        fontWeight: '300',
        color: '#000',
        marginBottom: '5%',
    },
    imageStyle: {
        maxWidth: '90%',
        maxHeight: '20%',
    },
    iconStyle: {
        maxWidth: '60%',
        maxHeight: '60%',
    },
    closeIconStyle: {
        maxWidth: '70%',
        maxHeight: '70%',         
    },
    Logout_Button: {
        backgroundColor: '#DA4F4F',
        width: '50%',
        height: 35,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#DA4F4F',
        borderWidth: 1,
        marginTop:10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Save_Details_Button: {
        backgroundColor: '#00B894',
        width: '100%',
        height: 45,
        borderRadius: 60,
        borderColor: '#00B894',
        borderWidth: 1,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextLogout: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
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
        backgroundColor: '#fff',
        paddingHorizontal: '10%',
        paddingVertical: '5%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#00B894',
        borderRadius: 50,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    circularImg:{
        width:100,
        height:100,
        borderRadius:90,
        marginBottom:10,
        marginTop:10
    }
});

export default Profile_page;
