import React from "react";
import { StyleSheet, View, Alert, SafeAreaView, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

// 1. Import the local asset for the logo
const LogoImage = require("../../assets/images/logo1.jpg");

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      // NOTE: Using 'err: any' is common, but you could be more specific
      // about the error type for better type safety if desired (e.g., AxiosError).
      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.content}>
        {/* 2. CORRECTED: Use the local image asset (more reliable) */}
        <Image
          source={LogoImage}
          style={styles.logo}
        />
        <Text
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Welcome Back
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Sign in to continue
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          left={<TextInput.Icon icon="email-outline" />}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          mode="outlined"
          left={<TextInput.Icon icon="lock-outline" />}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Sign In
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});