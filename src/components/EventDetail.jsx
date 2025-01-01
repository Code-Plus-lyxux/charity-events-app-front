import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export const EventDetail = ({ property, value, onChangeText }) => {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.WrapperValueText}
        placeholderTextColor="#575757"
        placeholder={property}
        value={value}
        onChangeText={onChangeText}
        keyboardType="default"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '95%',
    height: 38,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
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
});
