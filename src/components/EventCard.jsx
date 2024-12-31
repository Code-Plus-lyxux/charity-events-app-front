import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from 'react';
import icons from '../constants/icons';

const EventCard = ({ event }) => {
  return (
    <View style={styles.card}>
      <Pressable onPress={() => console.log('Event Pressed')} style={styles.container}>

        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.locationDateContainer}>

          <View style={styles.locationContainer}>
            <Image source={icons.LocationIcon} style={styles.icon} />
            <Text style={styles.location}>{event.location}</Text>
          </View>

          <View style={styles.dateContainer}>
            <Image source={icons.DateIcon} style={styles.icon} />
            <Text style={styles.date}>{event.date}</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={event.image} style={styles.image} resizeMode="cover" />
          <View style={styles.handContainer}>
          <Pressable onPress={() => console.log('Register Pressed')}>
            <Image
              style={styles.icon}
              source={icons.Hand}
              resizeMode="contain"
            />
          </Pressable>
        </View>
        </View>

        <Text style={styles.description}>{event.description}</Text>
      </Pressable>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    width: '95%',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 10,
    color: '#555',
  },
  date: {
    fontSize: 10,
    color: '#888',
  },
  imageContainer: {
    width: 308,
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 10,
    color: '#333',
    marginTop: 10,
  },
  icon: {
    marginRight: 3,
  },
  handContainer: {
    position: 'absolute',
    top: 10, 
    right: 10, 
    zIndex: 10,
  }
});
