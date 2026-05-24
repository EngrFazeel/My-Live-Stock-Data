import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {color} from '../../Color';
import {identifyNoseScan, clearScanResult} from '../../Redux/Slices/scanSlice';
import {showAlert} from '../../Utils/SweetAlert';

export default function ScanScreen({navigation}) {
  const dispatch = useDispatch();
  const {loading} = useSelector(s => s.scan);
  const [selectedImage, setSelectedImage] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        return false;
      }
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      showAlert({
        title: 'Permission Denied',
        message: 'Camera permission is required to scan.',
        type: 'error',
        confirmText: 'OK',
      });
      return;
    }
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'back',
    });
    if (result.assets?.[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.8});
    if (result.assets?.[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleIdentify = async () => {
    if (!selectedImage) {
      return;
    }
    dispatch(clearScanResult());
    const action = await dispatch(identifyNoseScan(selectedImage.uri));
    if (identifyNoseScan.fulfilled.match(action)) {
      navigation.navigate('Result', {result: action.payload});
    } else {
      const errMsg =
        typeof action.payload === 'string'
          ? action.payload
          : 'Could not identify animal. Please try a clearer nose image.';
      showAlert({
        title: 'Scan Failed',
        message: errMsg,
        type: 'error',
        confirmText: 'OK',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nose Scan</Text>
      </View>

      <View style={styles.body}>
        {!selectedImage ? (
          /* ── No image selected ─────────────────────────────────────── */
          <>
            <View style={styles.placeholderWrap}>
              <View style={styles.placeholderCircle}>
                <FontAwesome6 name="cow" size={56} color={color.Secondry} />
              </View>
              <Text style={styles.placeholderTitle}>Identify Animal by Nose</Text>
              <Text style={styles.placeholderHint}>
                Take a clear photo of the animal's nose or upload from gallery
              </Text>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.pickBtn} onPress={openCamera}>
                <MaterialIcons name="camera-alt" size={30} color="#fff" />
                <Text style={styles.pickBtnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickBtn, styles.pickBtnOutline]}
                onPress={openGallery}>
                <MaterialIcons
                  name="photo-library"
                  size={30}
                  color={color.Secondry}
                />
                <Text style={[styles.pickBtnText, {color: color.Secondry}]}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* ── Image selected ────────────────────────────────────────── */
          <>
            <View style={styles.previewWrap}>
              <Image
                source={{uri: selectedImage.uri}}
                style={styles.previewImg}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setSelectedImage(null)}>
                <MaterialIcons name="close" size={18} color="#fff" />
              </TouchableOpacity>
              <View style={styles.previewBadge}>
                <MaterialIcons name="center-focus-strong" size={14} color="#fff" />
                <Text style={styles.previewBadgeText}>Ready to scan</Text>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.pickBtn, styles.pickBtnOutline]}
                onPress={openCamera}>
                <MaterialIcons name="camera-alt" size={22} color={color.Secondry} />
                <Text style={[styles.pickBtnText, {color: color.Secondry}]}>
                  Retake
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickBtn, loading && styles.pickBtnDisabled]}
                disabled={loading}
                onPress={handleIdentify}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <MaterialIcons name="search" size={22} color="#fff" />
                )}
                <Text style={styles.pickBtnText}>
                  {loading ? 'Scanning…' : 'Identify'}
                </Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <Text style={styles.scanningHint}>
                Analyzing nose pattern, please wait…
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 22, color: '#fff', fontWeight: 'bold'},

  body: {flex: 1, paddingHorizontal: 24, justifyContent: 'center'},

  placeholderWrap: {alignItems: 'center', marginBottom: 44},
  placeholderCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },

  previewWrap: {
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
  },
  previewImg: {width: '100%', height: '100%'},
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  previewBadgeText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  btnRow: {flexDirection: 'row', gap: 14},
  pickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  pickBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: color.Secondry,
    elevation: 0,
  },
  pickBtnDisabled: {opacity: 0.6},
  pickBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},

  scanningHint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginTop: 16,
  },
});
