import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, List, Switch, Divider, Avatar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext'; // <-- The one true hook
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  // Get everything from our single, reliable hook
  const { colorScheme, toggleColorScheme, theme } = useTheme();
  const { user, logout } = useAuth();

  if (!user) {
    return <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image 
            size={80} 
            source={{ uri: `https://api.multiavatar.com/${user.email}.png` }}
            style={{ marginBottom: 16 }}
          />
          <Text variant="headlineLarge" style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
            {user.name}
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {user.email}
          </Text>
        </View>

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
              />
            )}
          />
        </List.Section>
        
        <Divider style={{ backgroundColor: theme.colors.border }} />

        <List.Section>
          <List.Subheader>Account</List.Subheader>
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