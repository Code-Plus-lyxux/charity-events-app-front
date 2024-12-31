import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import BackArrowButton from '../../components/BackArrowButton';

const Forgot_Password = ({ navigation }) => {
    const [emailFirstTwoLetters, setEmailFirstTwoLetters] = useState('ab');
    const [emailStarLetters, setEmailStarLetters] = useState('********');
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [code4, setCode4] = useState('');

    const handleCodeChange = (text, setCode, nextInputRef) => {
        if (text.length <= 1) {
            setCode(text);
            if (text.length === 1 && nextInputRef) {
                nextInputRef.current.focus();
            }
        }
    };

    const inputRefs = [
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
    ];

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} style={{ minHeight: '100%', backgroundColor: 'white' }}>
                <BackArrowButton ReturnPage="Login" />
                <View style={styles.container}>
                    <Text style={styles.TitleText}>Enter Verification Code</Text>

                    <Text style={styles.sendCodeMessage}>
                        We have sent a code to {emailFirstTwoLetters}{emailStarLetters}@gmail.com
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                ref={inputRefs[0]}
                                style={styles.input}
                                placeholderTextColor="#888"
                                value={code1}
                                onChangeText={(text) => handleCodeChange(text, setCode1, inputRefs[1])}
                                keyboardType="numeric"
                                maxLength={1}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                ref={inputRefs[1]}
                                style={styles.input}
                                placeholderTextColor="#888"
                                value={code2}
                                onChangeText={(text) => handleCodeChange(text, setCode2, inputRefs[2])}
                                keyboardType="numeric"
                                maxLength={1}
                                autoCapitalize="none"
                            />
                        </View>

                        <Text>-</Text>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                ref={inputRefs[2]}
                                style={styles.input}
                                placeholderTextColor="#888"
                                value={code3}
                                onChangeText={(text) => handleCodeChange(text, setCode3, inputRefs[3])}
                                keyboardType="numeric"
                                maxLength={1}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                ref={inputRefs[3]}
                                style={styles.input}
                                placeholderTextColor="#888"
                                value={code4}
                                onChangeText={(text) => handleCodeChange(text, setCode4, null)}
                                keyboardType="numeric"
                                maxLength={1}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.no_code}>Didn’t received the code? </Text>
                        <Text style={styles.resend}>Resend</Text>
                    </View>

                    <TouchableOpacity style={styles.Verify_Button} onPress={() => navigation.navigate('ResetPassword')}>
                        <Text style={styles.buttonTextLogin}>VERIFY NOW</Text>
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
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    TitleText: {
        fontSize: 20,
        color: '#000',
        marginTop: '10',
    },
    sendCodeMessage: {
        fontSize: 11,
        color: '#000',
        marginVertical: '20',
    },
    input: {
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
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
        marginInlineStart: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    no_code: {
        marginTop: 20,
        fontSize: 12,
        color: '#000',
    },
    resend: {
        fontSize: 12,
        color: '#00B894',
    },
    Verify_Button: {
        backgroundColor: '#00B894',
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
});

export default Forgot_Password;
