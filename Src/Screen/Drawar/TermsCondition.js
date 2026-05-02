import React, { Component } from 'react';
import {View,Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import { color } from '../../Color';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TermsConditions extends Component {
  renderSection(title, content) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {content.map((item, index) => (
          <Text key={index} style={styles.bullet}>
            • {item}
          </Text>
        ))}
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#6BBF59" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Term & Conditions</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>📜 My Livestock Data</Text>

          <Text style={styles.description}>
            Welcome to My Livestock Data! By downloading or using this app, you
            agree to the following terms and conditions. Please read them carefully.
          </Text>

          {this.renderSection("1. User Registration", [
            "Users must provide accurate and complete information when registering.",
            "You are responsible for keeping your login information secure."
          ])}

          {this.renderSection("2. Animal Registration", [
            "All animals must be registered through a nose scan for identity verification.",
            "The user uploading animal data must be the rightful owner of the animal."
          ])}

          {this.renderSection("3. Ownership Verification", [
            "MyLiveStock allows others to verify the true owner of an animal via the nose scan.",
            "This system is designed to prevent theft, fraud, or illegal sale of animals."
          ])}

          {this.renderSection("4. User Responsibility", [
            "Users are responsible for the accuracy of the data they provide.",
            "Misuse of the app may result in suspension or deletion of the account."
          ])}

          {this.renderSection("5. Data Usage", [
            "Your data is used only for registration, animal tracking, and app functionality.",
            "Please refer to our Privacy Policy for more details."
          ])}

          {this.renderSection("6. Intellectual Property", [
            "All content and technology used in MyLiveStock are the property of the developer.",
            "You may not copy, modify, or distribute any part of the app without permission."
          ])}

          {this.renderSection("7. Liability", [
            "MyLiveStock is a tool to support livestock identification and management.",
            "We are not responsible for disputes between users or misuse of app features."
          ])}

          {this.renderSection("8. Changes to Terms", [
            "We may update these Terms & Conditions from time to time.",
            "Continued use of the app after updates means you accept the new terms."
          ])}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6BBF59',
    padding: 15
  },
  backArrow: {
    color: '#fff',
    fontSize: 20,
    marginRight: 10
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  content: {
    padding: 15
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    color: '#444'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5
  },
  bullet: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
    marginBottom: 3
  }
});