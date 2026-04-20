import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

export default class Home extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Icon name="menu" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Home</Text>

          <View style={styles.headerIcons}>
            <Icon name="delete" size={25} color="#fff" style={{ marginRight: 15 }} />
            <Icon name="edit" size={25} color="#fff" />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Animal Card */}
        <View style={styles.cardContainer}>

          {/* Icon */}
          <View style={styles.image}>
            <View style={styles.iconCircle}>
              <FontAwesome6 name="cow" size={35} color="#fff" />
            </View>
          </View>

          {/* Info */}
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

        {/* Floating Button */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => this.props.navigation.navigate("Addanimal")}
        >
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },

  header: {
    height: 60,
    backgroundColor: color.Secondry,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },

  headerIcons: {
    flexDirection: "row",
  },

  divider: {
    height: 6,
    backgroundColor: "#e0e0e0",
  },

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

  image: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.textcolor2,
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: {
    width: "80%",
  },

  row: {
    flexDirection: "row",
    marginVertical: 3,
  },

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

});