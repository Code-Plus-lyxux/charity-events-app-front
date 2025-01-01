import React from 'react';
import { View,Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

export const LocationDetail = ({ property, value,onPress}) => {
  return (
    <Pressable style={styles.inputWrapper} onPress={onPress}>
      <Text style={value?styles.locationText:styles.PlaceholderText}>{value? value:property}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '95%',
    height: 38,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
  },
  WrapperValueText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'justify',
  },
  PlaceholderText:{
    color:"#575757"
  },
  locationText:{
    color: 'rgba(0, 0, 0, 1)',
  }

});
