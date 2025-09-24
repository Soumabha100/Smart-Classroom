import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ScanLine, Calendar, Bot } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const QuickActions = () => {
  const router = useRouter();

  const handleScan = () => {
    router.push('/scanner');
  };

  return (
    <View>
      <ThemedText style={styles.title}>Quick Actions</ThemedText>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.button} onPress={handleScan}>
          <ScanLine color="#3b82f6" size={32} />
          <ThemedText style={styles.buttonText}>Scan QR</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Calendar color="#10b981" size={32} />
          <ThemedText style={styles.buttonText}>Schedule</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Bot color="#f97316" size={32} />
          <ThemedText style={styles.buttonText}>AI Assistant</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QuickActions;
