import React, { useState,useEffect } from 'react';
import {
    Image,
    Text,
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';

import TickCircleIcon from '../../assets/images/tick-circle.png';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../constants/api';

const Media_tab = ({ eventHostedByUser,eventID, onSelectImage ,refreshMediaTab}) => {
    
    
    // const uploadedImages = [
    //     require('../../assets/images/uploadImages/image1.png'),
    //     require('../../assets/images/uploadImages/image2.png'),
    //     require('../../assets/images/uploadImages/image3.png'),
    //     require('../../assets/images/uploadImages/image4.png'),
    //     require('../../assets/images/uploadImages/image5.png'),
    //     require('../../assets/images/uploadImages/image6.png'),
    // ];
    
    
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectButtonStatus, setSelectButtonStatus] = useState('select');
    const [selectButtonPressed, setSelectButtonPressed] = useState(false);
    const [no_of_UploadedImages, setNoOfUploadedImages] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (eventID) {
            console.log("inside use effect---------------------")
            getEventImagesById(eventID);
        }
    }, [eventID]);

    useEffect(() => {
        // Fetch new media or handle refresh logic here
        console.log('Media tab refreshed');
        getEventImagesById(eventID);
        // Your logic to refresh media content
    }, [refreshMediaTab]);


    const getEventImagesById = async (eventID) => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
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
          setUploadedImages(data.images);
          setLoading(false);
          console.log('response:',data.images) // Update state with fetched images
          console.log('uploaded images:',uploadedImages)
          setNoOfUploadedImages(data.images.length); // Update count of uploaded images
          console.log('no of uploaded images:',no_of_UploadedImages)
          console.log('Fetched event:', data);
        } catch (error) {
          console.error(
            'Error fetching event:',
            error.response ? error.response.data : error.message
          );
        }finally {
            setLoading(false);
        }
      };
      

    const toggleImageSelection = (url) => {
        setSelectedImages((prevSelectedImages) => {
            const updatedSelectedImages = prevSelectedImages.includes(url)
                ? prevSelectedImages.filter((i) => i !== url) 
                : [...prevSelectedImages, url]; 
    
            // Call onSelectImage with the updated state length immediately
            onSelectImage(updatedSelectedImages); 
    
            return updatedSelectedImages;
        });
    };
    const handleSelectButtonPress = () => {
        setSelectButtonPressed((prev) => {
            const newStatus = prev ? 'select' : 'cancel'; // Toggle button status
            setSelectButtonStatus(newStatus);
    
            // Deselect all images when 'cancel' is pressed
            if (newStatus === 'select') {
                setSelectedImages([]);
                onSelectImage(false);
            }
    
            return !prev;
        });
    };

    // const deleteSelectedImages = () => {
    //     // Perform deletion logic here
    //     console.log('Deleting selected images:', selectedImages);
    //     // Example: Remove selected images from uploadedImages
    //     setUploadedImages((prevImages) =>
    //         prevImages.filter((image) => !selectedImages.includes(image))
    //     );
    //     setSelectedImages([]);
    //     onDeleteSelectedImages();
    // };

    return (
        <ScrollView>
            <View>
                {eventHostedByUser ? (
                    uploadedImages.length === 0 ? (
                        <View style={styles.mediaContainer}>
                            <Text style={styles.detailTitle}>Upload Media</Text>
                            <Text style={styles.mediaText}>
                                Upload photos and videos here to share your amazing moments with others.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.selectButtonContainer}>
                                <Text
                                    onPress={handleSelectButtonPress}
                                    style={selectButtonPressed ? styles.cancelText : styles.selectText}
                                >
                                    {selectButtonPressed ? 'Cancel' : 'Select'}
                                </Text>
                            </TouchableOpacity>
                            {loading ? (
                                <Text>Loading images...</Text>
                            ) : (
                                <View style={styles.collageContainer}>
                                    {uploadedImages.map((image, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                if (selectButtonPressed) {
                                                    toggleImageSelection(image);
                                                }
                                            }}
                                            activeOpacity={selectButtonPressed ? 0.7 : 1}
                                            style={styles.imageWrapper}
                                        >
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.uploadedImage}
                                                resizeMode="cover"
                                            />
                                            {selectButtonPressed && selectedImages.includes(image) && (
                                                <Image source={TickCircleIcon} style={styles.tickIcon} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </>
                    )
                ) : (
                    <Text style={styles.mediaText}>No media to show</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mediaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    mediaText: {
        paddingHorizontal: '15%',
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },
    collageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 10,
    },
    imageWrapper: {
        width: '30%',
        margin: '1.5%',
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
        
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
    },
    tickIcon: {
        position: 'absolute',
        top: 5,
        left: 5,
        width: 20,
        height: 20,
    },
    selectButtonContainer: {
        paddingHorizontal: '6%',
        width: '24%',
        alignSelf:'flex-end'
    },
    selectText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00B894',
        textAlign: 'right',
    },
    cancelText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
        textAlign: 'right',
    },
});

export default Media_tab;
