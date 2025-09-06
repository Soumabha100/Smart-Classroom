import React from 'react';
import { StyleSheet, View, Alert, SafeAreaView, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../hooks/useAppTheme'; // <-- Use our new hook

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const theme = useAppTheme(); // <-- Get the current theme

  // Create styles that depend on the theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    logo: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginBottom: 24,
      borderRadius: 20,
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.onBackground, // Use theme color
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 32,
      color: theme.colors.onSurfaceVariant, // Use theme color
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
      fontWeight: 'bold',
    },
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', (err as any).response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/logo1.jpg')} 
          style={styles.logo} 
        />
        <Text variant="headlineLarge" style={styles.title}>Welcome Back</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Sign in to continue</Text>
        
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