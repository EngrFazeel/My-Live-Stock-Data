import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { color } from '../../Color';
import { getProfile, updateProfile, clearAuthMessages } from '../../Redux/Slices/authSlice';
import { showAlert } from '../../Utils/SweetAlert';
import { IMAGE_BASE_URL } from '../../Config/BaseUrl';

export default function EditprofileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    cnic_no: '',
    address: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Load user profile on screen mount
  useEffect(() => {
    dispatch(getProfile());
  }, []);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        cnic_no: user.cnic_no || '',
        address: user.address || '',
      });
      if (user.profile_image) {
        setProfileImage(user.profile_image);
      }
    }
  }, [user]);

  // Show alerts based on Redux state
  useEffect(() => {
    if (error) {
      showAlert({
        title: 'Update Failed',
        message: error,
        type: 'error',
        confirmText: 'Try Again',
      });
      dispatch(clearAuthMessages());
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      showAlert({
        title: 'Success!',
        message: success,
        type: 'success',
        confirmText: 'OK',
        onConfirm: () => {
          navigation.goBack();
        },
      });
      dispatch(clearAuthMessages());
    }
  }, [success]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel) {
          // User cancelled
        } else if (response.errorCode) {
          showAlert({
            title: 'Error',
            message: 'Failed to pick image',
            type: 'error',
          });
        } else {
          const asset = response.assets[0];
          setProfileImage(asset);
          setImageChanged(true);
        }
      }
    );
  };

  const handleDiscard = () => {
    showAlert({
      title: 'Discard Changes',
      message: 'Are you sure you want to discard?',
      type: 'confirm',
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm: () => {
        // Reset form to original user data
        if (user) {
          setFormData({
            full_name: user.full_name || '',
            phone_number: user.phone_number || '',
            cnic_no: user.cnic_no || '',
            address: user.address || '',
          });
          setProfileImage(user.profile_image);
          setImageChanged(false);
        }
        navigation.goBack();
      },
    });
  };

  const handleSave = () => {
    // Validation
    if (!formData.full_name.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your full name',
        type: 'warning',
      });
      return;
    }

    if (!formData.phone_number.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your phone number',
        type: 'warning',
      });
      return;
    }

    if (!formData.cnic_no.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your CNIC number',
        type: 'warning',
      });
      return;
    }

    // Create FormData for multipart request
    const updateFormData = new FormData();
    updateFormData.append('full_name', formData.full_name);
    updateFormData.append('phone_number', formData.phone_number);
    updateFormData.append('cnic_no', formData.cnic_no);
    updateFormData.append('address', formData.address || '');

    // Add image if changed
    if (imageChanged && profileImage) {
      updateFormData.append('profile_image', {
        uri: profileImage.uri,
        type: profileImage.type || 'image/jpeg',
        name: profileImage.fileName || 'profile.jpg',
      });
    }

    dispatch(updateProfile(updateFormData));
  };

  const getImageSource = () => {
    if (profileImage) {
      if (typeof profileImage === 'string') {
        // URL from user object
        return { uri: `${IMAGE_BASE_URL}${profileImage}` };
      } else {
        // Local file object from image picker
        return { uri: profileImage.uri };
      }
    }
    return null;
  };

  if (loading && !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={color.Secondry} />
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
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.imageCircle}>
          {getImageSource() ? (
            <Image source={getImageSource()} style={styles.profileImage} />
          ) : (
            <Icon name="person" size={60} color="#fff" />
          )}
          <View style={styles.cameraIcon}>
            <Icon name="camera-alt" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={formData.full_name}
            onChangeText={(text) => handleInputChange('full_name', text)}
            placeholderTextColor="#999"
          />
          <Icon name="person" size={22} color={color.Secondry} />
        </View>

        {/* Phone */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={formData.phone_number}
            onChangeText={(text) => handleInputChange('phone_number', text)}
            placeholderTextColor="#999"
          />
          <Icon name="phone" size={22} color={color.Secondry} />
        </View>

        {/* CNIC */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="CNIC NO"
            style={styles.input}
            value={formData.cnic_no}
            onChangeText={(text) => handleInputChange('cnic_no', text)}
            placeholderTextColor="#999"
          />
          <Icon name="credit-card" size={22} color={color.Secondry} />
        </View>

        {/* Address */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            placeholderTextColor="#999"
          />
          <Icon name="location-on" size={22} color={color.Secondry} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard} disabled={loading}>
          <Text style={styles.btnText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.Secondry,
    padding: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 75,
  },

  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: color.Secondry,
    borderRadius: 15,
    padding: 5,
  },

  form: {
    paddingHorizontal: 20,
    flex: 1,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.Secondry,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    padding: 10,
    color: color.textcolor1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  discardBtn: {
    backgroundColor: 'red',
    paddingVertical: 12,
    width: '40%',
    borderRadius: 10,
  },

  saveBtn: {
    backgroundColor: color.Secondry,
    paddingVertical: 12,
    width: '40%',
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});