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
import { color } from '../../Color';

export default class ContactUsScreen extends Component {

  openEmail = () => {
    Linking.openURL('mailto:qazifazeel95@gmail.com');
  };

  openPhone = () => {
    Linking.openURL('tel:+923315684305');
  };

  openWhatsApp = () => {
    Linking.openURL('https://wa.me/923315684305');
  };

  openFacebook = () => {
    Linking.openURL('https://www.facebook.com/EngrQaziFazeelOfficial');
  };

  render() {
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Contact Us</Text>

        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.title}>MyLiveStock</Text>

          <Text style={styles.text}>
            Have questions, feedback, or need support? We're here to help!
          </Text>

          {/* Email */}
          <TouchableOpacity style={styles.card} onPress={this.openEmail}>
            <Icon name="email" size={22} color="#4CAF50" />
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Email{"\n"}</Text>
              qazifazeel95@gmail.com
            </Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity style={styles.card} onPress={this.openPhone}>
            <Icon name="phone" size={22} color="#4CAF50" />
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Phone{"\n"}</Text>
              +92 331 5684305
            </Text>
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity style={styles.card} onPress={this.openWhatsApp}>
            <Icon name="chat" size={22} color="#4CAF50" />
            <Text style={styles.cardText}>
              <Text style={styles.bold}>WhatsApp{"\n"}</Text>
              Chat directly on WhatsApp
            </Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity style={styles.card} onPress={this.openFacebook}>
            <Icon name="public" size={22} color="#4CAF50" />
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Facebook{"\n"}</Text>
              Engr Qazi Fazeel Official
            </Text>
          </TouchableOpacity>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.Secondry,
    padding: 15,
    elevation: 4,
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

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },

  cardText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
  },

  bold: {
    fontWeight: 'bold',
  },
});