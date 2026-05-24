import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {color} from '../../Color';
import {
  getProfile,
  updateProfile,
  clearAuthMessages,
} from '../../Redux/Slices/authSlice';
import {showAlert} from '../../Utils/SweetAlert';
import {setAuthToken} from '../../Services/ApiService';
import {resolveImageUrl} from '../../Utils/imageHelper';

export default function EditprofileScreen({navigation}) {
  const dispatch = useDispatch();
  const {user, loading, error, success, accessToken} = useSelector(
    s => s.auth,
  );

  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    address: '',
  });
  const [pickedImage, setPickedImage] = useState(null);
  const [imgModalOpen, setImgModalOpen] = useState(false);

  // ── On mount: clear stale messages, assert token, load profile ────────────
  useEffect(() => {
    dispatch(clearAuthMessages());
    if (accessToken) {
      setAuthToken(accessToken);
    }
    if (!user) {
      dispatch(getProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Populate form when user data arrives ───────────────────────────────────
  useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      full_name: user.full_name || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
    });
  }, [user]);

  // ── Error ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) {
      return;
    }
    const isExpired =
      typeof error === 'string' &&
      error.toLowerCase().includes('session expired');
    showAlert({
      title: isExpired ? 'Session Expired' : 'Update Failed',
      message: isExpired
        ? 'Your session has expired. Please log in again.'
        : typeof error === 'string'
        ? error
        : 'Something went wrong. Please try again.',
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => {
        dispatch(clearAuthMessages());
        if (isExpired) {
          navigation.replace('Login');
        }
      },
    });
  }, [error, dispatch, navigation]);

  // ── Success ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!success) {
      return;
    }
    showAlert({
      title: 'Profile Updated!',
      message: success,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => {
        dispatch(clearAuthMessages());
        navigation.goBack();
      },
    });
  }, [success, dispatch, navigation]);

  // ── Permissions ───────────────────────────────────────────────────────────
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  // ── Image picker ──────────────────────────────────────────────────────────
  const openCamera = async () => {
    setImgModalOpen(false);
    const ok = await requestCameraPermission();
    if (!ok) {
      showAlert({
        title: 'Permission Denied',
        message: 'Camera permission is required.',
        type: 'error',
        confirmText: 'OK',
      });
      return;
    }
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 600,
      maxHeight: 600,
    });
    if (result.assets?.[0]) {
      setPickedImage(result.assets[0]);
    }
  };

  const openGallery = async () => {
    setImgModalOpen(false);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 600,
      maxHeight: 600,
      selectionLimit: 1,
    });
    if (result.assets?.[0]) {
      setPickedImage(result.assets[0]);
    }
  };

  // ── Discard ───────────────────────────────────────────────────────────────
  const handleDiscard = () => {
    showAlert({
      title: 'Discard Changes',
      message: 'Are you sure you want to discard all changes?',
      type: 'confirm',
      confirmText: 'Yes, Discard',
      cancelText: 'Keep Editing',
      onConfirm: () => navigation.goBack(),
    });
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.full_name.trim()) {
      showAlert({
        title: 'Missing Field',
        message: 'Please enter your full name.',
        type: 'warning',
        confirmText: 'OK',
      });
      return;
    }
    if (!form.phone_number.trim()) {
      showAlert({
        title: 'Missing Field',
        message: 'Please enter your phone number.',
        type: 'warning',
        confirmText: 'OK',
      });
      return;
    }

    if (accessToken) {
      setAuthToken(accessToken);
    }

    // Always use FormData so the backend receives multipart (required when
    // profile_image is included; accepted either way).
    const payload = new FormData();
    payload.append('full_name', form.full_name.trim());
    payload.append('phone_number', form.phone_number.trim());
    payload.append('address', form.address.trim());
    if (pickedImage) {
      payload.append('profile_image', {
        uri: pickedImage.uri,
        type: pickedImage.type || 'image/jpeg',
        name: pickedImage.fileName || 'profile.jpg',
      });
    }

    dispatch(updateProfile(payload));
  };

  // ── Avatar source ─────────────────────────────────────────────────────────
  const avatar = pickedImage
    ? {uri: pickedImage.uri}
    : user?.profile_image
    ? {uri: resolveImageUrl(user.profile_image)}
    : null;

  // ── Full-screen loader on first fetch ─────────────────────────────────────
  if (loading && !user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={color.Secondry} />
        <Text style={styles.loaderText}>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{width: 26}} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setImgModalOpen(true)}>
            {avatar ? (
              <Image source={avatar} style={styles.avatarImg} />
            ) : (
              <MaterialIcons name="person" size={62} color="#fff" />
            )}
            <View style={styles.cameraTag}>
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.tapText}>Tap to change photo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="person" size={20} color={color.Secondry} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={form.full_name}
              onChangeText={v => setForm({...form, full_name: v})}
            />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="phone" size={20} color={color.Secondry} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={form.phone_number}
              onChangeText={v => setForm({...form, phone_number: v})}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputRow, styles.readOnlyRow]}>
            <MaterialIcons name="email" size={20} color="#bbb" style={styles.inputIcon} />
            <Text style={[styles.input, styles.readOnlyText]}>
              {user?.email || '—'}
            </Text>
          </View>

          <Text style={styles.label}>CNIC Number</Text>
          <View style={[styles.inputRow, styles.readOnlyRow]}>
            <MaterialIcons name="credit-card" size={20} color="#bbb" style={styles.inputIcon} />
            <Text style={[styles.input, styles.readOnlyText]}>
              {user?.cnic_no || '—'}
            </Text>
          </View>

          <Text style={styles.label}>Address</Text>
          <View style={[styles.inputRow, {alignItems: 'flex-start', paddingTop: 10}]}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={color.Secondry}
              style={[styles.inputIcon, {marginTop: 2}]}
            />
            <TextInput
              style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
              placeholder="Address"
              placeholderTextColor="#aaa"
              multiline
              value={form.address}
              onChangeText={v => setForm({...form, address: v})}
            />
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
            style={[styles.btn, styles.saveBtn, loading && styles.btnDisabled]}
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

      {/* Image source modal */}
      <Modal
        visible={imgModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setImgModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Change Profile Photo</Text>

            <TouchableOpacity style={styles.modalOption} onPress={openCamera}>
              <MaterialIcons name="camera-alt" size={24} color={color.Secondry} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={openGallery}>
              <MaterialIcons name="photo-library" size={24} color={color.Secondry} />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {pickedImage && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {setPickedImage(null); setImgModalOpen(false);}}>
                <MaterialIcons name="delete-outline" size={24} color="#e53935" />
                <Text style={[styles.modalOptionText, {color: '#e53935'}]}>
                  Remove Photo
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setImgModalOpen(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  centered: {justifyContent: 'center', alignItems: 'center'},
  loaderText: {color: color.Secondry, marginTop: 12},

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.Secondry,
    paddingHorizontal: 16,
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: 'bold'},

  scroll: {paddingBottom: 30},

  // ── Avatar ──────────────────────────────────────────────────────────────────
  avatarWrap: {alignItems: 'center', marginVertical: 24},
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  avatarImg: {width: 110, height: 110, borderRadius: 55},
  cameraTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#333',
    borderRadius: 14,
    padding: 5,
  },
  tapText: {marginTop: 8, color: '#888', fontSize: 13},

  // ── Form ────────────────────────────────────────────────────────────────────
  form: {paddingHorizontal: 20},
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: color.Secondry,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
  },
  inputIcon: {marginRight: 10},
  input: {flex: 1, fontSize: 15, color: '#333', paddingVertical: 12},
  readOnlyRow: {borderColor: '#e0e0e0', backgroundColor: '#f9f9f9', elevation: 0},
  readOnlyText: {color: '#aaa'},

  // ── Buttons ─────────────────────────────────────────────────────────────────
  btnRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  discardBtn: {backgroundColor: '#e53935'},
  saveBtn: {backgroundColor: color.Secondry},
  btnDisabled: {opacity: 0.65},
  btnText: {color: '#fff', fontWeight: 'bold', fontSize: 16},

  // ── Photo modal ─────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalOptionText: {fontSize: 15, fontWeight: '600', color: '#222'},
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  modalCancelText: {fontSize: 15, color: '#888', fontWeight: '600'},
});
