import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BookingScreen() {
    const router = useRouter();

    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [stops, setStops] = useState(['']);
    const [peopleCount, setPeopleCount] = useState(1);
    const [babyCount, setBabyCount] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState('Estimating...');
    const [locationLoading, setLocationLoading] = useState(true);

    // Fetch current location
    useEffect(() => {
        const fetchCurrentLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Enable location services to book a ride.');
                    setLocationLoading(false);
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geocode.length > 0) {
                    const address = `${geocode[0].street}, ${geocode[0].city}`;
                    setStartLocation(address);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLocationLoading(false);
            }
        };
        fetchCurrentLocation();
    }, []);

    // Estimate ETA
    useEffect(() => {
        const estimateETA = () => {
            const baseTime = 10;
            const stopTime = stops.filter(stop => stop.trim() !== '').length * 5;
            const totalTime = baseTime + stopTime;
            setEstimatedTime(`${totalTime} minutes`);
        };
        if (startLocation && destination) estimateETA();
        else setEstimatedTime('Enter locations to estimate');
    }, [startLocation, destination, stops]);

    const handleAddStop = () => {
        if (stops.length < 2) setStops([...stops, '']);
        else Alert.alert("Maximum Stops Reached", "You can add a maximum of 2 stops.");
    };

    const handleRemoveStop = (index: number) => {
        const newStops = stops.filter((_, i) => i !== index);
        setStops(newStops);
    };

    // Navigate to RideTrackingScreen instead of alert
    const handleBookNow = () => {
        const stopList = stops.filter(stop => stop.trim() !== '').join(", ") || "No Stops";

        router.push({
            pathname: "/RideTrackingScreen",
            params: {
                pickupLocation: startLocation,
                dropLocation: destination,
                parcelDescription: stopList,
                peopleCount: peopleCount.toString(),
                babyCount: babyCount.toString(),
                estimatedTime: estimatedTime,
                estimatedCost: (peopleCount * 50).toString() // Example cost calculation
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputSection}>
                <Text style={styles.label}>Start Location</Text>
                {locationLoading ? (
                    <Text>Fetching current location...</Text>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter start location"
                        value={startLocation}
                        onChangeText={setStartLocation}
                    />
                )}
            </View>

            <View style={styles.destinationSection}>
                <Text style={styles.label}>Destination</Text>
                <View style={styles.destinationRow}>
                    <TextInput
                        style={styles.destinationInput}
                        placeholder="Enter destination"
                        value={destination}
                        onChangeText={setDestination}
                    />
                    {stops.length < 2 && (
                        <TouchableOpacity style={styles.addStopButton} onPress={handleAddStop}>
                            <Text style={styles.addStopText}>+</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {stops.map((stop, index) => (
                    <View key={index} style={styles.stopInputContainer}>
                        <TextInput
                            style={styles.stopInput}
                            placeholder={`Add Stop ${index + 1}`}
                            value={stop}
                            onChangeText={(text) => {
                                const newStops = [...stops];
                                newStops[index] = text;
                                setStops(newStops);
                            }}
                        />
                        <TouchableOpacity style={styles.removeStopButton} onPress={() => handleRemoveStop(index)}>
                            <Text style={styles.removeStopText}>-</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.etaText}>Estimated Time of Arrival: {estimatedTime}</Text>
            </View>

            <View style={styles.counterList}>
                <Text style={styles.label}>Number of People (max 4)</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={peopleCount} onValueChange={(v) => setPeopleCount(v)} style={styles.picker}>
                        <Picker.Item label="1" value={1} />
                        <Picker.Item label="2" value={2} />
                        <Picker.Item label="3" value={3} />
                        <Picker.Item label="4" value={4} />
                    </Picker>
                </View>

                <Text style={[styles.label, { marginTop: 15 }]}>Travelling with Baby (max 3)</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={babyCount} onValueChange={(v) => setBabyCount(v)} style={styles.picker}>
                        <Picker.Item label="0" value={0} />
                        <Picker.Item label="1" value={1} />
                        <Picker.Item label="2" value={2} />
                        <Picker.Item label="3" value={3} />
                    </Picker>
                </View>
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
                <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    inputSection: { marginBottom: 15 },
    label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
    destinationSection: { marginBottom: 15 },
    destinationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    destinationInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
    addStopButton: { marginLeft: 10, backgroundColor: '#007bff', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    addStopText: { color: '#fff', fontWeight: 'bold', fontSize: 24 },
    stopInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    stopInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
    removeStopButton: { marginLeft: 10, backgroundColor: '#dc3545', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    removeStopText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    infoSection: { marginBottom: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    etaText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    counterList: { marginBottom: 20 },
    pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9', overflow: 'hidden', height: 50, justifyContent: 'center' },
    picker: { height: 50, width: '100%' },
    bookButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
    bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});