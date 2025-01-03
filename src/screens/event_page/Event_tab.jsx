import React from 'react'
import {
    Image,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
} from 'react-native';
import LocationIcon from '../../assets/images/location_icon.png';
import CalenderIcon from '../../assets/images/calendar.png';

const Event_tab = ({dateTime,location,aboutEvent}) => {
  return (
    <ScrollView>
        <View style={styles.detailsContainer}>
            
                <View style={{ flexDirection: 'row' }}>
                    <Image source={CalenderIcon} resizeMode="cover" style={styles.event_details_icon} />
                    <Text style={styles.detailText}>{dateTime}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={LocationIcon} resizeMode="cover" style={styles.event_details_icon} />
                    <Text style={styles.detailText}>{location}</Text>
                </View>

                <Text style={styles.detailTitle}>About Event:</Text>
                <Text style={styles.aboutDetailText}>{aboutEvent}</Text>
            
        </View>
    </ScrollView>
  )
}

export default Event_tab

const styles = StyleSheet.create({
    event_details_icon: {
        width: '5%',
        height: '60%',
        marginRight: '2%',
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 5,
    },
    detailText: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
        textAlign: 'justify',
    },
    detailsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    aboutDetailText:{
        fontSize: 14,
        color: 'gray',
        marginBottom: '30%',
        textAlign: 'justify',
    },
    

})