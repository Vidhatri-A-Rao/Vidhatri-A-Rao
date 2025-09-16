import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height } = Dimensions.get("window");

export default function RideTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const pickupLocation = params.pickupLocation as string;
  const dropLocation = params.dropLocation as string;
  const parcelDescription = params.parcelDescription as string;
  const estimatedTime = params.estimatedTime as string;
  const estimatedCost = params.estimatedCost as string;

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  // Helper: Decode Google Directions polyline
  const decodePolyline = (encoded: string) => {
    const points = polyline.decode(encoded);
    return points.map(([latitude, longitude]) => ({ latitude, longitude }));
  };

  // Fetch current location
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Enable location services to track ride.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });

        // Dummy route for demo
        const dummyRoute = [
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          { latitude: location.coords.latitude + 0.01, longitude: location.coords.longitude + 0.01 },
          { latitude: location.coords.latitude + 0.015, longitude: location.coords.longitude + 0.005 },
        ];
        setRouteCoordinates(dummyRoute);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentLocation();

    // Simulate live tracking
    const interval = setInterval(() => {
      setCurrentLocation((prev) => {
        if (!prev) return prev;
        return {
          latitude: prev.latitude + 0.0002,
          longitude: prev.longitude + 0.0002,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCancelTrip = () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride?",
      [
        { text: "No" },
        { text: "Yes", onPress: () => router.push("/") },
      ]
    );
  };

  const handleReroute = () => {
    Alert.alert("Reroute", "The ride route has been recalculated.");
    // You can update routeCoordinates dynamically here from Google Directions API
  };

  // Web fallback
  if (Platform.OS === "web") {
    const src = currentLocation
      ? `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&hl=es;z=14&output=embed`
      : "";
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {currentLocation ? (
            <iframe title="Ride Tracking Map" src={src} width="100%" height="100%" style={{ border: 0 }} />
          ) : (
            <View style={styles.loadingContainer}>
              <Text>Fetching current location...</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Pickup: {pickupLocation}</Text>
          <Text style={styles.infoText}>Drop-off: {dropLocation}</Text>
          <Text style={styles.infoText}>Parcel: {parcelDescription}</Text>
          <Text style={styles.infoText}>Estimated Time: {estimatedTime}</Text>
          <Text style={styles.infoText}>Estimated Cost: ${estimatedCost}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#ff9800" }]} onPress={handleReroute}>
            <Text style={styles.buttonText}>Reroute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#f44336" }]} onPress={handleCancelTrip}>
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // iOS/Android MapView
  const MapView = require("react-native-maps").default;
  const Marker = require("react-native-maps").Marker;
  const Polyline = require("react-native-maps").Polyline;

  const initialRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView style={styles.map} initialRegion={initialRegion}>
            <Marker coordinate={currentLocation} title="Current Location" />
            {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} strokeColor="#007bff" strokeWidth={4} />}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text>Fetching current location...</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Pickup: {pickupLocation}</Text>
        <Text style={styles.infoText}>Drop-off: {dropLocation}</Text>
        <Text style={styles.infoText}>Parcel: {parcelDescription}</Text>
        <Text style={styles.infoText}>Estimated Time: {estimatedTime}</Text>
        <Text style={styles.infoText}>Estimated Cost: ${estimatedCost}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#ff9800" }]} onPress={handleReroute}>
          <Text style={styles.buttonText}>Reroute</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#f44336" }]} onPress={handleCancelTrip}>
          <Text style={styles.buttonText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapContainer: { height: height / 2, width: "100%" },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoContainer: { padding: 20, backgroundColor: "#f0f0f0" },
  infoText: { fontSize: 16, marginBottom: 8, fontWeight: "bold" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  button: { padding: 15, borderRadius: 8, width: "40%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});