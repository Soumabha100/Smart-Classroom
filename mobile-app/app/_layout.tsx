import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { Stack, useRouter, useSegments, SplashScreen } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

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

    const inTabsGroup = segments[0] === "(tabs)";

    if (token && !inTabsGroup) {
      // If the user has a token but is NOT in the main '(tabs)' group,
      // navigate them to the main dashboard screen.
      router.replace("/(tabs)");
    } else if (!token && inTabsGroup) {
      // If the user does NOT have a token but is trying to access
      // a screen inside the '(tabs)' group, send them to login.
      router.replace("/login");
    }

    // Now that we have determined the correct route, hide the splash screen.
    SplashScreen.hideAsync();
  }, [token, isLoading, segments, router]);

  // While the token is loading, return null to prevent screen flashing
  if (isLoading) {
    return null;
  }

  // Once loaded, this Stack navigator will manage showing either the auth
  // screens or the main app tabs, based on the logic in the useEffect.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scanner" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}
