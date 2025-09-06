import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { Link } from "expo-router"; // <-- 1. Import Link

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome, {user.name}!
      </Text>
      <Text style={styles.subtitle}>This is your dashboard.</Text>

      {/* 2. Add the Scan Button */}
      <Link href={"/scanner" as any} asChild>
        <Button mode="contained-tonal" icon="qrcode-scan" style={styles.button}>
          Scan Attendance QR
        </Button>
      </Link>

      <Button mode="contained" onPress={logout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
}

// 3. Update the styles
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
    marginBottom: 40, // Added more space
    fontSize: 16,
    color: "#666",
  },
  button: {
    marginTop: 10, // Consistent margin
    width: "80%", // Make buttons wider
  },
});
