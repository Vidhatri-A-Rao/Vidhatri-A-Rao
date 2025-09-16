import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

// ✅ Replace with your actual Google Maps API key
const GOOGLE_MAPS_WEB_KEY = "AIzaSyBoSkOJ10DdYgHX_RHc9SBU47odFphL9Q0";
const { height } = Dimensions.get("window");

// ✅ Import web maps hook at the top
let useJsApiLoader: any;
let GoogleMap: any;
let WebMarker: any;

if (Platform.OS === "web") {
  const mapsApi = require("@react-google-maps/api");
  useJsApiLoader = mapsApi.useJsApiLoader;
  GoogleMap = mapsApi.GoogleMap;
  WebMarker = mapsApi.Marker;
}

export default function LiveMapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // ✅ Load Google Maps API (only on web)
  const { isLoaded, loadError } = Platform.OS === "web" && useJsApiLoader
    ? useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_WEB_KEY,
        libraries: ["places"],
      })
    : { isLoaded: false, loadError: null };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    })();
  }, []);

  const handleGoButtonPress = () => {
    router.push("/BookingScreen");
  };

  const handleTabPress = (tabName: string) => {
    if (tabName === "Services") {
     router.push("/ServiceScreen"); // ✅ Navigate to services screen
    } else {
      console.log(`Tab clicked: ${tabName}`);
    }
  };

  // ✅ Web rendering
  if (Platform.OS === "web" && GoogleMap) {
    if (loadError) {
      return <Text>Error loading maps: {loadError.message}</Text>;
    }

    if (!isLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading map...</Text>
        </View>
      );
    }

    const containerStyle = { width: "100%", height: "100%" };
    const center = location
      ? { lat: location.coords.latitude, lng: location.coords.longitude }
      : { lat: 0, lng: 0 };

    return (
      <View style={styles.container}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            options={{ disableDefaultUI: true }}
          >
            {location && <WebMarker position={center} />}
          </GoogleMap>
        </View>

        {/* Middle Section */}
        <View style={styles.middleContainer}>
          <TouchableOpacity style={styles.goButton} onPress={handleGoButtonPress}>
            <Text style={styles.goButtonText}>Where would you like to go?</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabPress("Services")}>
            <Text style={styles.tabText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabPress("Profile")}>
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ✅ Mobile rendering
  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text>Fetching your location...</Text>
          </View>
        )}
      </View>

      {/* Middle Section */}
      <View style={styles.middleContainer}>
        <TouchableOpacity style={styles.goButton} onPress={handleGoButtonPress}>
          <Text style={styles.goButtonText}>Where would you like to go?</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => handleTabPress("Services")}>
          <Text style={styles.tabText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handleTabPress("Profile")}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  mapContainer: {
    height: height / 4,
    width: "100%",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  middleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  goButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  goButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tabsContainer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
});