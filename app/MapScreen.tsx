import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MapScreen() {
    const router = useRouter();
    
    // Get the 'name' parameter passed from the previous screen.
    // The `as string | undefined` part handles cases where 'name' is missing.
    const { name } = useLocalSearchParams() as { name: string | undefined };

    const handleNavigate = () => {
        router.push('/LiveMapScreen');
    };

    // Use a default value for the username to prevent errors.
    const username = name || 'User';

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.welcomeText}>
                    Welcome, {username}!
                </Text>
                <Text style={styles.appNameText}>
                    Welcome to GridFlow App
                </Text>
            </View>

            <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                <Text style={styles.buttonText}>Get Live Location</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    contentContainer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appNameText: {
        fontSize: 18,
        color: '#666',
    },
    navigateButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
            },
            default: {
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }
        })
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});