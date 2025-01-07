import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import icons from "../constants/icons";

const IconToggle = ({ onIconPress }) => {
    const [activeIcon, setActiveIcon] = useState("grid");

    const handlePress = (icon) => {
        setActiveIcon(icon);
        onIconPress(icon); // Pass the clicked icon to the parent component
    };

    return (
        <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handlePress("grid")} style={styles.iconWrapper}>
                <Image
                    source={icons.GridBlack}
                    style={[activeIcon === "grid" ? styles.activeIcon : styles.inactiveIcon]}
                />
                <View style={[styles.underline, activeIcon === "grid" ? styles.activeUnderline : null]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress("hand")} style={styles.iconWrapper}>
                <Image
                    source={icons.HandBlack}
                    style={[activeIcon === "hand" ? styles.activeIcon : styles.inactiveIcon]}
                />
                <View style={[styles.underline, activeIcon === "hand" ? styles.activeUnderline : null]} />
            </TouchableOpacity>
        </View>
    );
};


export default IconToggle;

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        marginBottom: 20,
    },
    iconWrapper: {
        alignItems: "center",
    },
    activeIcon: {
        tintColor: "black",
    },
    inactiveIcon: {
        tintColor: "gray",
    },
    underline: {
        height: 2,
        width: 30, 
        backgroundColor: "transparent",
        marginTop: 5, 
    },
    activeUnderline: {
        backgroundColor: "black",
    },
});
