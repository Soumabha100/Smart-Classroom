import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, List, Switch, Divider } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { colorScheme, toggleColorScheme, paperTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            variant="headlineLarge"
            style={{ color: paperTheme.colors.onSurface }}
          >
            Profile & Settings
          </Text>
        </View>

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={colorScheme === "dark"}
                onValueChange={toggleColorScheme}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Sign Out"
            left={() => (
              <List.Icon icon="logout" color={paperTheme.colors.error} />
            )}
            onPress={logout}
            titleStyle={{ color: paperTheme.colors.error }}
          />
        </List.Section>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
});
