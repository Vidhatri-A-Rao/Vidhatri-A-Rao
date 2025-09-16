import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleContinuePress = () => {
    // Basic validation to check for a valid phone number length
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    // Now navigate to the OTP screen
    // This command will push the user to the OTPScreen and pass the phone number as a parameter
    router.push({
      pathname: '/OTPScreen', 
      params: { 
        phoneNumber: phoneNumber
      }
    });
  };

  const handleCreateAccountPress = () => {
    // This command navigates to the 'create-a-new-user-account' screen
    router.push('/create-a-new-user-account');
  };

  const isContinueDisabled = phoneNumber.length < 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to GridFlow Booking App</Text>
        <Text style={styles.subtitle}>Let's get started!</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isContinueDisabled && styles.buttonDisabled]} 
          onPress={handleContinuePress}
          disabled={isContinueDisabled}
        >
          <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateAccountPress}>
          <Text style={styles.createAccountText}>Create a new user account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createAccountText: {
    color: '#007bff',
    fontSize: 14,
    marginTop: 10,
  },
});