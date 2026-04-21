import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: '',
      phone: '',
      cnic: '',
      address: '',
    };
  }

  pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        this.setState({ image: response.assets[0].uri });
      }
    });
  };

  handleRegister = () => {
    const { name, phone, cnic, address } = this.state;

    if (!name || !phone || !cnic || !address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    Alert.alert('Success', 'User Registered');
  };

  renderInput(placeholder, key, icon) {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          value={this.state[key]}
          onChangeText={(text) => this.setState({ [key]: text })}
          style={styles.input}
          placeholderTextColor="#333"
        />
        <Icon name={icon} size={22} color="#4CAF50" />
      </View>
    );
  }

  render() {
    const { image } = this.state;

    return (
      <View style={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>Add User</Text>

        {/* Avatar with Camera Icon */}
        <View style={styles.imageWrapper}>
          <Image
            source={
              image
                ? { uri: image }
                : { uri: 'https://via.placeholder.com/150' }
            }
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.cameraIcon} onPress={this.pickImage}>
            <Icon name="photo-camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        {this.renderInput('Name', 'name', 'person')}
        {this.renderInput('Phone Number', 'phone', 'phone')}
        {this.renderInput('CNIC NO', 'cnic', 'credit-card')}
        {this.renderInput('Address', 'address', 'location-on')}

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
          <Text style={styles.buttonText}>Registerd</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

// ✅ Styles (same file)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    paddingTop: 50,
  },

  title: {
    fontSize: 26,
    color: '#4CAF50',
    marginBottom: 20,
  },

  imageWrapper: {
    position: 'relative',
    marginBottom: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 6,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: '85%',
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    height: 45,
    color: '#000',
  },

  button: {
    backgroundColor: '#66BB6A',
    marginTop: 25,
    width: '85%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});