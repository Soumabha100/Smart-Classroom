import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ThemedText } from '../ThemedText';

type DashboardHeaderProps = {
  studentName: string;
};

const DashboardHeader = ({ studentName }: DashboardHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View>
        <ThemedText style={styles.greetingText}>Hello,</ThemedText>
        <ThemedText style={styles.studentName}>{studentName} 👋</ThemedText>
      </View>
      {/* You can replace this with the user's profile picture */}
      <Image 
        source={{ uri: `https://api.multiavatar.com/${studentName}.png` }} 
        style={styles.avatar} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    color: '#666',
  },
  studentName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default DashboardHeader;
