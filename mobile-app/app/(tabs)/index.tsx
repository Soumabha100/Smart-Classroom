import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import {
  Button,
  Text,
  ActivityIndicator,
  Card,
  Avatar,
} from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { Link } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) => {
  const { theme } = useTheme();

  return (
    <Card style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Card.Content style={styles.statCardContent}>
        <Avatar.Icon
          icon={icon}
          size={40}
          style={{ backgroundColor: theme.colors.primaryContainer }}
          color={theme.colors.primary}
        />
        <View>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {title}
          </Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onSurface, fontWeight: "bold" }}
          >
            {value}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.onBackground }}
          >
            Hi, {user.name.split(" ")[0]}!
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Welcome to your dashboard
          </Text>
        </View>

        <Card
          style={{ marginBottom: 24, backgroundColor: theme.colors.surface }}
        >
          <Card.Cover
            source={{
              uri: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070",
            }}
          />
          <Card.Title
            title="Ready for today?"
            subtitle="Scan your attendance QR code to get started."
            titleStyle={{ fontWeight: "bold" }}
          />
          <Card.Actions>
            <Link href="/scanner" asChild>
              <Button mode="contained" icon="qrcode-scan">
                Scan Attendance
              </Button>
            </Link>
          </Card.Actions>
        </Card>

        <View style={styles.statsGrid}>
          <StatCard title="Attendance" value="95%" icon="check-decagram" />
          <StatCard title="Avg. Grade" value="A-" icon="star-circle" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollView: { padding: 16 },
  header: { marginBottom: 24, paddingHorizontal: 8 },
  statsGrid: { flexDirection: "row", gap: 16, marginBottom: 24 },
  statCardContent: { flexDirection: "row", alignItems: "center", gap: 12 },
});
