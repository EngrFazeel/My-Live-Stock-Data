import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import {color} from '../../Color';
import {fetchAnimals} from '../../Redux/Slices/animalSlice';
import {
  fetchAllUsers,
  createTransfer,
  clearTransferMessages,
} from '../../Redux/Slices/transferSlice';
import {showAlert} from '../../Utils/SweetAlert';

export default function SaleAnimalScreen({navigation}) {
  const dispatch = useDispatch();
  const {list: animals} = useSelector(s => s.animals);
  const {users, loading, usersLoading, error, success} =
    useSelector(s => s.transfer);
  const {user: currentUser} = useSelector(s => s.auth);

  // ── Form state ────────────────────────────────────────────────────────────
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);

  // ── Modal visibility ──────────────────────────────────────────────────────
  const [animalModalOpen, setAnimalModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // ── Load data on mount ────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAnimals(1));
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ── Success / error alerts ────────────────────────────────────────────────
  useEffect(() => {
    if (!success) {
      return;
    }
    showAlert({
      title: 'Success',
      message: success,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => dispatch(clearTransferMessages()),
    });
    resetForm();
  }, [success, dispatch]);

  useEffect(() => {
    if (!error) {
      return;
    }
    showAlert({
      title: 'Transfer Failed',
      message: typeof error === 'string' ? error : 'Could not complete the transfer.',
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => dispatch(clearTransferMessages()),
    });
  }, [error, dispatch]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setSelectedAnimal(null);
    setSelectedUser(null);
    setPhoneNumber('');
    setImage(null);
  };

  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  // ── Image picker ──────────────────────────────────────────────────────────
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
    const ok = await requestCameraPermission();
    if (!ok) {
      showAlert({title: 'Permission Denied', message: 'Camera access is required.', type: 'error', confirmText: 'OK'});
      return;
    }
    const result = await launchCamera({mediaType: 'photo', quality: 0.8});
    if (result.assets?.[0]) {
      setImage(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.8});
    if (result.assets?.[0]) {
      setImage(result.assets[0]);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!selectedAnimal) {
      showAlert({title: 'Missing Field', message: 'Please select an animal to transfer.', type: 'warning', confirmText: 'OK'});
      return;
    }
    if (!selectedUser) {
      showAlert({title: 'Missing Field', message: 'Please select the new owner.', type: 'warning', confirmText: 'OK'});
      return;
    }
    if (!phoneNumber.trim()) {
      showAlert({title: 'Missing Field', message: 'Please enter a phone number.', type: 'warning', confirmText: 'OK'});
      return;
    }

    showAlert({
      title: 'Confirm Transfer',
      message: `Transfer "${selectedAnimal.animal_name}" to ${selectedUser.full_name}?`,
      type: 'confirm',
      confirmText: 'Yes, Transfer',
      cancelText: 'Cancel',
      onConfirm: () => {
        const formData = new FormData();
        formData.append('animal', selectedAnimal.id);
        formData.append('to_user', selectedUser.id);
        formData.append('phone_number', phoneNumber.trim());
        formData.append('status', 'pending');
        if (image) {
          formData.append('image', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.fileName || 'transfer.jpg',
          });
        }
        dispatch(createTransfer(formData));
      },
    });
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sale Animal</Text>
        <View style={{width: 26}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* ── Transfer image ─────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Transfer Document / Image</Text>
        <View style={styles.imgPickerRow}>
          {image ? (
            <View style={styles.imgPreviewWrap}>
              <Image source={{uri: image.uri}} style={styles.imgPreview} />
              <TouchableOpacity
                style={styles.imgRemoveBtn}
                onPress={() => setImage(null)}>
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imgPlaceholder}>
              <MaterialIcons name="image" size={40} color="#bbb" />
              <Text style={styles.imgPlaceholderText}>No image selected</Text>
            </View>
          )}
          <View style={styles.imgBtnCol}>
            <TouchableOpacity style={styles.imgBtn} onPress={openCamera}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
              <Text style={styles.imgBtnText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imgBtn, styles.imgBtnAlt]} onPress={openGallery}>
              <MaterialIcons name="photo-library" size={20} color={color.Secondry} />
              <Text style={[styles.imgBtnText, {color: color.Secondry}]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Animal selector ────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Select Animal</Text>
        <TouchableOpacity
          style={styles.selectorRow}
          onPress={() => setAnimalModalOpen(true)}>
          {selectedAnimal ? (
            <View style={styles.selectorSelected}>
              <FontAwesome6 name="cow" size={18} color={color.Secondry} />
              <Text style={styles.selectorSelectedText} numberOfLines={1}>
                {selectedAnimal.animal_name}
              </Text>
              <Text style={styles.selectorMeta}>
                {selectedAnimal.category} · {selectedAnimal.age}m
              </Text>
            </View>
          ) : (
            <Text style={styles.selectorPlaceholder}>Tap to select animal…</Text>
          )}
          <MaterialIcons name="arrow-drop-down" size={26} color={color.Secondry} />
        </TouchableOpacity>

        {/* ── New owner selector ─────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Select New Owner</Text>
        <TouchableOpacity
          style={styles.selectorRow}
          onPress={() => setUserModalOpen(true)}>
          {selectedUser ? (
            <View style={styles.selectorSelected}>
              <MaterialIcons name="person" size={20} color={color.Secondry} />
              <Text style={styles.selectorSelectedText} numberOfLines={1}>
                {selectedUser.full_name}
              </Text>
              <Text style={styles.selectorMeta} numberOfLines={1}>
                {selectedUser.phone_number}
              </Text>
            </View>
          ) : (
            <Text style={styles.selectorPlaceholder}>
              {usersLoading ? 'Loading users…' : 'Tap to select new owner…'}
            </Text>
          )}
          {usersLoading ? (
            <ActivityIndicator size="small" color={color.Secondry} />
          ) : (
            <MaterialIcons name="arrow-drop-down" size={26} color={color.Secondry} />
          )}
        </TouchableOpacity>

        {/* ── Phone number ───────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Phone Number</Text>
        <View style={styles.inputRow}>
          <MaterialIcons name="phone" size={20} color={color.Secondry} />
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* ── Submit ─────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          disabled={loading}
          onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <MaterialIcons name="swap-horiz" size={22} color="#fff" />
          )}
          <Text style={styles.submitBtnText}>
            {loading ? 'Processing…' : 'Initiate Transfer'}
          </Text>
        </TouchableOpacity>

        {/* ── My Transfers button ────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.myTransfersBtn}
          onPress={() => navigation.navigate('MyTransfers')}>
          <MaterialIcons name="swap-horiz" size={22} color={color.Secondry} />
          <Text style={styles.myTransfersBtnText}>View My Transfers</Text>
          <MaterialIcons name="chevron-right" size={22} color={color.Secondry} />
        </TouchableOpacity>
      </ScrollView>

      {/* ── Animal picker modal ─────────────────────────────────────────────── */}
      <PickerModal
        visible={animalModalOpen}
        title="Select Animal"
        onClose={() => setAnimalModalOpen(false)}
        data={animals}
        keyExtractor={item => String(item.id)}
        renderItem={item => (
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {setSelectedAnimal(item); setAnimalModalOpen(false);}}>
            <FontAwesome6 name="cow" size={20} color={color.Secondry} style={{marginRight: 12}} />
            <View style={{flex: 1}}>
              <Text style={styles.modalItemTitle}>{item.animal_name}</Text>
              <Text style={styles.modalItemSub}>
                {item.category} · {item.gender} · {item.age} months
              </Text>
            </View>
            {selectedAnimal?.id === item.id && (
              <MaterialIcons name="check-circle" size={20} color={color.Secondry} />
            )}
          </TouchableOpacity>
        )}
      />

      {/* ── User picker modal ───────────────────────────────────────────────── */}
      <PickerModal
        visible={userModalOpen}
        title="Select New Owner"
        onClose={() => setUserModalOpen(false)}
        data={otherUsers}
        keyExtractor={item => String(item.id)}
        renderItem={item => (
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {setSelectedUser(item); setUserModalOpen(false);}}>
            <MaterialIcons name="person" size={22} color={color.Secondry} style={{marginRight: 12}} />
            <View style={{flex: 1}}>
              <Text style={styles.modalItemTitle}>{item.full_name}</Text>
              <Text style={styles.modalItemSub}>
                {item.phone_number} · {item.role_display}
              </Text>
            </View>
            {selectedUser?.id === item.id && (
              <MaterialIcons name="check-circle" size={20} color={color.Secondry} />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// ─── Reusable picker modal ────────────────────────────────────────────────────
function PickerModal({visible, title, onClose, data, keyExtractor, renderItem}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {data.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={styles.modalEmptyText}>No options available</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              renderItem={({item}) => renderItem(item)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 20}}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },

  scroll: {padding: 16, paddingBottom: 40},

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // ── Image picker ────────────────────────────────────────────────────────────
  imgPickerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  imgPlaceholder: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgPlaceholderText: {fontSize: 12, color: '#bbb', marginTop: 4},
  imgPreviewWrap: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imgPreview: {width: '100%', height: '100%'},
  imgRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBtnCol: {gap: 8},
  imgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    gap: 6,
  },
  imgBtnAlt: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: color.Secondry,
  },
  imgBtnText: {color: '#fff', fontWeight: '700', fontSize: 13},

  // ── Selector row ────────────────────────────────────────────────────────────
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 52,
  },
  selectorPlaceholder: {flex: 1, color: '#aaa', fontSize: 14},
  selectorSelected: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectorSelectedText: {fontWeight: '700', color: '#222', fontSize: 14, flex: 1},
  selectorMeta: {fontSize: 12, color: '#888'},

  // ── Phone input ─────────────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {flex: 1, fontSize: 14, color: '#222'},

  // ── Submit button ───────────────────────────────────────────────────────────
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Secondry,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    marginTop: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  submitBtnDisabled: {opacity: 0.6},
  submitBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},

  // ── My Transfers button ─────────────────────────────────────────────────────
  myTransfersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: color.Secondry,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    gap: 10,
    elevation: 1,
  },
  myTransfersBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: color.Secondry,
  },

  // ── Picker modal ────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {fontSize: 16, fontWeight: '700', color: '#222'},
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalItemTitle: {fontSize: 14, fontWeight: '700', color: '#222'},
  modalItemSub: {fontSize: 12, color: '#888', marginTop: 2},
  modalEmpty: {padding: 30, alignItems: 'center'},
  modalEmptyText: {color: '#aaa', fontSize: 14},
});
