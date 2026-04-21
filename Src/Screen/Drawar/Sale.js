import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class SaleAnimal extends Component {

  state = {
    name: '',
    owner: '',
    phone: '',
    date: new Date(),
    showPicker: false,
  };

  showDatePicker = () => {
    this.setState({ showPicker: true });
  };

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({
      date: currentDate,
      showPicker: Platform.OS === 'ios' // keeps open on iOS
    });
  };

  formatDate = (date) => {
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();

    return `${d}/${m}/${y}`;
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
          <Text style={styles.headerTitle}>Sale Animal</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Name */}
          <View style={styles.inputBox}>
            <Icon name="pets" size={20} color="#4CAF50" />
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={this.state.name}
              onChangeText={(text) => this.setState({ name: text })}
            />
          </View>

          {/* Owner */}
          <View style={styles.inputBox}>
            <Icon name="person" size={20} color="#4CAF50" />
            <TextInput
              placeholder="New Owner Name"
              style={styles.input}
              value={this.state.owner}
              onChangeText={(text) => this.setState({ owner: text })}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputBox}>
            <Icon name="phone" size={20} color="#4CAF50" />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
              value={this.state.phone}
              onChangeText={(text) => this.setState({ phone: text })}
            />
          </View>

          {/* Date Picker Field */}
          <TouchableOpacity style={styles.inputBox} onPress={this.showDatePicker}>
            <Icon name="calendar-today" size={20} color="#4CAF50" />
            <Text style={styles.dateText}>
              {this.formatDate(this.state.date)}  Register date
            </Text>
          </TouchableOpacity>

        </View>

        {/* Show Picker */}
        {this.state.showPicker && (
          <DateTimePicker
            value={this.state.date}
            mode="date"
            display="default"
            onChange={this.onChangeDate}
          />
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.discardBtn}>
            <Text style={styles.btnText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAEAEA' },

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

  form: {
    padding: 20,
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

  dateText: {
    marginLeft: 10,
    paddingVertical: 12,
    color: '#333',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },

  discardBtn: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
  },

  confirmBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});