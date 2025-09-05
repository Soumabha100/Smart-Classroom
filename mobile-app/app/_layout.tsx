import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { Stack, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "../hooks/useRouter";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      // Check if the user is in one of the main app screens
      const inApp = segments[0] === "(tabs)";

      if (token && !inApp) {
        // User has a token but is not in the app, so redirect them into the app.
        router.replace("/(tabs)");
      } else if (!token && inApp) {
        // User does not have a token but is trying to access the app, so redirect to login.
        router.replace("/login");
      }
    };
    checkAuth();
  }, [segments, router]);

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* These definitions tell the Stack about the route groups */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}
