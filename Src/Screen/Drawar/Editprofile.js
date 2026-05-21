import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { color } from '../../Color';
import { getProfile, updateProfile, clearAuthMessages } from '../../Redux/Slices/authSlice';
import { showAlert } from '../../Utils/SweetAlert';
import { IMAGE_BASE_URL } from '../../Config/BaseUrl';
import { setAuthToken } from '../../Services/ApiService';

// Lazy-import image picker to avoid crash when native module is null
let launchImageLibrary = null;
try {
  launchImageLibrary = require('react-native-image-picker').launchImageLibrary;
} catch (_) {}

export default function EditprofileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading, error, success, accessToken } =
    useSelector((s) => s.auth);

  const [form, setForm] = useState({
    full_name:    '',
    phone_number: '',
    cnic_no:      '',
    address:      '',
  });
  const [pickedImage,  setPickedImage]  = useState(null);
  const successHandled = useRef(false);

  // ─── On mount: re-assert token into Axios headers, then load profile ────
  useEffect(() => {
    if (accessToken) setAuthToken(accessToken);
    if (!user)       dispatch(getProfile());
  }, []);

  // ─── Sync form when Redux user data arrives ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    setForm({
      full_name:    user.full_name    || '',
      phone_number: user.phone_number || '',
      cnic_no:      user.cnic_no      || '',
      address:      user.address      || '',
    });
  }, [user]);

  // ─── Error alert ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    showAlert({
      title:       'Update Failed',
      message:     typeof error === 'string' ? error : 'Something went wrong. Please try again.',
      type:        'error',
      confirmText: 'OK',
      onConfirm:   () => dispatch(clearAuthMessages()),
    });
  }, [error]);

  // ─── Success alert ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!success || successHandled.current) return;
    successHandled.current = true;
    showAlert({
      title:       'Profile Updated!',
      message:     success,
      type:        'success',
      confirmText: 'OK',
      onConfirm:   () => {
        dispatch(clearAuthMessages());
        successHandled.current = false;
        navigation.goBack();
      },
    });
  }, [success]);

  // ─── Request Android storage permission ──────────────────────────────────
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      // Android 13+ uses READ_MEDIA_IMAGES; older versions use READ_EXTERNAL_STORAGE
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const already = await PermissionsAndroid.check(permission);
      if (already) return true;

      const result = await PermissionsAndroid.request(permission, {
        title:   'Photo Access',
        message: 'MyLiveStockData needs access to your gallery to update your profile photo.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (_) {
      return false;
    }
  };

  // ─── Image picker ─────────────────────────────────────────────────────────
  const handlePickImage = async () => {
    if (!launchImageLibrary) {
      showAlert({
        title:   'Rebuild Required',
        message: 'Image picker native module is not linked. Please run: npx react-native run-android',
        type:    'warning',
      });
      return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showAlert({
        title:   'Permission Denied',
        message: 'Please allow photo access in your device settings.',
        type:    'warning',
      });
      return;
    }

    try {
      // Use the Promise (await) form — the callback form swallows native-module
      // errors as unhandled rejections; await lets our catch block handle them.
      const response = await launchImageLibrary({
        mediaType:      'photo',
        maxHeight:      500,
        maxWidth:       500,
        includeBase64:  false,
        selectionLimit: 1,
      });

      if (!response || response.didCancel) return;

      if (response.errorCode) {
        showAlert({
          title:   'Picker Error',
          message: response.errorMessage || 'Could not open gallery.',
          type:    'error',
        });
        return;
      }

      const asset = response.assets?.[0];
      if (asset) setPickedImage(asset);

    } catch (e) {
      showAlert({
        title:   'Image Picker Error',
        message: 'Could not open gallery. Please rebuild the app or check permissions.',
        type:    'error',
      });
    }
  };

  // ─── Discard ──────────────────────────────────────────────────────────────
  const handleDiscard = () => {
    showAlert({
      title:       'Discard Changes',
      message:     'Are you sure you want to discard all changes?',
      type:        'confirm',
      confirmText: 'Yes, Discard',
      cancelText:  'Keep Editing',
      onConfirm:   () => navigation.goBack(),
    });
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.full_name.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your full name.', type: 'warning' });
      return;
    }
    if (!form.phone_number.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your phone number.', type: 'warning' });
      return;
    }
    if (!form.cnic_no.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your CNIC number.', type: 'warning' });
      return;
    }

    // Re-assert token into Axios headers (handles hot-reload header loss).
    // If the token is expired the interceptor in ApiService will silently
    // refresh it using the refresh token before this request fires.
    if (accessToken) setAuthToken(accessToken);

    const payload = new FormData();
    payload.append('full_name',    form.full_name.trim());
    payload.append('phone_number', form.phone_number.trim());
    payload.append('cnic_no',      form.cnic_no.trim());
    payload.append('address',      form.address.trim());

    if (pickedImage) {
      payload.append('profile_image', {
        uri:  pickedImage.uri,
        type: pickedImage.type || 'image/jpeg',
        name: pickedImage.fileName || 'profile.jpg',
      });
    }

    successHandled.current = false;
    dispatch(updateProfile(payload));
  };

  // ─── Avatar source ────────────────────────────────────────────────────────
  const avatarSource = () => {
    if (pickedImage)       return { uri: pickedImage.uri };
    if (user?.profile_image) return { uri: `${IMAGE_BASE_URL}${user.profile_image}` };
    return null;
  };
  const avatar = avatarSource();

  // ─── Full-screen loader while first fetch ─────────────────────────────────
  if (loading && !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={color.Secondry} />
        <Text style={{ color: color.Secondry, marginTop: 12 }}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarCircle}>
            {avatar ? (
              <Image source={avatar} style={styles.avatarImg} />
            ) : (
              <Icon name="person" size={62} color="#fff" />
            )}
            <View style={styles.cameraTag}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.tapText}>Tap to change photo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={form.full_name}
              onChangeText={(v) => setForm({ ...form, full_name: v })}
            />
            <Icon name="person" size={22} color={color.Secondry} />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={form.phone_number}
              onChangeText={(v) => setForm({ ...form, phone_number: v })}
            />
            <Icon name="phone" size={22} color={color.Secondry} />
          </View>

          <Text style={styles.label}>CNIC Number</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="CNIC Number"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              maxLength={13}
              value={form.cnic_no}
              onChangeText={(v) => setForm({ ...form, cnic_no: v })}
            />
            <Icon name="credit-card" size={22} color={color.Secondry} />
          </View>

          <Text style={styles.label}>Address</Text>
          <View style={[styles.inputRow, { alignItems: 'flex-start', paddingTop: 10 }]}>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Address"
              placeholderTextColor="#aaa"
              multiline
              value={form.address}
              onChangeText={(v) => setForm({ ...form, address: v })}
            />
            <Icon name="location-on" size={22} color={color.Secondry} style={{ marginTop: 2 }} />
          </View>

        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.discardBtn]}
            onPress={handleDiscard}
            disabled={loading}>
            <Text style={styles.btnText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.saveBtn, loading && { opacity: 0.65 }]}
            onPress={handleSave}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   color.Secondry,
    paddingHorizontal: 16,
    paddingVertical:   14,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  avatarWrap:   { alignItems: 'center', marginVertical: 24 },
  avatarCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: color.Secondry,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarImg:  { width: 110, height: 110, borderRadius: 55 },
  cameraTag:  {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: '#333', borderRadius: 14, padding: 5,
  },
  tapText: { marginTop: 8, color: '#888', fontSize: 13 },

  form:  { paddingHorizontal: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4, marginLeft: 4 },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: color.Secondry, borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 14,
  },
  input: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 10 },

  btnRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 20, gap: 12,
  },
  btn:        { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  discardBtn: { backgroundColor: '#e53935' },
  saveBtn:    { backgroundColor: color.Secondry },
  btnText:    { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
