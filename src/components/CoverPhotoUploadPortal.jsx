import React, { useState } from 'react';
import {View,Text,StyleSheet,Image,TouchableOpacity,Alert,} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import GalleryImportIcon from '../assets/images/gallery-import.png';
import UploadIcon from '../assets/images/upload_icon.png';

export const CoverPhotoUploadPortal = ({ onCoverPhotoChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
      });
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        onCoverPhotoChange(uri); // Notify the parent about the selected image
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  return (
    <View style={styles.inputWrapper}>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.uploadedImage}
          resizeMode="cover"
        />
      )}
      <TouchableOpacity style={styles.container} onPress={handleImageUpload}>
        <Image source={GalleryImportIcon} style={styles.gallery_icon} />
        <Text style={styles.placeholderText}>Select cover photo</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.placeholderText}>Upload</Text>
          <Image source={UploadIcon} style={styles.uploadIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingHorizontal: 30,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  inputWrapper: {
    width: '95%',
    height: '40%',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    marginBottom: 10,
    borderStyle: 'dotted',
    justifyContent: 'center',
    overflow: 'hidden', 
    position: 'relative',
  },
  gallery_icon: {
    maxWidth: 25,
    maxHeight: 25,
    marginBottom: 5,
  },
  uploadIcon: {
    maxWidth: 12,
    maxHeight: 12,
    marginLeft: 2,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#575757',
    textAlign: 'left',
  },
  uploadedImage: {
    ...StyleSheet.absoluteFillObject, 
    opacity: 0.2, 
  },
});
