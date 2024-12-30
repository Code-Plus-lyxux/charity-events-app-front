import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Pressable } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { images } from '../../constants/images.js';
import logo from '../../assets/images/logo.png';

const Welcome = ({ navigation }) => {

  const next = () => {
    navigation.navigate('Onboarding',
      { screen: 'Onboarding' });
  }


  return (
    <SafeAreaView style={styles.mainContainer}>
      <Image
        source={logo}
        style={styles.logoContainer}
      />
      <CustomButton
        title="Get Started"
        containerStyles={{
          width: 250,
          height: 50,
          borderRadius: 35,
        }}
        handlePress={next}
      />
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoContainer: {
    width: 450,
    height: 450,
    marginBottom: 50,
    marginTop: -40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonExplore: {
    borderRadius: 60,
    marginTop: 10,
  },
  pressable: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 60,
    alignItems: 'center',
  },
});