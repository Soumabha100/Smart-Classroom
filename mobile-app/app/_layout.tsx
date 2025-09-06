import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme"; // Import this for PaperProvider

// Prevent the splash screen from auto-hiding before we can check auth status
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait until the auth state is fully loaded from AsyncStorage
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    // THE FIX IS HERE:
    // This logic now correctly handles all cases without improper redirects.
    if (!token && !inAuthGroup) {
      // If the user is not signed in and is not in the auth group,
      // redirect them to the login page.
      router.replace("/login");
    } else if (token && inAuthGroup) {
      // If the user is signed in but is still in the auth group (e.g., on the login page),
      // redirect them to the main app dashboard.
      router.replace("/(tabs)");
    }

    // If neither of the above conditions is met (e.g., user is logged in and navigating
    // between tabs or to the scanner), this hook does nothing and allows navigation to proceed.

    // Now that we have determined the correct route, hide the splash screen.
    SplashScreen.hideAsync();
  }, [token, isLoading, segments, router]);

  // While the token is loading, we render nothing to prevent screen flashing
  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="scanner"
        options={{ presentation: "modal", title: "Scan QR" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Get the color scheme for PaperProvider theme

  return (
    <AuthProvider>
      {/* PaperProvider is what enables the styled components from React Native Paper */}
      <PaperProvider>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}
