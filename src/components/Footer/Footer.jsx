import { View, Text, StyleSheet } from "react-native"; // Corrected import

const Footer = () => {
    const getYear = () => {
        const date = new Date();
        const year = date.getFullYear();
        return year;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Copyright © {getYear()} FileGuard All rights reserved
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    text: {
        padding:20,
        fontSize: 16,
        color: '#333',
    },
});

export default Footer;
