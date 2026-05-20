import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from '../Color';
import { showAlert } from '../Utils/SweetAlert';
import { setAuthToken } from '../Services/ApiService';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Set the token in API headers for future requests
        setAuthToken(token);
      }
      
      // Get userData from AsyncStorage
      const storedUserData = await AsyncStorage.getItem('userData');
      
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        
        // Extract user information
        const userInfo = {
          email: parsedData.user?.email || 'N/A',
          full_name: parsedData.user?.full_name || 'N/A',
          phone_number: parsedData.user?.phone_number || 'N/A',
          cnic_no: parsedData.user?.cnic_no || parsedData.cnic_no || 'N/A',
          address: parsedData.user?.address || 'N/A',
          role: parsedData.user?.role || 'N/A',
        };
        
        setUser(userInfo);
      } else {
        // If no stored data, show alert
        showAlert({
          title: 'No Data',
          message: 'No user data found. Please login again.',
          type: 'warning',
          confirmText: 'OK',
          onConfirm: () => {
            navigation.replace('Login');
          },
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showAlert({
        title: 'Error',
        message: 'Failed to load user data. Please try again.',
        type: 'error',
        confirmText: 'OK',
        onConfirm: () => {
          navigation.replace('Login');
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToEdit = () => {
    if (user) {
      navigation.navigate('Editprofile', {
        userData: user
      });
    }
  };

  const renderInput = (placeholder, value, icon) => {
    return (
      <View style={styles.inputBox}>
        <TextInput
          value={value || 'N/A'}
          editable={false}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <Icon name={icon} size={22} color={color.Secondry} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={color.Secondry} />
        <Text style={{ marginTop: 10, color: color.Secondry, fontSize: 16 }}>
          Loading user profile...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: color.Secondry, fontSize: 16, marginBottom: 20 }}>
          No user data available
        </Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => loadUserData()}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={26} color={color.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../Assets/my.jpg')}
          style={styles.image}
        />
        <Text style={styles.userName}>{user.full_name}</Text>
      </View>

      {/* User Info Inputs */}
      <View style={{ flex: 1 }}>
        {renderInput('Email', user.email, 'email')}
        {renderInput('Full Name', user.full_name, 'person')}
        {renderInput('Phone Number', user.phone_number, 'phone')}
        {renderInput('CNIC Number', user.cnic_no, 'credit-card')}
        {renderInput('Address', user.address, 'location-on')}
        {renderInput('Role', user.role, 'badge')}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={goToEdit}>
          <Text style={styles.btnText}>Edit</Text>
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
    padding: 15,
    backgroundColor: color.Secondry,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.primary,
    marginLeft: 80,
  },

  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: color.Secondry,
    marginTop: 10,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.Secondry,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 50,
  },

  input: {
    flex: 1,
    color: '#000',
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  backBtn: {
    backgroundColor: color.Secondry,
    paddingVertical: 12,
    width: '45%',
    borderRadius: 10,
  },

  editBtn: {
    backgroundColor: color.Secondry,
    paddingVertical: 12,
    width: '45%',
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});