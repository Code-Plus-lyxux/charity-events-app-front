import React from 'react';
import { TextInput, StyleSheet, View, Image } from 'react-native';
import Search from '../assets/icons/search.png';

const SearchBar = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search for events"
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
      />
     </View>
     <Image source={Search} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
  searchContainer: {
    width: '90%',
    height: 40,
    borderRadius: 20,
    borderColor: '#f1f1f1',
    borderWidth: 2,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  input: {
    fontSize: 12,
    color: '#333',
    height: '100%',
    marginTop: 2,
  },
    icon: {
        marginLeft: -30,
    },
});

export default SearchBar;
