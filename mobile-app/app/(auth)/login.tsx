import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your local logo
const LogoImage = require("../../assets/images/logo1.jpg");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- Server URL State ---
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const { login } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Load any saved custom URL on startup
    const loadSettings = async () => {
      const saved = await AsyncStorage.getItem("server_url");
      if (saved) setCustomUrl(saved);
    };
    loadSettings();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.log(err);
      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Could not connect to server. Please check your internet."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUrl = async () => {
    try {
      if (!customUrl.trim()) {
        // If empty, remove the key so it goes back to the Default Render URL
        await AsyncStorage.removeItem("server_url");
        Alert.alert("Reset", "Restored to default Public Server.");
      } else {
        await AsyncStorage.setItem("server_url", customUrl.trim());
        Alert.alert("Saved", "Custom Server URL updated.");
      }
      setShowServerSettings(false);
    } catch (e) {
      Alert.alert("Error", "Failed to save URL.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.content}>
        <Image source={LogoImage} style={styles.logo} />
        
        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
          Smart Classroom
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Sign in to continue
        </Text>

        {/* --- Dynamic Link Toggle (Click to show settings) --- */}
        <TouchableOpacity onPress={() => setShowServerSettings(!showServerSettings)}>
          <Text style={{ color: theme.colors.primary, textAlign: 'center', marginBottom: 15, fontSize: 12 }}>
            {showServerSettings ? "Hide Server Settings" : "Connection Settings"}
          </Text>
        </TouchableOpacity>

        {/* --- Server URL Input --- */}
        {showServerSettings && (
          <View style={styles.serverBox}>
            <Text style={{marginBottom: 5, color: theme.colors.onSurface}}>Custom Server URL:</Text>
            <TextInput
              placeholder="http://192.168.1.10:5001"
              value={customUrl}
              onChangeText={setCustomUrl}
              mode="outlined"
              style={{ marginBottom: 10, height: 40 }}
              autoCapitalize="none"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button mode="text" compact onPress={() => setCustomUrl("")}>
                Reset to Default
              </Button>
              <Button mode="contained" compact onPress={handleSaveUrl}>
                Save
              </Button>
            </View>
          </View>
        )}

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
    marginBottom: 20,
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
  serverBox: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.02)'
  }
});