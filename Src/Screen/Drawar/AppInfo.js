import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class AppInfoScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        
        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Home')}}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Info</Text>
        </View>

        {/* Body */}
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.text}>
            <Text style={styles.bold}>My Livestock Data</Text> is an advanced livestock
            registration and tracking app built to protect farmers and their valuable animals.
            It allows users to create an account, register their animals, and store all
            related information securely.
          </Text>

          <Text style={styles.text}>
            Each animal is added through a unique nose scan—just like a fingerprint—
            ensuring every cow, buffalo, or goat has its own verified identity.
            This biometric identification makes it impossible for someone to falsely
            claim or sell an animal.
          </Text>

          <Text style={styles.sectionTitle}>Key Features:</Text>

          <Text style={styles.feature}>
            🐄 <Text style={styles.bold}>Register Animals via Nose Scan</Text>{"\n"}
            Secure and unique animal identification using nose print technology.
          </Text>

          <Text style={styles.feature}>
            👤 <Text style={styles.bold}>Owner Verification System</Text>{"\n"}
            If someone scans or tries to sell an animal, the app shows the registered
            owner’s details for transparency.
          </Text>

          <Text style={styles.feature}>
            🔒 <Text style={styles.bold}>Anti-Theft Protection</Text>{"\n"}
            Animals cannot be stolen or resold — each one is traceable.
          </Text>

          <Text style={styles.feature}>
            📱 <Text style={styles.bold}>Easy Access for Farmers</Text>{"\n"}
            Farmers can easily add, view, and update animal data.
          </Text>

          <Text style={styles.feature}>
            📊 <Text style={styles.bold}>Animal Record Management</Text>{"\n"}
            Maintain health, vaccination, and breeding records in one place.
          </Text>

        </ScrollView>
        

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'justify',
    marginLeft: 15,
  },

  content: {
    padding: 15,
  },

  text: {
    fontSize: 15,
    color: '#333',
    textAlign:'justify',
    marginBottom: 10,
    lineHeight: 22,
  },

  bold: {
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  feature: {
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 22,
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
  },
});