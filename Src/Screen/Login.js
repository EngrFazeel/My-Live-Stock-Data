import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
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
  const { loading, error, success, accessToken, refreshToken, user } =
    useSelector((s) => s.auth);

  const [cnic_no, setCnic]           = useState('');
  const [password, setPassword]      = useState('');
  const [showPassword, setShowPass]  = useState(false);

  // Prevents double-firing if success re-renders before navigation completes
  const successHandled = useRef(false);

  // ─── Error alert ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    showAlert({
      title:       'Login Failed',
      message:     typeof error === 'string' ? error : 'An error occurred. Please try again.',
      type:        'error',
      confirmText: 'Try Again',
      onConfirm:   () => dispatch(clearAuthMessages()),
    });
  }, [error]);

  // ─── Success: persist tokens first, then navigate ────────────────────────
  useEffect(() => {
    if (!success || successHandled.current) return;
    successHandled.current = true;

    const persistAndNavigate = async () => {
      // Best-effort storage — coerce to string, never throw
      try {
        const tokenStr   = accessToken  ? String(accessToken)  : '';
        const refreshStr = refreshToken ? String(refreshToken) : '';
        const userStr    = user         ? JSON.stringify(user) : '{}';

        if (tokenStr) {
          setAuthToken(tokenStr);
          await AsyncStorage.multiSet([
            ['authToken',    tokenStr],
            ['refreshToken', refreshStr],
            ['userData',     userStr],
          ]);
        }
      } catch (e) {
        // Storage failure is non-fatal — user can still use the app
        console.warn('AsyncStorage save failed:', e.message);
      }

      // Clear redux messages and reset form
      dispatch(clearAuthMessages());
      setCnic('');
      setPassword('');

      // Show success alert then navigate
      showAlert({
        title:       'Welcome!',
        message:     'Login successful!',
        type:        'success',
        confirmText: 'Continue',
        onConfirm:   () => navigation.replace('Home'),
      });
    };

    persistAndNavigate();
  }, [success]);

  // ─── Validation + dispatch ────────────────────────────────────────────────
  const handleLogin = () => {
    if (!cnic_no.trim()) {
      showAlert({
        title:   'Missing Field',
        message: 'Please enter your CNIC number.',
        type:    'warning',
      });
      return;
    }
    if (!password.trim()) {
      showAlert({
        title:   'Missing Field',
        message: 'Please enter your password.',
        type:    'warning',
      });
      return;
    }
    successHandled.current = false; // allow a fresh success cycle
    dispatch(loginUser({ cnic_no: cnic_no.trim(), password }));
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: color.textcolor2 }}>
      <StatusBar backgroundColor={color.StatusBar} />

      <ScrollView keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={{ height: 280, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../Assets/Logo.png')}
            style={{ height: 200, width: 200, borderRadius: 200 }}
          />
          <Text
            style={{
              fontSize:   26,
              marginTop:  10,
              fontWeight: '900',
              color:      color.Secondry,
            }}>
            Login
          </Text>
        </View>

        {/* Inputs */}
        <View
          style={{
            width:          '90%',
            alignSelf:      'center',
            gap:            14,
            paddingBottom:  10,
          }}>

          {/* CNIC */}
          <View style={inputRow}>
            <TextInput
              style={inputText}
              placeholder="CNIC Number"
              placeholderTextColor="#999"
              cursorColor={color.Secondry}
              value={cnic_no}
              onChangeText={setCnic}
              keyboardType="numeric"
              maxLength={13}
            />
            <Feather name="credit-card" size={22} color={color.Secondry} />
          </View>

          {/* Password */}
          <View style={inputRow}>
            <TextInput
              style={inputText}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              cursorColor={color.Secondry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color={color.Secondry}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
            <Text style={{ color: color.Secondry, fontSize: 15, fontWeight: '500' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            height:          50,
            width:           '80%',
            borderRadius:    color.borderradius,
            justifyContent:  'center',
            alignItems:      'center',
            backgroundColor: color.Secondry,
            alignSelf:       'center',
            marginTop:       10,
            opacity:         loading ? 0.65 : 1,
          }}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>
              Login
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign-up link */}
        <View
          style={{
            marginTop:      30,
            flexDirection:  'row',
            justifyContent: 'center',
            alignItems:     'center',
            marginBottom:   30,
          }}>
          <Text style={{ color: 'black', fontSize: 17, fontWeight: '500' }}>
            Create New Account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                color:      color.Secondry,
                fontSize:   18,
                fontWeight: '700',
                marginLeft: 6,
              }}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Shared micro-styles ─────────────────────────────────────────────────────

const inputRow = {
  height:          50,
  width:           '100%',
  borderColor:     '#3dac40',
  borderWidth:     2,
  borderRadius:    15,
  flexDirection:   'row',
  alignItems:      'center',
  paddingHorizontal: 12,
};

const inputText = {
  flex:       1,
  fontSize:   16,
  color:      '#3dac40',
  height:     50,
};
