import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from '../Color';

export default class UserDetails extends Component {

  state = {
    user: {
      email: 'engineerqazifazeel@gmail.com',
      name: 'Qazi Fazeel',
      phone: '03315684305',
      cnic: '32403-8618115-5',
      address: 'Rahim Yar Khan',
    }
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  goToEdit = () => {
    this.props.navigation.navigate('Editprofile', {
      userData: this.state.user
    });
  };

  renderInput = (placeholder, value, icon) => {
    return (
      <View style={styles.inputBox}>
        <TextInput
          value={value}
          editable={false}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor="#000"
        />
        <Icon name={icon} size={22} color="#4CAF50" />
      </View>
    );
  };

  render() {
    const { user } = this.state;

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor= {color.Secondry} barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={this.goBack}>
            <Icon name="arrow-back" size={26} color={color.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>User Details</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={(require('../Assets/my.jpg'))}
            style={styles.image}
          />
        </View>

        {/* Inputs */}
        {this.renderInput('Email', user.email, 'check')}
        {this.renderInput('Name', user.name, 'person')}
        {this.renderInput('Phone Number', user.phone, 'call')}
        {this.renderInput('CNIC NO', user.cnic, 'credit-card')}
        {this.renderInput('Address', user.address, 'location-on')}

        {/* Buttons */}
        <View style={styles.buttonRow}>

          <TouchableOpacity style={styles.backBtn} onPress={this.goBack}>
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editBtn} onPress={this.goToEdit}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    // paddingTop: 10
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor:color.Secondry
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.primary,
    marginLeft: 80
  },

  imageContainer: {
    alignItems: 'center',
    marginVertical: 15
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60
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
    height: 50
  },

  input: {
    flex: 1,
    color: '#000'
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },

  backBtn: {
    backgroundColor: color.Secondry,
    paddingVertical: 12,
    width: '40%',
    borderRadius: 10
  },

  editBtn: {
    backgroundColor: color.Secondry,
    paddingVertical: 12,
    width: '40%',
    borderRadius: 10
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center'
  }
});