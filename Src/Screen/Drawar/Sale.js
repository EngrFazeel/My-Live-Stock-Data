import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import { launchCamera } from "react-native-image-picker";
import { color } from "../../Color";

export default class SaleAnimal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      ownerName: "",
      phone: "",
      date: "",
      image: null
    };
  }

  // 📷 Open Camera
  openCamera = () => {
    const options = {
      mediaType: "photo",
      quality: 0.8,
      saveToPhotos: true
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("Cancelled");
      } else if (response.errorCode) {
        console.log("Error: ", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;

        this.setState({
          image: uri
        });
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="green" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Sale Animal</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <View style={styles.profileCircle}>
            {this.state.image ? (
              <Image
                source={{ uri: this.state.image }}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesome name="user" size={50} color="#fff" />
            )}
          </View>

          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={this.openCamera}
          >
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputBox}>
            <Icon name="pets" size={20} color="green" />
            <TextInput
              placeholder="Name"
              style={styles.input}
              placeholderTextColor="#333"
              onChangeText={(text) => this.setState({ name: text })}
            />
          </View>

          <View style={styles.inputBox}>
            <FontAwesome name="user" size={20} color="green" />
            <TextInput
              placeholder="New Owner Name"
              style={styles.input}
              placeholderTextColor="#333"
              onChangeText={(text) => this.setState({ ownerName: text })}
            />
          </View>

          <View style={styles.inputBox}>
            <FontAwesome name="phone" size={20} color="green" />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#333"
              onChangeText={(text) => this.setState({ phone: text })}
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="calendar" size={20} color="green" />
            <TextInput
              placeholder="Register date"
              style={styles.input}
              placeholderTextColor="#333"
              onChangeText={(text) => this.setState({ date: text })}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.discardBtn}
            onPress={() =>
              this.setState({
                name: "",
                ownerName: "",
                phone: "",
                date: "",
                image: null
              })
            }
          >
            <Text style={styles.btnText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    paddingHorizontal: 15
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginRight: 25
  },

  imageContainer: {
    alignItems: "center",
    marginVertical: 20
  },

  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: color.Secondry,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },

  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 110,
    backgroundColor: "green",
    borderRadius: 15,
    padding: 6
  },

  form: {
    marginTop: 10,
    marginHorizontal: 10
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "green",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 45
  },

  input: {
    marginLeft: 10,
    flex: 1,
    color: "#000"
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginHorizontal: 10
  },

  discardBtn: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center"
  },

  confirmBtn: {
    backgroundColor: color.Secondry,
    paddingVertical: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center"
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
