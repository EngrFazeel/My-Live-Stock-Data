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

export default class PrivacyPolicyScreen extends Component {
  render() {
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.text}>MyLiveStock</Text>

          <Text style={styles.text}>Effective Date: [Insert Date]</Text>

          <Text style={styles.text}>
            At MyLiveStock, we take your privacy seriously. This policy explains how we
            collect, use, and protect your information when you use our app.
          </Text>

          {/* Section 1 */}
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>

          <Text style={styles.text}>
            We may collect the following types of data:
          </Text>

          <Text style={styles.bullet}>
            • Personal Information: Name, contact number, email address, and Facebook profile (if shared).
          </Text>

          <Text style={styles.bullet}>
            • Animal Information: Nose scan image, animal type, health records, and ownership details.
          </Text>

          <Text style={styles.bullet}>
            • Device Information: Basic device identifiers to enhance app performance.
          </Text>

          {/* Section 2 */}
          <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>

          <Text style={styles.bullet}>
            • Register users and their animals.
          </Text>

          <Text style={styles.bullet}>
            • Match animal identity through nose scans.
          </Text>

          <Text style={styles.bullet}>
            • Display rightful ownership to prevent theft and fraud.
          </Text>

          <Text style={styles.bullet}>
            • Improve user experience and app functionality.
          </Text>

          <Text style={styles.bullet}>
            • Contact users for support, updates, or verification.
          </Text>

          {/* Section 3 */}
          <Text style={styles.sectionTitle}>3. Data Security</Text>

          <Text style={styles.text}>
            We use secure servers and modern encryption to protect your data.
            Your information is never sold or shared with third parties without your consent.
          </Text>

          {/* Section 4 */}
          <Text style={styles.sectionTitle}>4. User Control</Text>

          <Text style={styles.bullet}>
            • View and edit your information in the app.
          </Text>

          <Text style={styles.bullet}>
            • Request data deletion by contacting us at qazifazeel95@gmail.com.
          </Text>

          {/* Section 5 */}
          <Text style={styles.sectionTitle}>5. Third-Party Access</Text>

          <Text style={styles.text}>
            We do not share your personal or animal data with any third party unless legally required or with your permission.
          </Text>

          {/* Section 6 */}
          <Text style={styles.sectionTitle}>6. Updates to This Policy</Text>

          <Text style={styles.text}>
            We may update this Privacy Policy occasionally. You will be notified of significant changes within the app.
          </Text>

        </ScrollView>

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

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },

  text: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 22,
    color: '#333',
  },

  bullet: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 22,
    marginLeft: 5,
  },
});