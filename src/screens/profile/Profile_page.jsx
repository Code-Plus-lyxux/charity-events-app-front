import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import user_image from '../../assets/images/user_image.png';
import edit_icon from '../../assets/images/edit_icon.png';
import BackArrowButton from '../../components/BackArrowButton';
import close_icon from '../../assets/images/close_icon.png';
import { ProfileDetail } from '../../components/ProfileDetail';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
//import ImageCropPicker from 'react-native-image-crop-picker';



const Profile_page = ({ navigation }) => {
    const [name, setName] = useState('Lucifer Barret');
    const [email, setEmail] = useState('lucilebarret@gmail.com');
    const [about, setAbout] = useState('Student');
    const [location, setLocation] = useState('Galle');
    const [phoneNumber, setPhoneNumber] = useState('0714516503');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDetail, setCurrentDetail] = useState({ property: '', value: '' });
    const [newValue, setNewValue] = useState('');
    const [imageUri, setImageUri] = useState(null);// Set default image

    const submitProfileDetails = async () => {
        const formattedProfileDetails = {
            name,
            email,
            about,
            location,
            phoneNumber,
        };
    
        try {
            const response = await axios.put(
                'http://10.0.3.2:5001/api/user/profile', // Update the endpoint as needed
                formattedProfileDetails,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_JWT_TOKEN', // Replace with a valid token
                    },
                }
            );
            console.log('Profile updated:', response.data);
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
        }
    };

    // Animated value for modal slide
    const slideAnim = useState(new Animated.Value(0))[0];

    // Open Modal and Set Current Detail
    const handleProfileDetailPress = (property, value) => {
        setCurrentDetail({ property, value });
        setNewValue(value);
        setIsModalVisible(true);
        submitProfileDetails();
    };

    // Save Updated Detail
    const handleSave = () => {
        switch (currentDetail.property) {
            case 'Name':
                setName(newValue);
                break;
            case 'Email':
                setEmail(newValue);
                break;
            case 'About':
                setAbout(newValue);
                break;
            case 'Location':
                setLocation(newValue);
                break;
            case 'Phone Number':
                setPhoneNumber(newValue);
                break;
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
    const handleEditImage = () => {
        ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5,
        }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setImageUri(response.assets[0].uri);
            }
        });
    };
    
    

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%', backgroundColor: 'white' }}>
                <BackArrowButton ReturnPage="Tabs" />
                <View style={styles.container}>
                    <Text style={styles.TitleText}>Profile</Text>
                    <Image 
                        source={imageUri ? { uri: imageUri } : user_image} 
                        style={styles.circularImg} 
                        />
                    <TouchableOpacity onPress={handleEditImage}>
                        <Image source={edit_icon} resizeMode="contain" style={styles.iconStyle} />
                    </TouchableOpacity>

                    <Text style={styles.NameText}>{name}</Text>
                    <Text style={styles.EmailText}>{email}</Text>
                    <ProfileDetail property="Name" value={name} onPress={() => handleProfileDetailPress('Name', name)} />
                    <ProfileDetail property="About" value={about} onPress={() => handleProfileDetailPress('About', about)} />
                    <ProfileDetail property="Location" value={location} onPress={() => handleProfileDetailPress('Location', location)} />
                    <ProfileDetail property="Phone Number" value={phoneNumber} onPress={() => handleProfileDetailPress('Phone Number', phoneNumber)} />

                    <TouchableOpacity style={styles.Logout_Button} onPress={() => navigation.navigate('ResetPassword')}>
                        <Text style={styles.buttonTextLogout}>LOGOUT</Text>
                    </TouchableOpacity>
                </View>

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
    NameText: {
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
        width: '55%',
        height: 45,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#DA4F4F',
        borderWidth: 1,
        marginVertical: 10,
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
        width:180,
        height:180,
        borderRadius:90,
        marginBottom:10,
        marginTop:10
    }
});

export default Profile_page;
