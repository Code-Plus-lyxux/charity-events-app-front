import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Slides from '../../components/Slides'

const Onboarding = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>
        <Slides navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'column',
  },
})
export default Onboarding;