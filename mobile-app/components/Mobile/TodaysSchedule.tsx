import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { ThemedText } from '../ThemedText';

type ScheduleItem = {
  time: string;
  subject: string;
  room: string;
};

type TodaysScheduleProps = {
  schedule: ScheduleItem[];
};

const TodaysSchedule = ({ schedule }: TodaysScheduleProps) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Today's Schedule</ThemedText>
      {schedule.map((item, index) => (
        <View key={index} style={styles.scheduleItem}>
          <View style={styles.timeContainer}>
            <Clock size={16} color="#3b82f6" />
            <ThemedText style={styles.timeText}>{item.time}</ThemedText>
          </View>
          <View style={styles.detailsContainer}>
            <ThemedText style={styles.subjectText}>{item.subject}</ThemedText>
            <ThemedText style={styles.roomText}>{item.room}</ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomText: {
    fontSize: 14,
    color: '#666',
  },
});

export default TodaysSchedule;
