import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';

type AttendanceSummaryProps = {
  percentage: number;
  streak: number;
};

const AttendanceSummary = ({ percentage, streak }: AttendanceSummaryProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <ThemedText style={styles.statValue}>{percentage}%</ThemedText>
        <ThemedText style={styles.statLabel}>Attendance</ThemedText>
      </View>
      <View style={styles.statBox}>
        <ThemedText style={styles.statValue}>{streak} Days</ThemedText>
        <ThemedText style={styles.statLabel}>Streak 🔥</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default AttendanceSummary;
