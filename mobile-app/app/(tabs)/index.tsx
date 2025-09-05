import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../context/AuthContext"; // <-- Import useAuth

export default function StudentDashboard() {
  // Get the user and logout function directly from our context
  const { user, logout } = useAuth();

  // If for some reason the user data isn't loaded yet, show a spinner
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
      {/* The logout button now simply calls the logout function from the context */}
      <Button mode="contained" onPress={logout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
}

// Styles remain the same
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
