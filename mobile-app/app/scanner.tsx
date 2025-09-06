import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../api'; // Your configured Axios instance

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Automatically ask for permission when the screen loads
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return; // Prevent multiple scans
    setScanned(true);

    try {
      // Send the scanned data (qrToken) to your backend
      //
      const res = await api.post('/attendance/mark', { qrToken: data });
      Alert.alert('Success', res.data.message, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
      Alert.alert('Scan Failed', errorMessage, [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          We need your permission to show the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Scan Attendance QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});