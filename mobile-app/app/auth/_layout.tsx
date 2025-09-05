import { Stack } from 'expo-router';

export default function AuthLayout() {
  // This layout file is simple: it just renders a Stack navigator
  // for the screens inside the (auth) group, like login.tsx.
  return <Stack screenOptions={{ headerShown: false }} />;
}