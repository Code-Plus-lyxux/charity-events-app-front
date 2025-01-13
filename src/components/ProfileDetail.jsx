import React from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity ,TextInput} from 'react-native';

export const ProfileDetail = ({ property, value,onPress }) => {
    return (
    <TouchableOpacity onPress={onPress} style={styles.inputWrapper}>
        <View style={styles.row}>
            <Text style={styles.WrapperPropertyText}>{property}</Text>
            <Text style={styles.WrapperValueText}>{value}</Text>
        </View>
    </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    inputWrapper: {
      width: '85%',
      height: 35,
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      borderRadius: 22,
      borderColor: 'rgba(0, 0, 0, 0.5)',
      borderWidth: 1,
      marginBottom: 10,
      justifyContent: 'center', 
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
    },
    WrapperPropertyText: {
      fontSize: 16,
      fontWeight: '400',
      color: '#000',
      textAlign: 'left', 
    },
    WrapperValueText: {
      fontSize: 16,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.5)',
      textAlign: 'right', 
    },
  });
  