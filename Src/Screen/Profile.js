import React, { Component } from 'react';
import {View,Text,StyleSheet,TextInput,Image,TouchableOpacity,Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      image: null,
      user: {
        email: '',
        name: '',
        phone: '',
        cnic: '',
        address: '',
      },
    };
  }

  handleChange = (key, value) => {
    this.setState({
      user: { ...this.state.user, [key]: value },
    });
  };

  pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        this.setState({ image: response.assets[0].uri });
      }
    });
  };

  toggleEdit = () => {
    if (this.state.isEditing) {
      Alert.alert('Saved Successfully');
    }
    this.setState({ isEditing: !this.state.isEditing });
  };

  goBack = () => {
    Alert.alert('Back Pressed');
    this.props.navigation.goBack();
  };

  renderInput(label, key, icon) {
    const { user, isEditing } = this.state;

    return (
      <View style={styles.inputContainer}>
        <TextInput
          value={user[key]}
          onChangeText={(text) => this.handleChange(key, text)}
          placeholder={label}
          editable={isEditing}
          style={styles.input}
          placeholderTextColor="#333"
        />
        <Icon name={icon} size={22} color="#4CAF50" />
      </View>
    );
  }

  render() {
    const { image, isEditing } = this.state;

    return (
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={this.goBack}>
            <Icon name="arrow-back" size={28} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.title}>User Details</Text>
        </View>

        {/* Avatar */}
        <TouchableOpacity onPress={this.pickImage}>
          <Image
            source={
              image
                ? { uri: image }
                : { uri: 'https://via.placeholder.com/150' }
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Inputs */}
        {this.renderInput('Email', 'email', 'email')}
        {this.renderInput('Name', 'name', 'person')}
        {this.renderInput('Phone Number', 'phone', 'phone')}
        {this.renderInput('CNIC NO', 'cnic', 'credit-card')}
        {this.renderInput('Address', 'address', 'location-on')}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.toggleEdit}>
            <Text style={styles.buttonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// ✅ Styles in same file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 10,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginVertical: 15,
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

  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '85%',
    justifyContent: 'space-between',
  },

  button: {
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});