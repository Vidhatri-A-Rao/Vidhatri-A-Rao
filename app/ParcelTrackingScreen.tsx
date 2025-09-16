import polyline from "@mapbox/polyline";
import { GoogleMap, Marker as GoogleMarker, Polyline as GooglePolyline, LoadScript } from "@react-google-maps/api";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

const { height } = Dimensions.get("window");

export default function ParcelTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const pickupLocation = params.pickupLocation as string;
  const dropLocation = params.dropLocation as string;
  const parcelDescription = params.parcelDescription as string;
  const estimatedTime = params.estimatedTime as string;
  const estimatedCost = params.estimatedCost as string;

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  // Helper to decode polyline if using Google Directions API
  const decodePolyline = (encoded: string) =>
    polyline.decode(encoded).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

  // Fetch current location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Enable location services to track parcel.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);

        // Simulated route for demo
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

    fetchLocation();

    const interval = setInterval(() => {
      setCurrentLocation(prev => {
        if (!prev) return prev;
        const newLat = prev.coords.latitude + 0.0003;
        const newLng = prev.coords.longitude + 0.0003;
        return {
          ...prev,
          coords: {
            latitude: newLat,
            longitude: newLng,
            altitude: prev.coords.altitude,
            accuracy: prev.coords.accuracy,
            altitudeAccuracy: prev.coords.altitudeAccuracy ?? 1,
            heading: prev.coords.heading,
            speed: prev.coords.speed,
          },
          timestamp: Date.now(),
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCancelDelivery = () => {
    Alert.alert(
      "Cancel Parcel Delivery",
      "Are you sure you want to cancel this parcel delivery?",
      [
        { text: "No" },
        { text: "Yes", onPress: () => router.push("/") },
      ]
    );
  };

  const handleReroute = () => {
    Alert.alert("Reroute", "The parcel route has been recalculated.");
  };

  const initialRegion: Region = currentLocation
    ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : { latitude: 0, longitude: 0, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {currentLocation ? (
          Platform.OS === "web" ? (
            <LoadScript googleMapsApiKey="AIzaSyBoSkOJ10DdYgHX_RHc9SBU47odFphL9Q0">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={{
                  lat: currentLocation.coords.latitude,
                  lng: currentLocation.coords.longitude,
                }}
                zoom={14}
              >
                <GoogleMarker
                  position={{
                    lat: currentLocation.coords.latitude,
                    lng: currentLocation.coords.longitude,
                  }}
                />
                {routeCoordinates.length > 0 && (
                  <GooglePolyline
                    path={routeCoordinates.map(coord => ({
                      lat: coord.latitude,
                      lng: coord.longitude,
                    }))}
                    options={{ strokeColor: "#007bff", strokeWeight: 4 }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          ) : (
            <MapView style={styles.map} initialRegion={initialRegion}>
              <Marker
                coordinate={{
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                }}
                title="Parcel Location"
              />
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#007bff"
                  strokeWidth={4}
                />
              )}
            </MapView>
          )
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
        <TouchableOpacity style={[styles.button, { backgroundColor: "#f44336" }]} onPress={handleCancelDelivery}>
          <Text style={styles.buttonText}>Cancel Delivery</Text>
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