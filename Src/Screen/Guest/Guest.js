import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { color } from '../../Color'

export default class Guest extends Component {
  render() {
    return (
      <View
      style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      }}>
        <Text
        style={{
          fontSize:16,
          fontWeight:'600',
          color:color.Secondry
        }}>Thank you for using this app. Please scan the animal’s nose, and its data will appear here.</Text>
      </View>
    )
  }
}