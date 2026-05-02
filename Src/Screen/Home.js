import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  Alert
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { color } from "../Color";

const { width } = Dimensions.get("window");

export default class Home extends Component {

  state = {
    drawerOpen: false,
    animation: new Animated.Value(-width * 0.6),
  };

  // 🔥 Drawer Toggle
  toggleDrawer = () => {
    const { drawerOpen, animation } = this.state;

    Animated.timing(animation, {
      toValue: drawerOpen ? -width * 0.6 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    this.setState({ drawerOpen: !drawerOpen });
  };

  navigateTo = (screen) => {
    this.toggleDrawer();
    this.props.navigation?.navigate(screen);
  };

  // 🔴 Delete
  handleDelete = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            console.log("Deleted");
          }
        }
      ]
    );
  };

  // 🟢 Edit
  handleEdit = () => {
    this.props.navigation.navigate("EditUserDetail");
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <StatusBar backgroundColor={color.Secondry} />

        {/* HEADER */}
        <View style={styles.header}>

          <TouchableOpacity onPress={this.toggleDrawer}>
            <Icon name="menu" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Home</Text>

          {/* 🔥 Updated Icons */}
          <View style={styles.headerIcons}>

            <TouchableOpacity onPress={this.handleDelete}>
              <Icon name="delete" size={25} color="#fff" style={{ marginRight: 15 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleEdit}>
              <Icon name="edit" size={25} color="#fff" />
            </TouchableOpacity>

          </View>

        </View>

        {/* DIVIDER */}
        <View style={styles.divider} />

        {/* CARD */}
        <View style={styles.cardContainer}>

          <View style={styles.image}>
            <View style={styles.iconCircle}>
              <FontAwesome6 name="cow" size={35} color="#fff" />
            </View>
          </View>

          <View style={styles.infoBox}>

            <View style={styles.row}>
              <View style={styles.boxLarge}>
                <Text style={styles.boxText}>Owner Name</Text>
              </View>

              <View style={styles.boxSmall}>
                <Text style={styles.boxText}>Register Date</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.boxLarge}>
                <Text style={styles.boxText}>Name Of Animal</Text>
              </View>

              <View style={styles.boxSmall}>
                <Text style={styles.boxText}>29/07/25</Text>
              </View>
            </View>

          </View>
        </View>

        {/* FLOAT BUTTON */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => this.props.navigation?.navigate("Addanimal")}
        >
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>

        {/* OVERLAY */}
        {this.state.drawerOpen && (
          <TouchableWithoutFeedback onPress={this.toggleDrawer}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {/* DRAWER */}
        <Animated.View style={[styles.drawer, { left: this.state.animation }]}>

          <Text style={styles.drawerTitle}>Menu</Text>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("Home")}>
            <Entypo name="home" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("Profile")}>
            <MaterialIcons name="person" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("Editprofile")}>
            <MaterialIcons name="edit" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("Sale")}>
            <MaterialIcons name="sell" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Sale Animal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("AppInfo")}>
            <MaterialIcons name="info" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>App Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("Contactus")}>
            <MaterialIcons name="contact-phone" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Contact Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("PrivacyPolicy")}>
            <MaterialIcons name="privacy-tip" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("TermsCondition")}>
            <MaterialIcons name="description" size={22} color={color.Secondry} />
            <Text style={styles.drawerText}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItemRow} onPress={() => this.navigateTo("Login")}>
            <AntDesign name="logout" size={22} color="red" />
            <Text style={[styles.drawerText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>

        </Animated.View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.primary },

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  headerTitle: { fontSize: 22, color: "#fff", fontWeight: "bold" },

  headerIcons: { flexDirection: "row" },

  divider: { height: 6, backgroundColor: "#e0e0e0" },

  cardContainer: {
    flexDirection: "row",
    height: 95,
    width: "95%",
    backgroundColor: color.Secondry,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  image: { width: "20%", justifyContent: "center", alignItems: "center" },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.textcolor2,
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: { width: "80%" },

  row: { flexDirection: "row", marginVertical: 3 },

  boxLarge: {
    borderWidth: 2,
    borderColor: color.textcolor2,
    borderRadius: 20,
    height: 35,
    width: "65%",
    justifyContent: "center",
  },

  boxSmall: {
    borderWidth: 2,
    borderColor: color.textcolor2,
    borderRadius: 20,
    height: 35,
    width: "35%",
    marginLeft: 5,
    justifyContent: "center",
  },

  boxText: {
    textAlign: "center",
    color: color.textcolor2,
    fontWeight: "bold",
    fontSize: 13,
  },

  floatingBtn: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: color.textcolor1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.6,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
  },

  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  drawerItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  drawerText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
});