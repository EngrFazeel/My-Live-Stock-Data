import React, { useEffect } from 'react';
import {
  View,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';

export default function CameraScreen({ navigation }) {

  useEffect(() => {
    checkPermissionAndOpenCamera();
  }, []);

  // 🔹 Request Camera Permission (Android)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // 🔹 Check permission then open camera
  const checkPermissionAndOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (hasPermission) {
      openCamera();
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required');
    }
  };

  // 🔹 Open Camera
  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'back',
      saveToPhotos: true,
    });

    if (result.didCancel) {
      navigation.goBack(); // optional: go back if cancelled
    } else if (result.errorCode) {
      Alert.alert('Error', result.errorMessage);
    } else {
      const imageUri = result.assets[0].uri;

      // ✅ Navigate to Result Screen
      navigation.replace('Result', { image: imageUri });
      // or use navigation.navigate('Result', { image: imageUri });
    }
  };

  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
