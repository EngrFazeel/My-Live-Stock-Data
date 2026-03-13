import { Image, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { color } from '../Color'
import Feather from 'react-native-vector-icons/Feather';

export default class Login extends Component {
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
                            height: 280,
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
                                fontSize:26,
                                marginTop:10,
                                fontWeight:'900',
                                color:color.Secondry
                            }}>Login</Text>
                    </View>
                    <View
                        style={{
                            height: 180,
                            width: '90%',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}>
                        <View
                            style={{
                                height: 50,
                                width: '90%',
                                borderColor: color.borderColor,
                                borderWidth: 2,
                                borderRadius: color.borderradius,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                            <TextInput
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    height: 55,
                                    width: '88%',
                                    color: color.textcolor1,
                                    paddingLeft: 10
                                }}
                                placeholder='Email'
                                placeholderTextColor={'black'}
                                cursorColor={color.Secondry}></TextInput>
                            <Feather name="mail" size={25} marginLeft= {-5} color={color.Secondry} />
                        </View>
                        <View
                            style={{
                                height: 50,
                                width: '90%',
                                borderColor: color.borderColor,
                                borderWidth: 2,
                                borderRadius: color.borderradius,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                            <TextInput
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    height: 55,
                                    width: '88%',
                                    color: color.textcolor1,
                                    paddingLeft: 10
                                }}
                                placeholder='Password'
                                placeholderTextColor={'black'}
                                cursorColor={color.Secondry}></TextInput>
                            <Feather name="eye-off" size={25} marginLeft= {-5} color={color.Secondry} />
                        </View>
                        <TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '400',
                                color: color.Secondry,
                                textAlign: 'right',
                                marginRight: -140,
                                marginTop: -20,
                            }}
                        >Forget Password ?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Home') }}
                        style={{
                            height: 50,
                            width: '80%',
                            borderRadius: color.borderradius,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: color.Secondry,
                            alignSelf: 'center',
                            marginTop: 15,
                        }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: color.textcolor2,
                                textAlign: 'center'
                            }}>Login</Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            marginTop: 30,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 18,
                                fontWeight: '500'
                            }}>Create New Account?</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Signup') }}>
                            <Text
                                style={{
                                    color: color.Secondry,
                                    fontSize: 20,
                                    marginTop: -3,
                                    fontWeight: '700'
                                }}>SignUp</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        )
    }
}