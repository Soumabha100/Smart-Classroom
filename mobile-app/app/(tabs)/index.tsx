import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import the new components we will create
import DashboardHeader from '@/components/Mobile/DashboardHeader';
import QuickActions from '@/components/Mobile/QuickActions';
import TodaysSchedule from '@/components/Mobile/TodaysSchedule';
import AttendanceSummary from '@/components/Mobile/AttendanceSummary';
import { ThemedView } from '@/components/ThemedView';

// Dummy data for now - this will come from your API
const studentData = {
  name: "Soumabha",
  attendance: {
    percentage: 92,
    streak: 14,
  },
  schedule: [
    { time: '10:00 AM', subject: 'Data Structures', room: 'CS-501' },
    { time: '11:00 AM', subject: 'Algorithms', room: 'CS-502' },
    { time: '01:00 PM', subject: 'Database Systems Lab', room: 'Lab-3' },
  ]
};

export default function StudentDashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader studentName={studentData.name} />
        
        <View style={styles.content}>
          <AttendanceSummary 
            percentage={studentData.attendance.percentage} 
            streak={studentData.attendance.streak} 
          />
          <QuickActions />
          <TodaysSchedule schedule={studentData.schedule} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // A light grey background
  },
  content: {
    paddingHorizontal: 20,
    gap: 20, // Adds space between components
  },
});
