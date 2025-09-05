import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Stack, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from '../hooks/useRouter'; // Using our custom hook

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const inAuthGroup = segments[0] === 'auth';

      if (!token && !inAuthGroup) {
        // If there's no token and we're not in the auth group, go to login.
        router.replace('/login');
      } else if (token && inAuthGroup) {
        // If there is a token but we're somehow in the auth group, go to the main app.
        router.replace('/(tabs)');
      }
    };
    checkAuth();
  }, [segments, router]);

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}