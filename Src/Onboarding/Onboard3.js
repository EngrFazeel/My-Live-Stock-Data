import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { color } from '../Color'
import { ScrollView } from 'react-native-gesture-handler'

export default class Onboard1 extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
        <StatusBar backgroundColor={color.StatusBar}></StatusBar>
        <ScrollView>
          <View
            style={{
              height: 80,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => {this.props.navigation.navigate("Choice")}}
              style={{
                height: 30,
                width: 100,
                marginRight: 20,
                marginTop: 20,
                borderRadius: color.borderradius,
                backgroundColor: color.Secondry
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: color.textcolor2,
                  textAlign: 'center'
                }}>Skip</Text>
            </TouchableOpacity>
          </View>
          <Image
            style={{
              height: 400,
              width: 300,
              alignSelf: 'center',
            }}
            source={require('../Assets/Onboard3.png')}></Image>
          <View
            style={{
              height: 60,
              width: '80%',
              backgroundColor: color.Secondry,
              alignSelf: 'center',
              borderRadius: 15,
              marginTop: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: color.textcolor2,
                textAlign: 'center'
              }}>Easily scan your livestock for</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: color.textcolor2,
                textAlign: 'center'
              }}> instant identification </Text>
          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate("Choice") }}
            style={{
              height: 40,
              width: 100,
              marginRight: 10,
              marginTop: 30,
              alignSelf: "center",
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: color.borderradius,
              backgroundColor: color.Secondry
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: color.textcolor2,
                textAlign: 'center'
              }}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}