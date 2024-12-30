import { View, Text, StyleSheet, Image, useWindowDimensions, Pressable } from 'react-native'
import React from 'react'

export default function SlideItem({ item }) {

    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width }]}>
            <Image source={item.image} style={[styles.image, { width, resizeMode: 'cover'}]} />
            <View>
            <Text style={{ fontSize: 24, fontWeight: 700, marginTop: 15, textAlign: 'center'}}>{item.big_title}</Text>
                <Text style={{ fontSize: 13 }}>{item.small_title}</Text>         
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
    },
    image: {
        width: 500,
        height: 300,
        justifyContent: 'center'
    }

})