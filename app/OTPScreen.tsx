import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import WebAlert from '../components/WebAlert';

const OTPScreen = () => {
    const router = useRouter();
    // 1. Retrieve the 'name' parameter from the previous screen
    const { name } = useLocalSearchParams();
    
    const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [loading, setLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const DEMO_OTP = "123456";

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleOTPChange = (text: string, index: number) => {
        const numericText = text.replace(/[^0-9]/g, '');

        const newEnteredOtp = [...enteredOtp];
        newEnteredOtp[index] = numericText;
        setEnteredOtp(newEnteredOtp);

        if (numericText !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = ({ nativeEvent: { key } }: any, index: number) => {
        if (key === 'Backspace' && enteredOtp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        if (loading) return;
        setLoading(true);

        const fullEnteredOtp = enteredOtp.join('').trim();
        console.log("👉 Entered OTP array:", enteredOtp);
        console.log("👉 Joined OTP:", fullEnteredOtp);
        
        if (fullEnteredOtp.length !== 6) {
            setLoading(false);
            if (Platform.OS === 'web') {
                setAlertTitle('Error');
                setAlertMessage('Please enter a complete 6-digit OTP.');
                setShowAlert(true);
            } else {
                Alert.alert('Error', 'Please enter a complete 6-digit OTP.');
            }
            return;
        }

        let title = '';
        let message = '';
        let isSuccess = false;

        if (fullEnteredOtp === DEMO_OTP) {
            title = 'Success';
            message = 'OTP verified successfully!';
            isSuccess = true;
        } else {
            title = 'Error';
            message = 'Invalid OTP. Please try again.';
        }

        if (Platform.OS === 'web') {
            setAlertTitle(title);
            setAlertMessage(message);
            setShowAlert(true);
        } else {
            Alert.alert(title, message, [
                {
                    text: 'OK',
                    onPress: () => {
                        if (isSuccess) {
                            // 2. Pass the name parameter when navigating
                            router.push({
                                pathname: '/MapScreen',
                                params: { name: name }
                            });
                        }
                    },
                },
            ]);
        }
    };

    const handleWebAlertClose = () => {
        setShowAlert(false);
        const fullEnteredOtp = enteredOtp.join('').trim();
        if (fullEnteredOtp === DEMO_OTP) {
            // 3. Pass the name parameter for the web platform as well
            router.push({
                pathname: '/MapScreen',
                params: { name: name }
            });
        }
    };

    const isButtonDisabled = enteredOtp.some(value => value.length === 0) || loading;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.select({ ios: 'padding', android: 'height' })}
            >
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>Demo OTP is 123456</Text>

                <View style={styles.otpContainer}>
                    {enteredOtp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={styles.otpInput}
                            value={value}
                            onChangeText={(text) => handleOTPChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            editable={!loading}
                        />
                    ))}
                </View>

                <TouchableOpacity 
                    style={[styles.verifyButton, isButtonDisabled && styles.verifyButtonDisabled]} 
                    onPress={handleVerify}
                    disabled={isButtonDisabled}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.verifyButtonText}>VERIFY</Text>
                    )}
                </TouchableOpacity>

                {Platform.OS === 'web' && (
                    <WebAlert
                        visible={showAlert}
                        title={alertTitle}
                        message={alertMessage}
                        onOk={handleWebAlertClose}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#666',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
    },
    verifyButton: {
        backgroundColor: '#007bff',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    verifyButtonDisabled: {
        backgroundColor: '#a3a3a3',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OTPScreen;