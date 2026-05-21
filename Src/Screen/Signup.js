import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import { color } from '../Color';
import { signupUser, clearAuthMessages, logout } from '../Redux/Slices/authSlice';
import { showAlert } from '../Utils/SweetAlert';

const ROLES = [
  { label: 'Farmer',  value: 'farmer'  },
  { label: 'Breeder', value: 'breeder' },
  { label: 'Trader',  value: 'trader'  },
];

const EMPTY_FORM = {
  full_name:        '',
  email:            '',
  phone_number:     '',
  cnic_no:          '',
  address:          '',
  role:             'farmer',
  password:         '',
  confirm_password: '',
};

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((s) => s.auth);

  const [form,                setForm]                = useState(EMPTY_FORM);
  const [showPass,            setShowPass]            = useState(false);
  const [showConfirmPass,     setShowConfirmPass]     = useState(false);
  const successHandled = useRef(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // ─── Error alert ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    showAlert({
      title:       'Signup Failed',
      message:     typeof error === 'string' ? error : 'Something went wrong. Please try again.',
      type:        'error',
      confirmText: 'Try Again',
      onConfirm:   () => dispatch(clearAuthMessages()),
    });
  }, [error]);

  // ─── Success → show alert → go to Login ──────────────────────────────────
  useEffect(() => {
    if (!success || successHandled.current) return;
    successHandled.current = true;

    showAlert({
      title:       'Signup Successful!',
      message:     'Your account has been created.\nPlease login to continue.',
      type:        'success',
      confirmText: 'Go to Login',
      onConfirm:   () => {
        setForm(EMPTY_FORM);
        dispatch(logout());           // clears any auto-login tokens from signup
        dispatch(clearAuthMessages());
        successHandled.current = false;
        navigation.replace('Login');  // replace so back button won't return to Signup
      },
    });
  }, [success]);

  // ─── Validation + dispatch ────────────────────────────────────────────────
  const handleSignup = () => {
    const { full_name, email, phone_number, cnic_no, password, confirm_password } = form;

    if (!full_name.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your full name.', type: 'warning' });
      return;
    }
    if (!email.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your email address.', type: 'warning' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showAlert({ title: 'Invalid Email', message: 'Please enter a valid email address.', type: 'warning' });
      return;
    }
    if (!phone_number.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your phone number.', type: 'warning' });
      return;
    }
    if (!cnic_no.trim()) {
      showAlert({ title: 'Missing Field', message: 'Please enter your CNIC number.', type: 'warning' });
      return;
    }
    if (!password) {
      showAlert({ title: 'Missing Field', message: 'Please enter a password.', type: 'warning' });
      return;
    }
    if (password.length < 8) {
      showAlert({ title: 'Weak Password', message: 'Password must be at least 8 characters.', type: 'warning' });
      return;
    }
    if (password !== confirm_password) {
      showAlert({ title: 'Password Mismatch', message: 'Passwords do not match. Please re-enter.', type: 'warning' });
      return;
    }

    const payload = new FormData();
    payload.append('full_name',        full_name.trim());
    payload.append('email',            email.trim());
    payload.append('phone_number',     phone_number.trim());
    payload.append('cnic_no',          cnic_no.trim());
    payload.append('address',          form.address.trim());
    payload.append('role',             form.role);
    payload.append('password',         password);
    payload.append('confirm_password', confirm_password);

    successHandled.current = false;
    dispatch(signupUser(payload));
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: color.textcolor2 }}>
      <StatusBar backgroundColor={color.StatusBar} />

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image
            source={require('../Assets/Logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>SignUp</Text>
        </View>

        {/* Fields */}
        <View style={styles.fieldWrap}>

          <Field icon="user" placeholder="Full Name"
            value={form.full_name} onChangeText={(v) => set('full_name', v)} />

          <Field icon="mail" placeholder="Email Address"
            keyboardType="email-address"
            value={form.email} onChangeText={(v) => set('email', v)} />

          <Field icon="phone" placeholder="Phone Number"
            keyboardType="phone-pad"
            value={form.phone_number} onChangeText={(v) => set('phone_number', v)} />

          <Field icon="credit-card" placeholder="CNIC Number"
            keyboardType="numeric" maxLength={13}
            value={form.cnic_no} onChangeText={(v) => set('cnic_no', v)} />

          <Field icon="map-pin" placeholder="Address"
            value={form.address} onChangeText={(v) => set('address', v)} />

          {/* Role dropdown */}
          <View style={styles.dropdownWrap}>
            <Dropdown
              style={styles.dropdown}
              data={ROLES}
              labelField="label"
              valueField="value"
              value={form.role}
              placeholder="Select Role"
              placeholderStyle={{ color: '#999', fontSize: 16 }}
              selectedTextStyle={{ color: color.textcolor1, fontSize: 16 }}
              onChange={(item) => set('role', item.value)}
            />
            <Feather name="users" size={22} color={color.Secondry} style={{ marginRight: 4 }} />
          </View>

          {/* Password */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPass}
              cursorColor={color.Secondry}
              value={form.password}
              onChangeText={(v) => set('password', v)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather name={showPass ? 'eye' : 'eye-off'} size={22} color={color.Secondry} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputText}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPass}
              cursorColor={color.Secondry}
              value={form.confirm_password}
              onChangeText={(v) => set('confirm_password', v)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
              <Feather name={showConfirmPass ? 'eye' : 'eye-off'} size={22} color={color.Secondry} />
            </TouchableOpacity>
          </View>

        </View>

        {/* Signup button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={[styles.signupBtn, loading && { opacity: 0.65 }]}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.signupBtnText}>SignUp</Text>
          )}
        </TouchableOpacity>

        {/* Already have account */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Reusable field component ────────────────────────────────────────────────

function Field({ icon, placeholder, value, onChangeText, keyboardType, maxLength }) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        cursorColor={color.Secondry}
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
      />
      <Feather name={icon} size={22} color={color.Secondry} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  logoWrap: {
    height:         240,
    justifyContent: 'center',
    alignItems:     'center',
  },
  logo: {
    height:       170,
    width:        170,
    borderRadius: 200,
  },
  title: {
    fontSize:   26,
    fontWeight: '900',
    color:      color.Secondry,
    marginTop:  10,
  },

  fieldWrap: {
    width:      '90%',
    alignSelf:  'center',
    marginBottom: 8,
    gap:        12,
  },

  inputRow: {
    height:            50,
    borderColor:       color.Secondry,
    borderWidth:       2,
    borderRadius:      color.borderradius,
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 12,
    backgroundColor:   '#fff',
  },
  inputText: {
    flex:     1,
    fontSize: 16,
    color:    color.textcolor1,
    height:   50,
  },

  dropdownWrap: {
    height:            50,
    borderColor:       color.Secondry,
    borderWidth:       2,
    borderRadius:      color.borderradius,
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 12,
    backgroundColor:   '#fff',
  },
  dropdown: {
    flex: 1,
  },

  signupBtn: {
    height:          50,
    width:           '80%',
    borderRadius:    color.borderradius,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: color.Secondry,
    alignSelf:       'center',
    marginTop:       12,
  },
  signupBtnText: {
    fontSize:   20,
    fontWeight: '800',
    color:      '#fff',
  },

  loginRow: {
    marginTop:      24,
    marginBottom:   30,
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
  },
  loginText: {
    color:      'black',
    fontSize:   17,
    fontWeight: '500',
  },
  loginLink: {
    color:      color.Secondry,
    fontSize:   18,
    fontWeight: '700',
  },
});
