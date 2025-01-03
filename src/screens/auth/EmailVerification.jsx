import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity } from 'react-native';
import Logo from '../../assets/images/givewell_logo.png';
import EmailIcon from '../../assets/images/email_icon.png';
import BackArrowButton from '../../components/BackArrowButton';

const EmailVerification = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%', backgroundColor: 'white' }}>
            <BackArrowButton ReturnPage="Login" />
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={Logo}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={{ fontSize: 18, marginBottom: '10%' }}>Enter Email to send verification code</Text>
                    <View style={styles.inputWrapper}>
                        <Image
                            source={EmailIcon}
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#888"
                            placeholder="E-mail"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>



                    <TouchableOpacity style={styles.Submit_Button} onPress={() => navigation.navigate('ForgotPassword')} >
                        <Text style={styles.buttonTextSubmit}>SUBMIT</Text>
                    </TouchableOpacity>






                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingHorizontal: 30,
        height: '100%',
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    logoContainer: {
        width: '80%',
        height: '80%',
        marginBottom: '3%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonTextSubmit: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    Submit_Button: {
        backgroundColor: '#00B894',
        width: '95%',
        height: 45,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#00B894',
        borderWidth: 1,
        marginTop: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },


    input: {
        flex: 1,
        borderRadius: 10,
        padding: 5,
        fontSize: 13,
        color: '#000',
    },
    inputWrapper: {
        width: '95%',
        height: 45,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderRadius: 22,
        borderColor: '#00B894',
        borderWidth: 1,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

});





export default EmailVerification;
