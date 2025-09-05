import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't do anything until the auth state is loaded

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // If the user is not signed in and the initial segment is not anything in the auth group,
      // redirect to the login page.
      router.replace('/login');
    } else if (token && inAuthGroup) {
      // Redirect away from the login page if the user is signed in.
      router.replace('/');
    }
    // Hide the splash screen now that we're done checking
    SplashScreen.hideAsync();
  }, [token, isLoading, segments, router]);
  
  // Render nothing until the auth state is determined
  if (isLoading) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
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