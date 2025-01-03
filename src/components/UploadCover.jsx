import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import GalleryImportIcon from '../assets/images/gallery-import.png';
import UploadIcon from '../assets/images/upload_icon.png';
import DocUpload from '../assets/icons/document-upload.png';

export const UploadCover = ({ source }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
      });
      if (result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  const handleUploadImage = async () => {
    setSelectedImage(null); // Reset the selected image
    await handleImageUpload(); // Trigger image picker again
  };

  // Determine which image to display (either selected or initial source)
  const displayImage = selectedImage || source;

  return (
    <View style={styles.inputWrapper}>
      {/* Display the selected image */}
      {displayImage ? (
        <>
          <Image source={source} style={styles.uploadedImage} resizeMode="cover" />
          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
              <Text style={styles.uploadText}>Upload</Text>
              <Image source={DocUpload} style={styles.docUploadIcon} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // If no image is selected, show the upload UI
        <TouchableOpacity style={styles.container} onPress={handleImageUpload}>
          <Image source={GalleryImportIcon} style={styles.gallery_icon} />
          <Text style={styles.placeholderText}>Select cover photo</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.placeholderText}>Upload</Text>
            <Image source={UploadIcon} style={styles.uploadIcon} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
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
    height: '30%',
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
    opacity: 0.8,
    height: 'auto',
    width: 'auto',
  },
  uploadButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadText: {
    color: 'black',
    fontSize: 12,
  },
  uploadContainer: {
    width: '30%',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  docUploadIcon: {
    position: 'absolute',
    height: 15,
    width: 15,
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
