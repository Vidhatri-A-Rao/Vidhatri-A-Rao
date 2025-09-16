import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebAlert from '../components/WebAlert';

// Helper function to generate a list of numbers for days and years
const generateNumbers = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export default function CreateAccountScreen() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [gender, setGender] = useState('Male');
    const [email, setEmail] = useState('');
    const [disability, setDisability] = useState('No');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const router = useRouter();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Day options (1-31)
    const days = generateNumbers(1, 31);

    // Year options (e.g., last 100 years)
    const currentYear = new Date().getFullYear();
    const years = generateNumbers(currentYear - 100, currentYear).reverse();

    const handleDone = () => {
        if (!fullName || !phoneNumber || !email || !selectedDay || !selectedMonth || !selectedYear) {
            setAlertTitle('Incomplete Form');
            setAlertMessage('Please fill out all the fields.');
            setShowAlert(true);
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setAlertTitle('Invalid Email');
            setAlertMessage('Please enter a valid email address.');
            setShowAlert(true);
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Corrected: Removed the leading slash and simplified the navigation
        // Make sure your OTPScreen.tsx is directly in the 'app' directory
        router.push({
            pathname: '/OTPScreen',
            params: {
                name: fullName,
                phoneNumber: phoneNumber,
                otp: otp
            }
        });
    };

    const handleWebAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create a New User Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <View style={styles.dobContainer}>
                <Text style={styles.dobLabel}>Date of Birth:</Text>
                <View style={styles.pickerRow}>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedDay}
                            onValueChange={(itemValue) => setSelectedDay(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="DD" value="" />
                            {days.map(day => (
                                <Picker.Item key={day} label={String(day)} value={String(day)} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedMonth}
                            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="MM" value="" />
                            {months.map((month, index) => (
                                <Picker.Item key={index} label={month} value={String(index + 1)} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedYear}
                            onValueChange={(itemValue) => setSelectedYear(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="YYYY" value="" />
                            {years.map(year => (
                                <Picker.Item key={year} label={String(year)} value={String(year)} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={disability}
                    onValueChange={(itemValue) => setDisability(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="No" value="No" />
                    <Picker.Item label="Yes" value="Yes" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleDone}>
                <Text style={styles.buttonText}>DONE</Text>
            </TouchableOpacity>

            {showAlert && (
                <WebAlert
                    visible={showAlert}
                    title={alertTitle}
                    message={alertMessage}
                    onOk={handleWebAlertClose}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 48,
        fontSize: 16,
        marginBottom: 16,
    },
    dobContainer: {
        marginBottom: 16,
    },
    dobLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
    },
    picker: {
        height: 48,
        width: '100%',
    },
    button: {
        backgroundColor: '#007bff',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});