import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class EditUserDetail extends Component {

  state = {
    name: '',
    phone: '',
    cnic: '',
    address: '',
  };

  render() {
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit User Detail</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageCircle}>
            <Icon name="person" size={60} color="#fff" />
            <View style={styles.cameraIcon}>
              <Icon name="camera-alt" size={18} color="#fff" />
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Name */}
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={this.state.name}
              onChangeText={(text) => this.setState({ name: text })}
            />
            <Icon name="person" size={22} color="#4CAF50" />
          </View>

          {/* Phone */}
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
              value={this.state.phone}
              onChangeText={(text) => this.setState({ phone: text })}
            />
            <Icon name="phone" size={22} color="#4CAF50" />
          </View>

          {/* CNIC */}
          <View style={styles.inputBox}>
            <TextInput
              placeholder="CNIC NO"
              style={styles.input}
              value={this.state.cnic}
              onChangeText={(text) => this.setState({ cnic: text })}
            />
            <Icon name="credit-card" size={22} color="#4CAF50" />
          </View>

          {/* Address */}
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Address"
              style={styles.input}
              value={this.state.address}
              onChangeText={(text) => this.setState({ address: text })}
            />
            <Icon name="location-on" size={22} color="#4CAF50" />
          </View>

        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.discardBtn}>
            <Text style={styles.btnText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#66BB6A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 5,
  },

  form: {
    paddingHorizontal: 20,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    padding: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },

  discardBtn: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});