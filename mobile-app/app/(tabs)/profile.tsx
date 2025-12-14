import React from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text, List, Switch, Divider, Avatar, Button } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { colorScheme, toggleColorScheme, theme } = useTheme();
  const { user, logout } = useAuth();

  // --- SAFETY NET: If user data is missing, allow Logout ---
  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginBottom: 20 }} />
        <Text style={{ color: theme.colors.onSurface, marginBottom: 20 }}>
          User data not found.
        </Text>
        <Button mode="contained" onPress={logout} buttonColor={theme.colors.error}>
          Force Sign Out
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image 
            size={80} 
            source={{ uri: `https://api.multiavatar.com/${user.email}.png` }}
            style={{ marginBottom: 16, backgroundColor: theme.colors.surfaceVariant }}
          />
          <Text variant="headlineLarge" style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
            {user.name}
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {user.email}
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.primary, marginTop: 4, textTransform: 'capitalize' }}>
            {user.role}
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            titleStyle={{ color: theme.colors.onSurface }}
            left={() => <List.Icon icon="theme-light-dark" color={theme.colors.onSurface} />}
            right={() => (
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
              />
            )}
          />
        </List.Section>
        
        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Account</List.Subheader>
          <List.Item
            title="Sign Out"
            left={() => <List.Icon icon="logout" color={theme.colors.error} />}
            onPress={logout}
            titleStyle={{ color: theme.colors.error }}
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
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
});