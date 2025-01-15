import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Alert } from 'react-native';
import Logo from '../../assets/images/givewell_logo.png';
import EyeIcon from '../../assets/images/eye_icon.png';
import EmailIcon from '../../assets/images/email_icon.png';
import LockIcon from '../../assets/images/lock_icon.png';
import EyeOffIcon from '../../assets/images//hide_password.png';
import GoogleIcon from '../../assets/images//google.png';
import Line from '../../assets/images//Line1.png';
import { loginUser } from '../../api/auth';



const Login = ({ navigation }) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert('Please fill out all fields');
            return;
        }
    
        if (!validateEmail(email)) {
            Alert.alert('Invalid email address');
            return;
        }
    
        try {
            const credentials = { email, password };
            console.log(credentials);
            const response = await loginUser(credentials);
            console.log(response.data);
    
            if (!response) {
                Alert.alert('Login failed. Please try again.');
                return;
            } else {
            navigation.navigate('Tabs');
            }
        } catch (error) {
            // Display an alert with the error message from the server or fallback message
            Alert.alert(error.message || 'An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };
    

    return (
        <SafeAreaView >
            <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%', backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={Logo}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
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
                    <View style={styles.inputWrapper}>
                        <Image
                            source={LockIcon}
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={!passwordVisible}
                            autoCapitalize="none"
                        />
                        <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={styles.iconContainer}>
                            <Image
                                source={passwordVisible ? EyeIcon : EyeOffIcon}
                                style={styles.icon}
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.forgot_password} onPress={() => navigation.navigate('EmailVerification')} >Forgot Password?</Text>

                    <TouchableOpacity style={styles.Login_Button} onPress={handleLogin} >
                        <Text style={styles.buttonTextLogin}>LOGIN</Text>
                    </TouchableOpacity>

                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flex: 1, height: .7,marginLeft: 10, backgroundColor: '#000' }} />
                        <Text style={[styles.no_account, { marginHorizontal: 10 }]}>OR</Text>
                        <View style={{ flex: 1, height: .7, marginRight: 10, backgroundColor: '#000' }} />
                    </View> */}

                    {/* <TouchableOpacity style={styles.Google_Sign_In_Button}>
                            <Image
                                source={GoogleIcon}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonTextGoogle}>Sign in with Google</Text>
                    </TouchableOpacity> */}

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.no_account}>Don’t have an account ? </Text>
                        <Text onPress={() => navigation.navigate('SignUp')} style={styles.sign_up}>Sign up</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 30,
        backgroundColor: 'white', 
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    iconContainer: {
        padding: 3,
    },
    logoContainer: {
        width: '100%',
        height: '100%', 
        marginBottom: 20,
        marginTop: 60,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonTextLogin: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    Login_Button: {
        backgroundColor: '#00B894',
        width: '95%',
        height: 45,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#00B894',
        borderWidth: 1,
        marginBottom: 10,
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
    forgot_password: {
        width: '100%',
        textAlign: 'right',
        fontWeight: '500',
        fontSize: 11,
        color: '#00B894',
        marginTop: 5,
        marginBottom: 20,
    },
    no_account: {
        fontSize: 12,
        color: '#000',
    },
    sign_up: {
        fontSize: 12,
        color: '#00B894',
        textDecorationLine: 'underline',
    },
});






export default Login;