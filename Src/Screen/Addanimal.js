import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';

import {color} from '../Color';
import {
  addAnimal,
  updateAnimal,
  clearAnimalMessages,
} from '../Redux/Slices/animalSlice';
import {showAlert} from '../Utils/SweetAlert';
import {setAuthToken} from '../Services/ApiService';
import {resolveImageUrl} from '../Utils/imageHelper';

// Lazy-import image picker to avoid crash when native module is not linked
let launchImageLibrary = null;
try {
  launchImageLibrary = require('react-native-image-picker').launchImageLibrary;
} catch (_) {}

const GENDER_DATA = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

const CATEGORY_DATA = [
  {label: 'Cow', value: 'cow'},
  {label: 'Ox', value: 'ox'},
  {label: 'Buffalo', value: 'buffalo'},
  {label: 'Buffalo Female', value: 'buffalo_female'},
];

export default function AddAnimalScreen({navigation, route}) {
  const dispatch = useDispatch();
  const {accessToken} = useSelector(s => s.auth);
  const {loading, error, success} = useSelector(s => s.animals);

  // route.params.animal is set when navigating from Home for editing
  const editAnimal = route.params?.animal ?? null;
  const isEdit = !!editAnimal;

  // ─── Form state ───────────────────────────────────────────────────────────
  const [animalName, setAnimalName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [pickerDate, setPickerDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [animalImage, setAnimalImage] = useState(null); // { uri, type, fileName }
  const [noseScanImg, setNoseScanImg] = useState(null); // { uri, type, fileName }

  const successHandled = useRef(false);
  const errorHandled = useRef(false);

  // ─── On mount: re-assert token, clear stale messages ─────────────────────
  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
    }
    dispatch(clearAnimalMessages());
  }, [accessToken, dispatch]);

  // ─── Populate form when editing — intentionally mount-only so user edits are not reset ────
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    setAnimalName(editAnimal.animal_name || '');
    setBreed(editAnimal.breed || '');
    setAge(String(editAnimal.age ?? ''));
    setGender(editAnimal.gender || null);
    setCategory(editAnimal.category || null);
    if (editAnimal.registration_date) {
      setSelectedDate(editAnimal.registration_date);
      setPickerDate(new Date(editAnimal.registration_date));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Receive nose scan image back from Scansave/camera screen ────────────
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      if (route.params?.scanImage) {
        setNoseScanImg({
          uri: route.params.scanImage,
          type: 'image/jpeg',
          fileName: 'nose_scan.jpg',
        });
        navigation.setParams({scanImage: null});
      }
    });
    return unsub;
  }, [navigation, route.params]);

  // ─── Error alert ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error || errorHandled.current) {
      return;
    }
    errorHandled.current = true;
    showAlert({
      title: isEdit ? 'Update Failed' : 'Add Failed',
      message:
        typeof error === 'string'
          ? error
          : 'Something went wrong. Please try again.',
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => {
        dispatch(clearAnimalMessages());
        errorHandled.current = false;
      },
    });
  }, [error, dispatch, isEdit]);

  // ─── Success alert ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!success || successHandled.current) {
      return;
    }
    successHandled.current = true;
    showAlert({
      title: isEdit ? 'Updated!' : 'Animal Added!',
      message: success,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => {
        dispatch(clearAnimalMessages());
        navigation.goBack();
      },
    });
  }, [success, dispatch, isEdit, navigation]);

  // ─── Android gallery permission ───────────────────────────────────────────
  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const perm =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const already = await PermissionsAndroid.check(perm);
      if (already) {
        return true;
      }
      const result = await PermissionsAndroid.request(perm, {
        title: 'Photo Access',
        message: 'MyLiveStockData needs access to your gallery.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (_) {
      return false;
    }
  };

  // ─── Image picker ─────────────────────────────────────────────────────────
  const pickImage = async target => {
    if (!launchImageLibrary) {
      showAlert({
        title: 'Rebuild Required',
        message:
          'Image picker is not linked. Please run: npx react-native run-android',
        type: 'warning',
      });
      return;
    }
    const ok = await requestGalleryPermission();
    if (!ok) {
      showAlert({
        title: 'Permission Denied',
        message: 'Please allow photo access in your device settings.',
        type: 'warning',
      });
      return;
    }
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        maxHeight: 800,
        maxWidth: 800,
        includeBase64: false,
        selectionLimit: 1,
      });
      if (!res || res.didCancel) {
        return;
      }
      if (res.errorCode) {
        showAlert({
          title: 'Picker Error',
          message: res.errorMessage || 'Could not open gallery.',
          type: 'error',
        });
        return;
      }
      const asset = res.assets?.[0];
      if (!asset) {
        return;
      }
      const img = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `${target}.jpg`,
      };
      if (target === 'animal') {
        setAnimalImage(img);
      } else {
        setNoseScanImg(img);
      }
    } catch (_) {
      showAlert({
        title: 'Error',
        message: 'Could not open gallery.',
        type: 'error',
      });
    }
  };

  // ─── Discard ──────────────────────────────────────────────────────────────
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

  // ─── Save / Update ────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!animalName.trim()) {
      showAlert({
        title: 'Missing Field',
        message: 'Please enter animal name.',
        type: 'warning',
      });
      return;
    }
    if (!breed.trim()) {
      showAlert({
        title: 'Missing Field',
        message: 'Please enter breed.',
        type: 'warning',
      });
      return;
    }
    if (!age.trim() || isNaN(Number(age))) {
      showAlert({
        title: 'Missing Field',
        message: 'Please enter a valid age in months.',
        type: 'warning',
      });
      return;
    }
    if (!gender) {
      showAlert({
        title: 'Missing Field',
        message: 'Please select gender.',
        type: 'warning',
      });
      return;
    }
    if (!category) {
      showAlert({
        title: 'Missing Field',
        message: 'Please select category.',
        type: 'warning',
      });
      return;
    }
    if (!selectedDate) {
      showAlert({
        title: 'Missing Field',
        message: 'Please select registration date.',
        type: 'warning',
      });
      return;
    }

    if (accessToken) {
      setAuthToken(accessToken);
    }

    const formData = new FormData();
    formData.append('animal_name', animalName.trim());
    formData.append('breed', breed.trim());
    formData.append('age', parseInt(age, 10));
    formData.append('gender', gender);
    formData.append('category', category);
    formData.append('registration_date', selectedDate);

    if (animalImage) {
      formData.append('image', {
        uri: animalImage.uri,
        type: animalImage.type,
        name: animalImage.fileName,
      });
    }
    if (noseScanImg) {
      formData.append('nose_scan_image', {
        uri: noseScanImg.uri,
        type: noseScanImg.type,
        name: noseScanImg.fileName,
      });
    }

    successHandled.current = false;
    errorHandled.current = false;

    if (isEdit) {
      dispatch(updateAnimal({id: editAnimal.id, data: formData}));
    } else {
      dispatch(addAnimal(formData));
    }
  };

  // ─── Resolve display images ───────────────────────────────────────────────
  const animalImgSrc = animalImage
    ? {uri: animalImage.uri}
    : isEdit && editAnimal?.image
    ? {uri: resolveImageUrl(editAnimal.image)}
    : null;

  const noseSrc = noseScanImg
    ? {uri: noseScanImg.uri}
    : isEdit && editAnimal?.nose_scan?.scan_image
    ? {uri: resolveImageUrl(editAnimal.nose_scan.scan_image)}
    : null;

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Animal' : 'Add Animal'}
        </Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Animal photo */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            onPress={() => pickImage('animal')}
            style={styles.avatarCircle}>
            {animalImgSrc ? (
              <Image source={animalImgSrc} style={styles.avatarImg} />
            ) : (
              <MaterialIcons name="pets" size={52} color="#fff" />
            )}
            <View style={styles.cameraTag}>
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.tapText}>
            Tap to {isEdit ? 'change' : 'add'} animal photo
          </Text>
        </View>

        <View style={styles.form}>
          {/* Animal Name */}
          <Text style={styles.label}>Animal Name *</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter animal name"
              placeholderTextColor="#aaa"
              value={animalName}
              onChangeText={setAnimalName}
            />
            <MaterialIcons name="pets" size={22} color={color.Secondry} />
          </View>

          {/* Breed */}
          <Text style={styles.label}>Breed *</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter breed"
              placeholderTextColor="#aaa"
              value={breed}
              onChangeText={setBreed}
            />
            <MaterialCommunityIcons
              name="dna"
              size={22}
              color={color.Secondry}
            />
          </View>

          {/* Age in months */}
          <Text style={styles.label}>Age (months) *</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. 24"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={age}
              onChangeText={v => setAge(v.replace(/[^0-9]/g, ''))}
            />
            <Ionicons name="time-outline" size={22} color={color.Secondry} />
          </View>

          {/* Gender + Category side by side */}
          <View style={styles.rowWrap}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Gender *</Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select"
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelected}
                data={GENDER_DATA}
                labelField="label"
                valueField="value"
                value={gender}
                onChange={item => setGender(item.value)}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Category *</Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select"
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelected}
                data={CATEGORY_DATA}
                labelField="label"
                valueField="value"
                value={category}
                onChange={item => setCategory(item.value)}
              />
            </View>
          </View>

          {/* Registration Date */}
          <Text style={styles.label}>Registration Date *</Text>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowDate(true)}>
            <Text
              style={[
                styles.input,
                {paddingVertical: 12, color: selectedDate ? '#333' : '#aaa'},
              ]}>
              {selectedDate || 'Select date'}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={color.Secondry}
            />
          </TouchableOpacity>

          {/* Nose Scan Image */}
          <Text style={styles.label}>Nose Scan Image</Text>
          <TouchableOpacity
            style={styles.scanBox}
            onPress={() => pickImage('nose')}>
            {noseSrc ? (
              <Image
                source={noseSrc}
                style={{height: '100%', width: '100%', borderRadius: 10}}
              />
            ) : (
              <View style={{alignItems: 'center'}}>
                <MaterialCommunityIcons
                  name="line-scan"
                  size={52}
                  color={color.Secondry}
                />
                <Text style={styles.tapText}>Tap to pick from gallery</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Camera button for nose scan */}
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={() => navigation.navigate('Scansave')}>
            <MaterialIcons name="camera-alt" size={18} color="#fff" />
            <Text style={styles.cameraBtnText}>Use Camera for Nose Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.discardBtn]}
            onPress={handleDiscard}
            disabled={loading}>
            <Text style={styles.btnText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.saveBtn, loading && {opacity: 0.65}]}
            onPress={handleSave}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>{isEdit ? 'Update' : 'Save'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker modal */}
      <DatePicker
        modal
        open={showDate}
        date={pickerDate}
        mode="date"
        onConfirm={date => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          setSelectedDate(`${yyyy}-${mm}-${dd}`);
          setPickerDate(date);
          setShowDate(false);
        }}
        onCancel={() => setShowDate(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.Secondry,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: 'bold'},

  avatarWrap: {alignItems: 'center', marginVertical: 22},
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
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

  form: {paddingHorizontal: 20},
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    marginLeft: 2,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.Secondry,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  input: {flex: 1, fontSize: 15, color: '#333', paddingVertical: 10},

  rowWrap: {flexDirection: 'row', marginBottom: 14},
  dropdown: {
    borderWidth: 2,
    borderColor: color.Secondry,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
    backgroundColor: '#fff',
  },
  dropPlaceholder: {color: '#aaa', fontSize: 14},
  dropSelected: {color: '#333', fontSize: 14},

  scanBox: {
    height: 130,
    borderWidth: 2,
    borderColor: color.Secondry,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 10,
  },

  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 20,
  },
  cameraBtnText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  btn: {flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center'},
  discardBtn: {backgroundColor: '#e53935'},
  saveBtn: {backgroundColor: color.Secondry},
  btnText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});
