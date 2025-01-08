import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from 'react';
import icons from '../constants/icons';
import { useNavigation } from '@react-navigation/native';

const EventCard = (props) => {
  const navigation = useNavigation();
  const [isHandBold, setIsHandBold] = useState(false);

  const toggleHandIcon = () => {
    setIsHandBold((prev) => !prev);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options);
  };


  return (
    <View style={styles.card}>
      <View>
  
          <Pressable
            onPress={() => navigation.navigate('EventPage', { id: props.event._id }, { hostedByUser: props.hostedByUser })}
            style={styles.container}
          >

            <Text style={styles.title} numberOfLines={2}>{props.event.eventName}</Text>

            <View style={styles.locationDateContainer}>
              <View style={styles.locationContainer}>
                <Image source={icons.LocationIcon} style={styles.icon} />
                <Text style={styles.location}>{props.event.location}</Text>
              </View>

              <View style={styles.dateContainer}>
                <Image source={icons.DateIcon} style={styles.icon} />
                <Text style={styles.date}>{formatDate(props.event.startDate)}</Text>
              </View>
            </View>

            <View style={styles.imageContainer}>
              {/* Use the first image from the images array */}
              <Image
                source={{ uri: props.event.images[0] }} // Fetch first image from images array
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.handContainer}>
                <Pressable onPress={toggleHandIcon}>
                  <Image
                    style={styles.icon}
                    source={isHandBold ? icons.HandBold : icons.Hand}
                    resizeMode="contain"
                  />

                </Pressable>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{props.event.aboutEvent}</Text>
          </Pressable>
      </View>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    width: '95%',
    height: 300,
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
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
    gap: -5,
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
    flexShrink: 1,
    flexGrow: 1,
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
