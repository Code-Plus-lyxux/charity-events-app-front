import React, { useState } from 'react';
import {
    Image,
    Text,
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import TickCircleIcon from '../../assets/images/tick-circle.png';

const Media_tab = ({ eventHostedByUser, no_of_UploadedImages, onSelectImage  }) => {
    const uploadedImages = [
        require('../../assets/images/uploadImages/image1.png'),
        require('../../assets/images/uploadImages/image2.png'),
        require('../../assets/images/uploadImages/image3.png'),
        require('../../assets/images/uploadImages/image4.png'),
        require('../../assets/images/uploadImages/image5.png'),
        require('../../assets/images/uploadImages/image6.png'),
    ];
    
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectButtonStatus, setSelectButtonStatus] = useState('select');
    const [selectButtonPressed, setSelectButtonPressed] = useState(false);

    const toggleImageSelection = (index) => {
        setSelectedImages((prevSelectedImages) => {
            const updatedSelectedImages = prevSelectedImages.includes(index)
                ? prevSelectedImages.filter((i) => i !== index) 
                : [...prevSelectedImages, index]; 
    
            // Call onSelectImage with the updated state length immediately
            onSelectImage(updatedSelectedImages.length); 
    
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

    return (
        <ScrollView>
            <View>
                {eventHostedByUser ? (
                    no_of_UploadedImages === 0 ? (
                        <View style={styles.mediaContainer}>
                            <Text style={styles.detailTitle}>Upload Media</Text>
                            <Text style={styles.mediaText}>
                                Upload photos and videos here to share your amazing moments with others.
                            </Text>
                        </View>
                    ) : (
                        <>
                            
                                <TouchableOpacity   
                                    style={styles.selectButtonContainer}
                                >
                                    <Text onPress={handleSelectButtonPress} style={selectButtonPressed ? styles.cancelText : styles.selectText}>
                                        {selectButtonPressed ? 'Cancel' : 'Select'}
                                    </Text>
                                </TouchableOpacity>
                            
                            <View style={styles.collageContainer}>
                                {uploadedImages.slice(0, no_of_UploadedImages).map((image, index) => (
                                    <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (selectButtonPressed) {
                                            toggleImageSelection(index);
                                            onSelectImage(selectedImages.length > 0);
                                            console.log('array length :'+selectedImages.length +'  array:' +selectedImages);
                                        }
                                    }}
                                    activeOpacity={selectButtonPressed ? 0.7 : 1}
                                    style={styles.imageWrapper}
                                >
                                    <Image
                                        source={image}
                                        style={styles.uploadedImage}
                                        resizeMode="cover"
                                    />
                                    {selectButtonPressed && selectedImages.includes(index) && (
                                        <Image
                                            source={TickCircleIcon}
                                            style={styles.tickIcon}
                                        />
                                    )}
                                </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )
                ) : (
                    <Text style={styles.mediaText}>Media content shared by others will appear here.</Text>
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
        width: '22%',
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
