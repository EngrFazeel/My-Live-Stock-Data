import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { color } from '../Color'

export default class Choice extends Component {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: color.textcolor2
                }}>
                <StatusBar backgroundColor={color.StatusBar}></StatusBar>
                <ScrollView>
                    <View
                        style={{
                            height: 330,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={require('../Assets/Logo.png')}
                            style={{
                                height: 200,
                                width: 200,
                                borderRadius: 200
                            }}></Image>
                        <Text
                            style={{
                                fontSize: 26,
                                fontWeight: '900',
                                color: color.Secondry,
                                marginTop: 20,
                            }}>Chose Category</Text>
                    </View>
                    <View
                        style={{
                            height: 220,
                            width: '100%',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}
                            style={{
                                height: 50,
                                width: '85%',
                                borderRadius: color.borderradius,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: color.Secondry
                            }}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: '800',
                                    color: color.textcolor2,
                                    textAlign: 'center'
                                }}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Signup') }}
                            style={{
                                height: 50,
                                width: '85%',
                                borderRadius: color.borderradius,
                                backgroundColor: color.Secondry,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: '800',
                                    color: color.textcolor2,
                                    textAlign: 'center'
                                }}>SignUp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Guest') }}
                            style={{
                                height: 50,
                                width: '85%',
                                borderRadius: color.borderradius,
                                backgroundColor: color.Secondry,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: '800',
                                    color: color.textcolor2,
                                    textAlign: 'center'
                                }}>Use As Guest</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}