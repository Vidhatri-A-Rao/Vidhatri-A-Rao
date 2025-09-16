import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ParcelScreen() {
  const router = useRouter();

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [parcelDescription, setParcelDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("Estimating...");
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please enable location services to use this feature."
          );
          setLocationLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const address = `${geocode[0].street}, ${geocode[0].city}`;
          setPickupLocation(address);
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch your current location.");
        console.error(error);
      } finally {
        setLocationLoading(false);
      }
    };
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (pickupLocation && dropLocation) {
      const baseTime = 15; // base time for delivery
      setEstimatedTime(`${baseTime} minutes`);
    } else {
      setEstimatedTime("Enter locations to estimate");
    }
  }, [pickupLocation, dropLocation]);

  const handleParcelBooking = () => {
    const estimatedCost = 50; // can calculate based on distance or parcel type

    // Navigate to ParcelTrackingScreen with params
    router.push({
      pathname: "/ParcelTrackingScreen",
      params: {
        pickupLocation,
        dropLocation,
        parcelDescription,
        estimatedTime,
        estimatedCost,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Pickup Location</Text>
      {locationLoading ? (
        <Text>Fetching current location...</Text>
      ) : (
        <TextInput
          style={styles.input}
          value={pickupLocation}
          onChangeText={setPickupLocation}
          placeholder="Enter pickup location"
        />
      )}

      <Text style={styles.label}>Drop-off Location</Text>
      <TextInput
        style={styles.input}
        value={dropLocation}
        onChangeText={setDropLocation}
        placeholder="Enter drop-off location"
      />

      <Text style={styles.label}>Parcel Description</Text>
      <TextInput
        style={styles.input}
        value={parcelDescription}
        onChangeText={setParcelDescription}
        placeholder="Describe your parcel"
      />

      <View style={styles.infoSection}>
        <Text style={styles.etaText}>Estimated Delivery Time: {estimatedTime}</Text>
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleParcelBooking}>
        <Text style={styles.bookButtonText}>Book Parcel Delivery</Text>
      </TouchableOpacity>

      {/* Enhanced Restriction/Disclaimer Box */}
      <View style={styles.restrictionsContainer}>
        <Text style={styles.restrictionsTitle}>⚠️ Parcel Restrictions</Text>
        <Text style={styles.restrictionsText}>
          • Maximum weight: 20kg{"\n"}
          • Prohibited items: weapons, hazardous materials, illegal drugs, perishable food{"\n"}
          • Limitations on package size and monetary value
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  infoSection: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  etaText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  bookButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
      android: { elevation: 5 },
      web: { boxShadow: "0px 2px 3.84px rgba(0,0,0,0.25)" },
    }),
  },
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  restrictionsContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#fff4e5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcc80",
  },
  restrictionsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#e65100",
    marginBottom: 8,
  },
  restrictionsText: {
    fontSize: 15,
    color: "#e65100",
    lineHeight: 22,
  },
});