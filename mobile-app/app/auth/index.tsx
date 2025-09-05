import React, { useEffect, useState, useCallback } from "react"; // <-- 1. Import useCallback
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "../../hooks/useRouter";
import api from "../../api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 2. Wrap handleLogout in useCallback
  // This memoizes the function, so it doesn't change on every render.
  // 'router' is its dependency.
  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        handleLogout();
      }
    };
    fetchProfile();
    // 3. Add the now-stable handleLogout function to the dependency array
  }, [handleLogout]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome, {user ? user.name : "Student"}!
      </Text>
      <Text style={styles.subtitle}>This is your dashboard.</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 16,
    color: "#666",
  },
  button: {
    marginTop: 20,
  },
});
