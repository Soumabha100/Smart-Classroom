import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../api';
import { theme } from '../constants/theme';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const res = await api.post('/attendance/mark', { qrToken: data });
      Alert.alert('Success', res.data.message, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || 'An unknown error occurred.';
      Alert.alert('Scan Failed', errorMessage, [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera.
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
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Scanner UI Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Scan QR Code</Text>
        <Text style={styles.subtitle}>Align the code within the frame to mark your attendance.</Text>
        <View style={styles.scannerBox}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        <Button 
          mode="outlined" 
          onPress={() => router.back()} 
          style={styles.cancelButton}
          textColor='white'
        >
          Cancel
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  scannerBox: {
    width: 250,
    height: 250,
    marginTop: 40,
    marginBottom: 40,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
    borderWidth: 5,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cancelButton: {
    borderColor: 'rgba(255,255,255,0.5)',
  }
});