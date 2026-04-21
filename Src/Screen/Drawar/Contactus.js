import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class ContactUsScreen extends Component {

  openEmail = () => {
    Linking.openURL('mailto:qazifazeel95@gmail.com');
  };

  openPhone = () => {
    Linking.openURL('tel:+923315684305');
  };

  openFacebook = () => {
    Linking.openURL('https://www.facebook.com/');
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
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.title}>MyLiveStock</Text>

          <Text style={styles.text}>
            Have questions, feedback, or need support? We're here to help!
            Feel free to reach out to us through any of the following channels:
          </Text>

          {/* Email */}
          <TouchableOpacity onPress={this.openEmail}>
            <Text style={styles.item}>
              📧 <Text style={styles.bold}>Email</Text>{"\n"}
              qazifazeel95@gmail.com
            </Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity onPress={this.openPhone}>
            <Text style={styles.item}>
              📱 <Text style={styles.bold}>Phone/WhatsApp</Text>{"\n"}
              +92 331 5684305
            </Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity onPress={this.openFacebook}>
            <Text style={styles.item}>
              🌐 <Text style={styles.bold}>Facebook Page</Text>{"\n"}
              Engr Qazi Fazeel Official
            </Text>
          </TouchableOpacity>

          <Text style={styles.text}>
            We’re always ready to assist you with app support, technical issues,
            or general inquiries.
          </Text>

          <Text style={styles.text}>
            Thank you for using My Livestock — empowering farmers with technology!
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

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  text: {
    fontSize: 15,
    marginBottom: 15,
    lineHeight: 22,
    color: '#333',
  },

  item: {
    fontSize: 15,
    marginBottom: 15,
    lineHeight: 22,
  },

  bold: {
    fontWeight: 'bold',
  },
});