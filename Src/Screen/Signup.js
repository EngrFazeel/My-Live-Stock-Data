import React, { useState, useEffect } from 'react';
import { Image, StatusBar, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { color } from '../Color';
import { signupUser, clearAuthMessages } from '../Redux/Slices/authSlice';
import { showAlert } from '../Utils/SweetAlert';

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error, success, accessToken } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    cnic_no: '',
    address: '',
    role: 'farmer',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Show alerts based on Redux state
  useEffect(() => {
    if (error) {
      showAlert({
        title: 'Signup Failed',
        message: error,
        type: 'error',
        confirmText: 'Try Again',
      });
      dispatch(clearAuthMessages());
    }
  }, [error]);

  useEffect(() => {
    if (success && accessToken) {
      showAlert({
        title: 'Success!',
        message: success,
        type: 'success',
        confirmText: 'OK',
        onConfirm: () => {
          // Clear form after successful signup
          setFormData({
            full_name: '',
            email: '',
            phone_number: '',
            cnic_no: '',
            address: '',
            role: 'farmer',
            password: '',
            confirm_password: '',
          });
          // Navigate to Login screen
          navigation.replace('Login');
        },
      });
      dispatch(clearAuthMessages());
    }
  }, [success, accessToken, navigation]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = () => {
    // Validation
    const { full_name, email, phone_number, cnic_no, password, confirm_password } = formData;

    if (!full_name.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your full name',
        type: 'warning',
      });
      return;
    }

    if (!email.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your email',
        type: 'warning',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter a valid email address',
        type: 'warning',
      });
      return;
    }

    if (!phone_number.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your phone number',
        type: 'warning',
      });
      return;
    }

    if (!cnic_no.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your CNIC number',
        type: 'warning',
      });
      return;
    }

    if (!password) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter a password',
        type: 'warning',
      });
      return;
    }

    if (password.length < 8) {
      showAlert({
        title: 'Validation Error',
        message: 'Password must be at least 8 characters long',
        type: 'warning',
      });
      return;
    }

    if (password !== confirm_password) {
      showAlert({
        title: 'Validation Error',
        message: 'Passwords do not match',
        type: 'warning',
      });
      return;
    }

    // Create FormData for multipart request
    const signupFormData = new FormData();
    signupFormData.append('full_name', full_name);
    signupFormData.append('email', email);
    signupFormData.append('phone_number', phone_number);
    signupFormData.append('cnic_no', cnic_no);
    signupFormData.append('address', formData.address);
    signupFormData.append('role', formData.role);
    signupFormData.append('password', password);
    signupFormData.append('confirm_password', confirm_password);

    // Dispatch signup action
    dispatch(signupUser(signupFormData));
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.textcolor2 }}>
      <StatusBar backgroundColor={color.StatusBar} />
      <ScrollView>
        {/* Logo Section */}
        <View
          style={{
            height: 250,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../Assets/Logo.png')}
            style={{
              height: 170,
              width: 170,
              borderRadius: 200,
            }}
          />
          <Text
            style={{
              fontSize: 26,
              fontWeight: '900',
              color: color.Secondry,
              marginTop: 10,
            }}>
            SignUp
          </Text>
        </View>

        {/* Form Fields */}
        <View
          style={{
            width: '90%',
            justifyContent: 'space-around',
            alignSelf: 'center',
            marginBottom: 20,
          }}>
          {/* Full Name */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="Full Name"
              placeholderTextColor={'#999'}
              cursorColor={color.Secondry}
              value={formData.full_name}
              onChangeText={(text) => handleInputChange('full_name', text)}
            />
            <Feather name="user" size={25} marginLeft={-5} color={color.Secondry} />
          </View>

          {/* Email */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="Email"
              placeholderTextColor={'#999'}
              keyboardType="email-address"
              cursorColor={color.Secondry}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            <Feather name="mail" size={25} marginLeft={-5} color={color.Secondry} />
          </View>

          {/* Phone Number */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="Phone Number"
              placeholderTextColor={'#999'}
              keyboardType="phone-pad"
              cursorColor={color.Secondry}
              value={formData.phone_number}
              onChangeText={(text) => handleInputChange('phone_number', text)}
            />
            <Feather name="phone" size={25} marginLeft={-5} color={color.Secondry} />
          </View>

          {/* CNIC */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="CNIC Number"
              placeholderTextColor={'#999'}
              cursorColor={color.Secondry}
              value={formData.cnic_no}
              onChangeText={(text) => handleInputChange('cnic_no', text)}
            />
            <Feather name="credit-card" size={25} marginLeft={-5} color={color.Secondry} />
          </View>

          {/* Address */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="Address"
              placeholderTextColor={'#999'}
              cursorColor={color.Secondry}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
            <Feather name="map-pin" size={25} marginLeft={-5} color={color.Secondry} />
          </View>

          {/* Role */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}>
            <Picker
              selectedValue={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              style={{ 
                height: 50,
                color: color.textcolor1,
                fontSize: 16,
              }}>
              <Picker.Item label="Farmer" value="farmer" />
              <Picker.Item label="Breeder" value="breeder" />
              <Picker.Item label="Trader" value="trader" />
            </Picker>
          </View>

          {/* Password */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="Password"
              placeholderTextColor={'#999'}
              secureTextEntry={!showPassword}
              cursorColor={color.Secondry}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={25} marginLeft={-5} color={color.Secondry} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View
            style={{
              height: 50,
              marginBottom: 12,
              borderColor: color.borderColor,
              borderWidth: 2,
              borderRadius: color.borderradius,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '400',
                height: 55,
                width: '88%',
                color: color.textcolor1,
                paddingLeft: 10,
              }}
              placeholder="Confirm Password"
              placeholderTextColor={'#999'}
              secureTextEntry={!showConfirmPassword}
              cursorColor={color.Secondry}
              value={formData.confirm_password}
              onChangeText={(text) => handleInputChange('confirm_password', text)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={25} marginLeft={-5} color={color.Secondry} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={{
            height: 50,
            width: '80%',
            borderRadius: color.borderradius,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.Secondry,
            alignSelf: 'center',
            marginTop: 15,
            opacity: loading ? 0.6 : 1,
          }}>
          {loading ? (
            <ActivityIndicator size="large" color={color.textcolor2} />
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: color.textcolor2,
                textAlign: 'center',
              }}>
              SignUp
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View
          style={{
            marginTop: 30,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontWeight: '500',
            }}>
            Already have an Account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: color.Secondry,
                fontSize: 20,
                marginTop: -3,
                fontWeight: '700',
              }}>
              {' '}
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}