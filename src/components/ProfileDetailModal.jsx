import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import close_icon from '../assets/images/close_icon.png';

const ProfileDetailModal = ({
  isVisible,
  onClose,
  property,
  newValue,
  setNewValue,
  onSave,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Open Modal Animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close Modal Animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Wait for animations to complete before unmounting the modal
        if (!isVisible) {
          slideAnim.setValue(300); // Reset position after animation (optional)
        }
      });
    }
  }, [isVisible]);
  

  if (!isVisible) return null; // Avoid rendering when not visible

  return (
    <Animated.View
      style={[
        styles.modalOverlay,
        { opacity: overlayAnim },
      ]}
    >
      <Pressable style={styles.overlayTouchable} onPress={onClose} />

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.headerContainer} onPress={onClose}>
          <Image
            source={close_icon}
            resizeMode="contain"
            style={styles.closeIconStyle}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.modalInput}
          value={newValue}
          onChangeText={(text) => setNewValue(text)}
          placeholder={`Enter new ${property ? property.toLowerCase() : ''}`}
        />
        <TouchableOpacity style={styles.saveDetailsButton} onPress={onSave}>
          <Text style={styles.buttonText}>SAVE DETAILS</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlayTouchable: {
    flex: 1,
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
    minHeight: '40%',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#00B894',
    borderRadius: 50,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  saveDetailsButton: {
    backgroundColor: '#00B894',
    width: '100%',
    height: 45,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconStyle: {
    maxWidth: '70%',
    maxHeight: '70%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ProfileDetailModal;
