import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { color } from '../Color';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  componentDidUpdate(prevProps) {
    const newData = this.props.route.params?.updatedUser;

    if (newData && newData !== prevProps.route.params?.updatedUser) {
      this.setState({ user: newData });
    }
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  goToEditScreen = () => {
    this.props.navigation.navigate('Editprofile', {
      userData: this.state.user
    });
  };

  renderInput(label, key, icon) {
    const { user } = this.state;

    return (
      <View style={styles.inputContainer}>
        <TextInput
          value={user[key]}
          editable={false}
          placeholder={label}
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
      <SafeAreaView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={this.goBack}>
            <Icon name="arrow-back" size={25} color="#4CAF50" />
          </TouchableOpacity>

          <Text style={styles.title}>User Details</Text>

          <View style={{ width: 25 }} />
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <View style={styles.profileCircle}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <FontAwesome name="user" size={50} color="#fff" />
            )}
          </View>
        </View>

        {/* Inputs */}
        {this.renderInput('Email', 'email', 'email')}
        {this.renderInput('Name', 'name', 'person')}
        {this.renderInput('Phone Number', 'phone', 'phone')}
        {this.renderInput('CNIC NO', 'cnic', 'credit-card')}
        {this.renderInput('Address', 'address', 'location-on')}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={this.goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editBtn} onPress={this.goToEditScreen}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eee', paddingHorizontal: 15 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center'
  },

  title: { fontSize: 22, fontWeight: 'bold', color: color.Secondry },

  imageContainer: { alignItems: 'center', marginVertical: 15 },

  profileCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.Secondry
  },

  profileImage: { width: '100%', height: '100%', borderRadius: 55 },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: color.Secondry,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 45,
    backgroundColor: '#fff',
  },

  input: { flex: 1, color: '#000' },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  backBtn: {
    backgroundColor: color.Secondry,
    padding: 12,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center'
  },

  editBtn: {
    backgroundColor: color.Secondry,
    padding: 12,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center'
  },

  buttonText: { color: '#fff', fontWeight: 'bold' },
});
