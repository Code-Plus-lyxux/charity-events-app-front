import React,{ useState } from 'react';
import { View, Text,StyleSheet,Image,SafeAreaView,ScrollView,TextInput,Pressable} from 'react-native';
import Logo from '../../assets/images/logo.png';
import EyeIcon from '../../assets/images/eye_icon.png';
import EmailIcon from '../../assets/images/email_icon.png';
import LockIcon from '../../assets/images/lock_icon.png';
import EyeOffIcon from '../../assets/images/hide_password.png';
import GoogleIcon from '../../assets/images/google.png';
import UserIcon from '../../assets/images/user_icon.png';

const Sign_up = ({ navigation }) => {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullName] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%',backgroundColor: 'white' }}>
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
                                source={UserIcon}
                                style={styles.icon}
                            />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#888"
                            placeholder="Full Name"
                            value={fullname}
                            onChangeText={(text) => setFullName(text)}
                            keyboardType="names"
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

                    <View style={styles.inputWrapper}>
                        <Image
                                source={LockIcon}
                                style={styles.icon}
                            />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#888"
                            value={confirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                            secureTextEntry={!confirmPasswordVisible}
                            autoCapitalize="none"
                        />
                        <Pressable onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.iconContainer}>
                            <Image
                                source={confirmPasswordVisible ? EyeIcon : EyeOffIcon}
                                style={styles.icon}
                            />
                        </Pressable>     
                    </View>
                  
                    <Pressable style={styles.Sign_Up_Button}>
                            <Text style={styles.buttonTextLogin}>SIGN UP</Text>
                    </Pressable>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flex: 1, height: .7,marginLeft: 10, backgroundColor: '#000' }} />
                        <Text style={[styles.no_account, { marginHorizontal: 10 }]}>OR</Text>
                        <View style={{ flex: 1, height: .7, marginRight: 10, backgroundColor: '#000' }} />
                    </View>

                    <Pressable style={styles.Google_Sign_In_Button}>
                            <Image
                                source={GoogleIcon}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonTextGoogle}>Sign in with Google</Text>
                    </Pressable>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.have_account}>Already have an account ? </Text>
                        <Text onPress={() => navigation.navigate('Login')} style={styles.login}>Login</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingHorizontal: 30,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        width: 15,
        height: 15,
        marginRight:5,
    },
    iconContainer: {
        padding: 3,
    },
    logoContainer: {
        width: '70%',
        height: '30%',
        marginVertical:20
    },
    image: {
        width: '100%',
        height: '110%',
    },
    buttonTextLogin: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    buttonTextGoogle: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '300',
    },
    Sign_Up_Button: {
        backgroundColor:'#00B894',
        width: '95%',
        height: 45,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#00B894',
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Google_Sign_In_Button: {
        backgroundColor:'#ffffff',
        width: '95%',
        height: 45,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#B3ACAC',
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 10,
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
        marginRight:30,
        marginBottom: 20
    },
    have_account:{
        fontSize: 12,
        color: '#000'
    },
    login:{
        fontSize: 12,
        color: '#00B894',
        textDecorationLine: 'underline',
    }
    
});

export default Sign_up