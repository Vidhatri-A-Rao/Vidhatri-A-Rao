import { useRouter } from "expo-router";
import { Car, Package } from "lucide-react-native"; // ✅ Icons
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ServiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Services</Text>

      {/* Ride Service */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/BookingScreen")}
      >
        <Car size={40} color="#007bff" style={styles.icon} />
        <Text style={styles.cardText}>Ride</Text>
      </TouchableOpacity>

      {/* Parcel Delivery */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/ParcelScreen")}
      >
        <Package size={40} color="#28a745" style={styles.icon} />
        <Text style={styles.cardText}>Parcel Delivery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
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
  icon: {
    marginRight: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});