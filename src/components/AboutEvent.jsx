import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export const AboutEvent = ({ property, value, onChangeText }) => {
  const inputRef = useRef(null); 

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View style={styles.inputWrapper}>
        <View style={styles.row}>
          <TextInput
            ref={inputRef}
            style={styles.WrapperValueText}
            placeholderTextColor="#575757"
            placeholder={property}
            value={value}
            onChangeText={onChangeText}
            keyboardType="name-phone-pad"
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="top"
            scrollEnabled={true}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '95%',
    height: '100%',
    maxHeight: 170,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  WrapperValueText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'justify',
  },
});
