import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Existing screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-a-new-user-account"
        options={{ title: "Create Account" }}
      />
      <Stack.Screen name="OTPScreen" options={{ title: "Verify OTP" }} />
      <Stack.Screen name="MapScreen" options={{ title: "Live Location" }} />

      {/* Live Map & Booking */}
      <Stack.Screen name="LiveMapScreen" options={{ headerShown: false }} />
      <Stack.Screen name="BookingScreen" options={{ title: "Book Your Trip" }} />

      {/* ✅ New Service Screen */}
      <Stack.Screen
        name="ServiceScreen"
        options={{ title: "Our Services" }}
      />
    </Stack>
  );
}
