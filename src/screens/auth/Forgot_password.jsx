import React,{ useState } from 'react';
import { View, Text,StyleSheet,Image,SafeAreaView,ScrollView,TouchableOpacity,TextInput,Pressable} from 'react-native';
import BackArrowIcon from '../../assets/images/back_arrow_icon.png';


const Forgot_Password = ({ navigation }) => {

        const [emailFirstTwoLetters, setEmailFirstTwoLetters] = useState('ab');
        const [emailStarLetters, setEmailStarLetters] = useState('********');
        const [code1, setCode1] = useState('');
        const [code2, setCode2] = useState('');
        const [code3, setCode3] = useState('');
        const [code4, setCode4] = useState('');

        return (
                    <SafeAreaView>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%',backgroundColor: 'white' }}>
                        <View >
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Image
                                    source={BackArrowIcon}
                                    style={styles.BackIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>  
                        <View style={styles.container}>
                                      
                            <View style={styles.container}>
                                <Text style={styles.TitleText}>Enter Verification Code</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
                                <Text style={styles.sendCodeMessage}>We have sent a code to {emailFirstTwoLetters}{emailStarLetters}@gmail.com </Text>      
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                        placeholder=""
                                        value={code1}
                                        onChangeText={(text) => setCode1(text)}
                                        keyboardType="names"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                        placeholder=""
                                        value={code2}
                                        onChangeText={(text) => setCode2(text)}
                                        keyboardType="names"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View>
                                    <Text> -</Text>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                        placeholder=""
                                        value={code3}
                                        onChangeText={(text) => setCode3(text)}
                                        keyboardType="names"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                        placeholder=""
                                        value={code4}
                                        onChangeText={(text) => setCode4(text)}
                                        keyboardType="names"
                                        autoCapitalize="none"
                                    />
                                </View>
                                
                            </View>
                            <View style={{ alignItems: 'center' ,justifyContent: 'center'}}>
                                    <Text style={styles.no_code}>Didn’t received the code? </Text>
                                    <Text style={styles.resend}>Resend</Text>
                            </View>
                            <Pressable style={styles.Verify_Button} onPress={() => navigation.navigate('ResetPassword')}>
                                   <Text style={styles.buttonTextLogin}>VERIFY NOW</Text>
                            </Pressable>
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
        marginTop: '10'
    },
    sendCodeMessage:{
        fontSize: 11,
        color: '#000',
        marginVertical: '20'
    },
    BackIcon: {
        width: 45,
        height: 45,
        margin:20,
        
    },
    icon: {
        width: 15,
        height: 15,
        marginRight:5,
    },
    iconContainer: {
        padding: 3,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    Verify_Button: {
        backgroundColor:'#00B894',
        width: '95%',
        height: 45,
        paddingHorizontal: 15,
        borderRadius: 60,
        borderColor: '#00B894',
        borderWidth: 1,
        marginBottom: 10,
        marginTop: '70%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextLogin: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    
    Login_Button: {
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
        alignItems: 'center',
        justifyContent:'center',
        padding: 0,
        fontSize: 20,
        color: '#000',
    },
    inputWrapper: {
        width: '11%',
        height: '100%',
        backgroundColor: '#fff',
        marginHorizontal: 5,
        borderRadius: 8,
        borderColor: '#A29494',
        borderWidth: 1,
        marginVertical: 5,
        marginInlineStart:10,
        flexDirection: 'row',
        alignItems: 'center',
    },
   
    no_code:{
        marginTop:20,
        fontSize: 12,
        color: '#000'
    },
    resend:{
        fontSize: 12,
        color: '#00B894',
    }
    
});

export default Forgot_Password