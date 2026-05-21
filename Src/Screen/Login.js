import React, { useState, useEffect } from 'react';
import { Image, StatusBar, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from '../Color';
import { loginUser, clearAuthMessages } from '../Redux/Slices/authSlice';
import { showAlert } from '../Utils/SweetAlert';
import { setAuthToken } from '../Services/ApiService';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { loading, error, success, accessToken, user } = auth;
  const [isNavigating, setIsNavigating] = useState(false);

  const [cnic_no, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle errors
  useEffect(() => {
    if (error) {
      showAlert({
        title: 'Login Failed',
        message: error,
        type: 'error',
        confirmText: 'Try Again',
      });
      dispatch(clearAuthMessages());
    }
  }, [error, dispatch]);

  // Handle success - navigate to Home
  useEffect(() => {
    if (success && accessToken && !isNavigating) {
      setIsNavigating(true);
      
      showAlert({
        title: 'Success!',
        message: success,
        type: 'success',
        confirmText: 'OK',
        onConfirm: async () => {
          try {
            // Validate required data before storing
            if (!accessToken || typeof accessToken !== 'string') {
              throw new Error('Invalid access token');
            }

            if (!user || typeof user !== 'object') {
              throw new Error('Invalid user data');
            }

            // Prepare user data to store
            const userData = {
              user: user,
              accessToken: accessToken,
              refreshToken: auth.refreshToken || null,
              cnic_no: cnic_no || '',
              loginTime: new Date().toISOString(),
            };
            
            // Convert to JSON and validate
            const userDataJson = JSON.stringify(userData);
            const refreshTokenStr = auth.refreshToken && typeof auth.refreshToken === 'string' 
              ? auth.refreshToken 
              : '';

            // Validate all strings before saving
            const storageData = [
              ['authToken', accessToken],
              ['refreshToken', refreshTokenStr],
              ['userData', userDataJson],
            ];

            // Ensure all values are strings
            for (const [key, value] of storageData) {
              if (typeof value !== 'string') {
                throw new Error(`Invalid data type for ${key}: expected string, got ${typeof value}`);
              }
            }

            // Save to AsyncStorage with error details
            await AsyncStorage.multiSet(storageData);
            
            console.log('Login data saved successfully to AsyncStorage');

            // Set token in API headers for future requests
            setAuthToken(accessToken);
            
            // Clear form after successful login
            setCnic('');
            setPassword('');
            // Clear Redux messages
            dispatch(clearAuthMessages());
            // Navigate to Home screen
            setTimeout(() => {
              navigation.replace('Home');
            }, 300);
          } catch (error) {
            console.error('AsyncStorage Error Details:', {
              errorMessage: error?.message,
              errorCode: error?.code,
              accessToken: !!accessToken,
              user: !!user,
              refreshToken: !!auth.refreshToken,
            });
            showAlert({
              title: 'Storage Error',
              message: error?.message || 'Failed to save login data. Please try again.',
              type: 'error',
              confirmText: 'OK',
              onConfirm: () => {
                setIsNavigating(false);
              },
            });
          }
        },
      });
    }
  }, [success, accessToken, isNavigating, navigation, dispatch, cnic_no, user, auth]);

  const handleLogin = () => {
    // Validation
    if (!cnic_no.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your CNIC number',
        type: 'warning',
      });
      return;
    }
    if (!password.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please enter your password',
        type: 'warning',
      });
      return;
    }

    // Dispatch login action
    dispatch(loginUser({ cnic_no, password }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.textcolor2 }}>
      <StatusBar backgroundColor={color.StatusBar} />
      <ScrollView>
        {/* Logo Section */}
        <View
          style={{
            height: 280,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../Assets/Logo.png')}
            style={{
              height: 200,
              width: 200,
              borderRadius: 200,
            }}
          />
          <Text
            style={{
              fontSize: 26,
              marginTop: 10,
              fontWeight: '900',
              color: color.Secondry,
            }}>
            Login
          </Text>
        </View>

        {/* Input Fields */}
        <View
          style={{
            height: 180,
            width: '90%',
            justifyContent: 'space-around',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {/* CNIC Input */}
          <View
            style={{
              height: 50,
              width: '90%',
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
              value={cnic_no}
              onChangeText={setCnic}
            />
            <Feather name="credit-card" size={25} marginLeft={-5} color={color.Secondry} />
          </View>

          {/* Password Input */}
          <View
            style={{
              height: 50,
              width: '90%',
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
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={25} marginLeft={-5} color={color.Secondry} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '400',
                color: color.Secondry,
                textAlign: 'right',
                marginRight: -140,
                marginTop: -20,
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
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
              Login
            </Text>
          )}
        </TouchableOpacity>

        {/* Signup Link */}
        <View
          style={{
            marginTop: 30,
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
            Create New Account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                color: color.Secondry,
                fontSize: 20,
                marginTop: -3,
                fontWeight: '700',
              }}>
              {' '}
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}