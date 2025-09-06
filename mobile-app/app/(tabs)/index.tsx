import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Text, ActivityIndicator, Card, Avatar } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';
import { theme } from '../../constants/theme';

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
};

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card style={styles.statCard}>
    <Card.Content style={styles.statCardContent}>
      <Avatar.Icon icon={icon} size={40} style={{ backgroundColor: theme.colors.primary + '20' }} color={theme.colors.primary} />
      <View>
        <Text variant="titleMedium" style={styles.statTitle}>{title}</Text>
        <Text variant="headlineSmall" style={styles.statValue}>{value}</Text>
      </View>
    </Card.Content>
  </Card>
);

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Hi, {user.name.split(' ')[0]}!</Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.placeholder }}>Welcome to your dashboard</Text>
        </View>

        <Card style={styles.mainCard}>
          <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070' }} />
          <Card.Title 
            title="Ready for today?" 
            subtitle="Scan your attendance QR code to get started." 
            titleStyle={{ fontWeight: 'bold' }} 
          />
          <Card.Actions>
            <Link href="/scanner" asChild>
              <Button mode="contained" icon="qrcode-scan">Scan Attendance</Button>
            </Link>
          </Card.Actions>
        </Card>
        
        <View style={styles.statsGrid}>
            <StatCard title="Attendance" value="95%" icon="check-decagram" />
            <StatCard title="Avg. Grade" value="A-" icon="star-circle" />
        </View>

        <Button 
          mode="elevated" 
          onPress={logout} 
          style={styles.logoutButton}
          icon="logout"
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  mainCard: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statTitle: {
    color: theme.colors.placeholder,
  },
  statValue: {
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 16,
    borderColor: theme.colors.outline,
  }
});