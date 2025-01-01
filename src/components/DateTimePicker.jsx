import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalenderIcon from '../assets/images/calendar.png';

export default DateTimePickerComponent = ({ property, value, start_or_end, onChangeDateTime }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date()); 

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setShowTimePicker(true); 
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false); 
        if (selectedTime) {
            setTime(selectedTime);
            const combinedDateTime = new Date(date.setHours(selectedTime.getHours(), selectedTime.getMinutes(), selectedTime.getSeconds()));
            onChangeDateTime(combinedDateTime);
        }
    };

    // Function to format the date and time
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const hours = String(formattedDate.getHours()).padStart(2, '0');
        const minutes = String(formattedDate.getMinutes()).padStart(2, '0');
        const seconds = String(formattedDate.getSeconds()).padStart(2, '0');
        return `${start_or_end}s on ${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
    };

    return (
        <View style={styles.inputWrapper}>
            <View style={styles.row}>
              
                  <Text style={[styles.WrapperValueText, { color: value ? '#000' : '#575757' }]}>
                      {value ? formatDate(value) : property}
                  </Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Image source={CalenderIcon} style={styles.icon} />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}
        </View>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    WrapperValueText: {
        fontSize: 13,
        fontWeight: '400',
        textAlign: 'justify',
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
});
