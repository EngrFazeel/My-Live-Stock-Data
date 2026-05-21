import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { color } from '../Color';
import { getProfile, clearAuthMessages } from '../Redux/Slices/authSlice';
import { showAlert } from '../Utils/SweetAlert';
import { setAuthToken } from '../Services/ApiService';
import { IMAGE_BASE_URL } from '../Config/BaseUrl';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading, error, accessToken } = useSelector((s) => s.auth);

  const errorHandled = useRef(false);

  // ─── On mount: assert token then load profile ─────────────────────────────
  useEffect(() => {
    if (accessToken) setAuthToken(accessToken);
    if (!user)       dispatch(getProfile());
  }, []);

  // ─── Error handling ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!error || errorHandled.current) return;
    errorHandled.current = true;

    showAlert({
      title:       'Error',
      message:     typeof error === 'string' ? error : 'Failed to load profile. Please try again.',
      type:        'error',
      confirmText: 'OK',
      onConfirm:   () => {
        dispatch(clearAuthMessages());
        errorHandled.current = false;
      },
    });
  }, [error]);

  // ─── Full-screen loader ───────────────────────────────────────────────────
  if (loading && !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={color.Secondry} />
        <Text style={{ marginTop: 12, color: color.Secondry, fontSize: 16 }}>
          Loading profile…
        </Text>
      </View>
    );
  }

  // ─── No data state ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="person-off" size={70} color="#ccc" />
        <Text style={{ color: '#999', fontSize: 16, marginTop: 12, marginBottom: 24 }}>
          No profile data available
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            if (accessToken) setAuthToken(accessToken);
            dispatch(getProfile());
          }}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Avatar source ────────────────────────────────────────────────────────
  const avatarSource = user?.profile_image
    ? { uri: `${IMAGE_BASE_URL}${user.profile_image}` }
    : require('../Assets/Profile.png');

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Editprofile')}>
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Avatar card */}
        <View style={styles.avatarCard}>
          <Image source={avatarSource} style={styles.avatar} />
          <Text style={styles.userName}>{user.full_name || 'User'}</Text>
          {user.role ? (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{String(user.role).toUpperCase()}</Text>
            </View>
          ) : null}
        </View>

        {/* Info rows */}
        <View style={styles.infoCard}>

          <InfoRow icon="email"       label="Email"        value={user.email} />
          <InfoRow icon="person"      label="Full Name"    value={user.full_name} />
          <InfoRow icon="phone"       label="Phone"        value={user.phone_number} />
          <InfoRow icon="credit-card" label="CNIC"         value={user.cnic_no} />
          <InfoRow icon="location-on" label="Address"      value={user.address} last />

        </View>

        {/* Edit button */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('Editprofile')}>
          <Icon name="edit" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// ─── Info row component ───────────────────────────────────────────────────────

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={20} color={color.Secondry} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },

  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   color.Secondry,
    paddingHorizontal: 16,
    paddingVertical:   14,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  // Avatar card
  avatarCard: {
    alignItems:      'center',
    backgroundColor: color.Secondry,
    paddingBottom:   28,
    paddingTop:      24,
    borderBottomLeftRadius:  30,
    borderBottomRightRadius: 30,
    marginBottom:    16,
  },
  avatar: {
    width:        100,
    height:       100,
    borderRadius: 50,
    borderWidth:  3,
    borderColor:  '#fff',
  },
  userName: {
    color:      '#fff',
    fontSize:   20,
    fontWeight: 'bold',
    marginTop:  10,
  },
  roleBadge: {
    marginTop:       6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical:   4,
    borderRadius:    20,
  },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 1 },

  // Info card
  infoCard: {
    backgroundColor:  '#fff',
    marginHorizontal: 16,
    borderRadius:     14,
    paddingHorizontal: 16,
    marginBottom:     20,
    elevation:        2,
  },
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowIcon: {
    width:            36,
    height:           36,
    borderRadius:     18,
    backgroundColor:  '#f0faf0',
    justifyContent:   'center',
    alignItems:       'center',
    marginRight:      12,
  },
  rowText:  { flex: 1 },
  rowLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  rowValue: { fontSize: 15, color: '#333', fontWeight: '500' },

  // Buttons
  editBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: color.Secondry,
    marginHorizontal: 16,
    paddingVertical:  14,
    borderRadius:    12,
    marginBottom:    30,
    elevation:       2,
  },
  retryBtn: {
    backgroundColor:  color.Secondry,
    paddingVertical:  12,
    paddingHorizontal: 40,
    borderRadius:     10,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
