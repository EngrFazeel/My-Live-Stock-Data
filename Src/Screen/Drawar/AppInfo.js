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
import { color } from '../../Color';

export default class AppInfoScreen extends Component {
  render() {
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { this.props.navigation.navigate('Home') }}
          >
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Center Title */}
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

          {/* Feature 1 */}
          <View style={styles.featureRow}>
            <Icon name="pets" size={22} color={color.Secondry} />
            <Text style={styles.featureText}>
              <Text style={styles.bold}> Register Animals via Nose Scan{"\n"}</Text>
              Secure and unique animal identification using nose print technology.
            </Text>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureRow}>
            <Icon name="verified-user" size={22} color={color.Secondry} />
            <Text style={styles.featureText}>
              <Text style={styles.bold}> Owner Verification System{"\n"}</Text>
              If someone scans or tries to sell an animal, the app shows the registered
              owner’s details for transparency.
            </Text>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureRow}>
            <Icon name="security" size={22} color={color.Secondry} />
            <Text style={styles.featureText}>
              <Text style={styles.bold}> Anti-Theft Protection{"\n"}</Text>
              Animals cannot be stolen or resold — each one is traceable.
            </Text>
          </View>

          {/* Feature 4 */}
          <View style={styles.featureRow}>
            <Icon name="phone-android" size={22} color={color.Secondry} />
            <Text style={styles.featureText}>
              <Text style={styles.bold}> Easy Access for Farmers{"\n"}</Text>
              Farmers can easily add, view, and update animal data.
            </Text>
          </View>

          {/* Feature 5 */}
          <View style={styles.featureRow}>
            <Icon name="assignment" size={22} color={color.Secondry} />
            <Text style={styles.featureText}>
              <Text style={styles.bold}> Animal Record Management{"\n"}</Text>
              Maintain health, vaccination, and breeding records in one place.
            </Text>
          </View>

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
    justifyContent: 'center', // center title
    backgroundColor: color.Secondry,
    padding: 15,
    elevation: 4, // optional shadow (Android)
  },

  backButton: {
    position: 'absolute',
    left: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  content: {
    padding: 15,
  },

  text: {
    fontSize: 15,
    color: '#000',
    textAlign: 'justify',
    marginBottom: 10,
    lineHeight: 22,
  },

  bold: {
    fontWeight: 'bold',
    color: '#000',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  featureText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
  },
});