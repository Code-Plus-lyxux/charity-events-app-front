import React,{ useState } from 'react';
import { View, Text,StyleSheet,Image,SafeAreaView,ScrollView,TouchableOpacity,TextInput,Pressable,Alert} from 'react-native';
import EyeIcon from '../../assets/images/eye_icon.png';
import LockIcon from '../../assets/images/lock_icon.png';
import EyeOffIcon from '../../assets/images/hide_password.png';
import CheckIcon from '../../assets/images/check_icon.png';
import BackArrowButton from '../../components/BackArrowButton';
import { resetPassword } from '../../api/auth';


const Reset_password = ({ navigation }) => {


    const [newPassword, setNewPassword] = useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const email = 'user@gmail.com'


    const handleReset = async (email, newPassword, confirmPassword, navigation) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{8,}$/;
      
        if (newPassword !== confirmPassword) {
          Alert.alert('Error', "Passwords don't match");
          return;
        }
      
        if (!passwordRegex.test(newPassword)) {
          Alert.alert(
            'Error',
            'Password must include:\n' +
              '- At least 8 characters\n' +
              '- At least 1 special character\n' +
              '- At least 1 uppercase letter and 1 lowercase letter'
          );
          return;
        }
      
        try {
          const message = await resetPassword(email, newPassword);
          Alert.alert('Success', message, [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'), // Navigate to Login on success
            },
          ]);
        } catch (error) {
          Alert.alert('Error', error.message); // Show error message
        }
      };
      

    return (
            <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%',backgroundColor: 'white' }}>
                    <BackArrowButton ReturnPage="ForgotPassword"/>
                    <View style={styles.container}>
                        <View style={styles.container}>
                            <Text style={styles.TitleText}>Reset Your Password</Text>
                        </View>
                        <View style={styles.inputWrapper}>
                            <Image
                                    source={LockIcon}
                                    style={styles.icon}
                                />
                            <TextInput
                                style={styles.input}
                                placeholder="New Password"
                                placeholderTextColor="#888"
                                value={newPassword}
                                onChangeText={(text) => setNewPassword(text)}
                                secureTextEntry={!newPasswordVisible}
                                autoCapitalize="none"
                            />
                            <Pressable onPress={() => setNewPasswordVisible(!newPasswordVisible)} style={styles.iconContainer}>
                                <Image
                                    source={newPasswordVisible ? EyeIcon : EyeOffIcon}
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
                        <View style={{ alignItems: 'flex-start', marginBottom: '35%' ,marginTop:'5%'}}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={CheckIcon}
                                    style={styles.CheckIcon} 
                                />
                                <Text style={styles.instructions}>At least 8 characters</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={CheckIcon}
                                    style={styles.CheckIcon} 
                                />
                                <Text style={styles.instructions}>At least 1 special character</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={CheckIcon}
                                    style={styles.CheckIcon} 
                                />
                                <Text style={styles.instructions}>At least 1 uppercase letter and 1 lowercase letter</Text>
                            </View>
                        </View>
                        
                        
                        <TouchableOpacity style={styles.Confirm_Button} onPress={() =>handleReset(email,newPassword,confirmPassword,navigation) }>
                                <Text style={styles.buttonTextConfirm}>CONFIRM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Cancel_Button} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.buttonTextCancel}>CANCEL</Text>
                        </TouchableOpacity>


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
    TitleText:{
        fontSize: 20,
        color: '#000',
        marginTop: '10',
        marginBottom: '20%'
    },
    icon: {
        width: 15,
        height: 15,
        marginRight:5,
    },
    CheckIcon:{
        width: 8,
        height: 8,
        marginTop:5
    },
    iconContainer: {
        padding: 3,
    },
    buttonTextConfirm: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    buttonTextCancel: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '300',
    },
    Confirm_Button: {
        backgroundColor:'#00B894',
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
    Cancel_Button: {
        backgroundColor:'#fff',
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
    BackIcon: {
        width: 45,
        height: 45,
        margin:20,
        
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
    instructions:{
        fontSize: 11,
        color: '#000',
        marginLeft: '5'
    },
    
});

export default Reset_password