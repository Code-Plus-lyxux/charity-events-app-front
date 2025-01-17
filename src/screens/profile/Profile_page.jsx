import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import user_image from '../../assets/images/user_image.png';
import edit_icon from '../../assets/images/edit_icon.png';
import BackArrowButton from '../../components/BackArrowButton';
import { ProfileDetail } from '../../components/ProfileDetail';
import ProfileDetailModal from '../../components/ProfileDetailModal';
import LocationModal from '../../components/LocationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getLoggedUser } from '../../api/user';
import { API_URL } from '../../constants/api';
import ImageCropPicker from 'react-native-image-crop-picker';

const Profile_page = ({ navigation }) => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    about: '',
    location: '',
    mobile: '',
    imageUri: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState({ property: '', value: '' });
  const [newValue, setNewValue] = useState('');

  const fetchUser = async () => {
    try {
      const userData = await getLoggedUser();
      setUser({
        fullName: userData.fullName,
        email: userData.email,
        about: userData.about,
        location: userData.location,
        mobile: userData.mobile,
        imageUri: `${userData.profileImage}?t=${new Date().getTime()}`,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleProfileDetailPress = (property, value) => {
    setCurrentDetail({ property, value });
    setNewValue(value);
    if (property==='location')
        {
        setIsModal2Visible(true);}
    else{
        setIsModalVisible(true);
    }
  };

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      [currentDetail.property]: newValue,
    };
    setUser(updatedUser);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      await axios.put(
        `${API_URL}/api/user/profile`,
        { [currentDetail.property]: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Profile updated successfully.');
      console.log('Updating property:', currentDetail.property, 'with value:', newValue);

    } catch (error) {
      console.error('Error updating profile:', error.response || error.message);
    }

    setIsModalVisible(false);
  };

  useEffect(() => {
    if (newValue !== '' && currentDetail.property==='location') {
      handleSave();
    }
  }, [newValue]);

  const handleSuggestionSelect = (location) => {
    // Directly update the location in user state
    setUser(prevState => ({
        ...prevState,
        location: location,  // Set the location value from suggestion
    }));
    console.log("location: ",location)
    setCurrentDetail({
        property: 'location',
        value: location,  // Update with the new location
      });
    setNewValue(location);
    handleSave();  // Call handleSave after updating state
};


  const handleEditImage = async () => {
    try {
        const response = await ImageCropPicker.openPicker({
            cropping: true, // Enable cropping
            mediaType: 'photo',
            compressImageQuality: 0.5, // Compress image
        });

        if (!response || !response.path) {
            console.log('No image selected');
            return;
        }

        const imageUri = response.path;
        const fileType = response.mime.split('/')[1]; // Extract file extension from MIME type

        Alert.alert(
            "Update Profile Picture",
            "Are you sure you want to update your profile picture?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        const formData = new FormData();
                        formData.append('profileImage', {
                            uri: imageUri,
                            type: response.mime, // Use MIME type from the library
                            name: `profileImage.${fileType}`, // Maintain correct file extension
                        });

                        const token = await AsyncStorage.getItem('token');
                        if (!token) {
                            console.error('No token found');
                            return;
                        }

                        try {
                            const uploadResponse = await axios.put(
                                `${API_URL}/api/user/profile`,
                                formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                }
                            );

                            const updatedImageUrl = uploadResponse.data.user.profileImage;
                            setUser(prevState => ({
                                ...prevState,
                                imageUri: updatedImageUrl,
                            }));
                            // Refresh user data
                            await fetchUser();
                            console.log('Profile updated successfully:', uploadResponse.data);
                            Alert.alert("Success", "Profile picture updated successfully!");
                        } catch (uploadError) {
                            console.error('Error uploading profile image:', uploadError.response || uploadError);
                            Alert.alert("Error", "Failed to update profile picture.");
                        }
                    },
                },
            ]
        );
    } catch (error) {
        console.error('Error picking image:', error.message || error);
        if (error.code !== 'E_PICKER_CANCELLED') {
            Alert.alert("Error", "Failed to select or crop the image.");
        }
    }
}

  const handleLogout = () => {
    Alert.alert('Logout Confirmation', 'Do you want to logout?', [   
      { text: 'Yes', onPress: () => navigation.navigate('Login') },
      { text: 'No', style: 'cancel' },
    ]);
  };

  



  return (
    <SafeAreaView style={{ minHeight: '100%', backgroundColor: 'white' }}>
      <BackArrowButton ReturnPage="UserProfile" />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.TitleText}>Profile</Text>
          <Image source={user.imageUri && { uri: user.imageUri }} style={styles.circularImg} />
          <TouchableOpacity onPress={handleEditImage}>
            <Image source={edit_icon} style={styles.iconStyle} />
          </TouchableOpacity>
          <Text style={styles.fullNameText}>{user.fullName}</Text>
          <Text style={styles.EmailText}>{user.email}</Text>

          {/* Editable Fields */}
          <ProfileDetail
            property="Name"
            value={user.fullName}
            onPress={() => handleProfileDetailPress('fullName', user.fullName)}
          />
          <ProfileDetail
            property="About"
            value={user.about}
            onPress={() => handleProfileDetailPress('about', user.about)}
          />
          <ProfileDetail
            property="Location"
            value={user.location}
            onPress={() => handleProfileDetailPress('location', user.location)}
          />
          <ProfileDetail
            property="Phone Number"
            value={user.mobile}
            onPress={() => handleProfileDetailPress('mobile', user.mobile)}
          />

          <TouchableOpacity style={styles.Logout_Button} onPress={handleLogout}>
            <Text style={styles.buttonTextLogout}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Editing */}
      <ProfileDetailModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        property={currentDetail.property}
        value={currentDetail.value}
        newValue={newValue}
        setNewValue={setNewValue}
        onSave={handleSave}
      />
      <LocationModal
                visible={isModal2Visible}
                onClose={() => setIsModal2Visible(false)}
                onSelectLocation={handleSuggestionSelect}
        />
    </SafeAreaView>
  );
};

export default Profile_page;



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
    fullNameText: {
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
        maxWidth: '5%',
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

