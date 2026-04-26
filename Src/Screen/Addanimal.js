import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { color } from '../Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';

export default class Addanimal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            age: null,
            gender: null,
            photo: null,
            scanImage: null,
            date: new Date(),
            show: false,
            selectedDate: '',
        };
    }

    ageData = [
        { label: '1 Year', value: '1' },
        { label: '2 Years', value: '2' },
        { label: '3 Years', value: '3' },
        { label: '4 Years', value: '4' },
        { label: '5 Years', value: '5' },
        { label: '6 Years', value: '6' },
        { label: '7 Years', value: '7' },
        { label: '8 Years', value: '8' },
    ];

    genderData = [
        { label: 'Cow', value: 'cow' },
        { label: 'OX', value: 'ox' },
        { label: 'Buffalo', value: 'buffalo' },
        { label: 'Buffalo Female', value: 'buffalo female' },
    ];

    componentDidMount() {
        // Listen when screen comes into focus
        this.focusListener = this.props.navigation.addListener('focus', () => {
            if (this.props.route.params?.scanImage) {
                this.setState({ scanImage: this.props.route.params.scanImage });
                // Clear param to prevent reloading same image
                this.props.navigation.setParams({ scanImage: null });
            }
        });
    }

    showDatePicker = () => {
        this.setState({ show: true });
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: color.textcolor2 }}>
                <StatusBar backgroundColor={color.StatusBar} />
                <ScrollView>

                    {/* HEADER */}
                    <View style={{ height: 200, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Ionicons name="arrow-back" size={30} color={color.Secondry} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 26, fontWeight: '900', marginRight: 50, color: color.Secondry }}>
                                Add Animal Details
                            </Text>
                        </View>

                        {/* PROFILE IMAGE */}
                        <Image
                            style={{ height: 80, width: 100, borderRadius: 100 }}
                            source={this.state.photo ? { uri: this.state.photo } : require('../Assets/Profile.png')}
                        />

                        <TouchableOpacity>
                            <Image
                                style={{ height: 30, width: 30, borderRadius: 30, marginTop: -30, marginRight: -60, marginLeft: 15 }}
                                source={require('../Assets/Camera.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* FORM */}
                    <View style={{ height: 520, width: '90%', justifyContent: 'space-around', alignItems: 'center', alignSelf: 'center' }}>

                        {/* NAME */}
                        <View style={{ height: 50, width: '90%', borderColor: color.borderColor, borderWidth: 2, borderRadius: color.borderradius, flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ height: 30, width: 30, marginLeft: 10 }} source={require('../Assets/Cow.png')} />
                            <TextInput style={{ fontSize: 18, height: 55, width: '88%', paddingLeft: 10 }} placeholder="Name" placeholderTextColor={'black'} />
                        </View>

                        {/* OWNER */}
                        <View style={{ height: 50, width: '90%', borderColor: color.borderColor, borderWidth: 2, borderRadius: color.borderradius, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account" size={28} color={color.Secondry} style={{ marginLeft: 10 }} />
                            <TextInput style={{ fontSize: 18, height: 55, width: '88%', paddingLeft: 10 }} placeholder="Owner Name" placeholderTextColor={'black'} />
                        </View>

                        {/* PHONE */}
                        <View style={{ height: 50, width: '90%', borderColor: color.borderColor, borderWidth: 2, borderRadius: color.borderradius, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="call" size={25} color={color.Secondry} style={{ marginLeft: 10 }} />
                            <TextInput style={{ fontSize: 18, height: 55, width: '88%', paddingLeft: 10 }} keyboardType="numeric" placeholder="Phone Number" placeholderTextColor={'black'} />
                        </View>

                        {/* REGISTER DATE */}
                        <View style={{ height: 50, width: '90%', borderColor: color.borderColor, borderWidth: 2, borderRadius: color.borderradius, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="calendar-number-outline" size={25} color={color.Secondry} style={{ marginLeft: 10 }} />
                            <TouchableOpacity onPress={this.showDatePicker} style={{ width: '88%' }}>
                                <TextInput style={{ fontSize: 18, height: 55, paddingLeft: 10, color:'black' }} placeholder="Register Date" placeholderTextColor={'black'} value={this.state.selectedDate} editable={false} />
                            </TouchableOpacity>
                        </View>

                        {/* AGE + GENDER */}
                        <View style={{ height: 50, width: '90%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Dropdown
                                style={{ height: 50, width: '45%', borderColor: color.Secondry, borderWidth: 2, borderRadius: color.borderradius, paddingHorizontal: 10 }}
                                placeholder="Age"
                                placeholderTextColor={'black'}
                                data={this.ageData}
                                labelField="label"
                                valueField="value"
                                value={this.state.age}
                                onChange={item => this.setState({ age: item.value })}
                            />

                            <Dropdown
                                style={{ height: 50, width: '45%', borderColor: color.Secondry, borderWidth: 2, borderRadius: color.borderradius, paddingHorizontal: 10 }}
                                placeholder="Category"
                                data={this.genderData}
                                labelField="label"
                                valueField="value"
                                value={this.state.gender}
                                onChange={item => this.setState({ gender: item.value })}
                            />
                        </View>

                        {/* SCAN */}
                        <View style={{ height: 120, width: '90%', borderColor: color.borderColor, borderWidth: 2, borderRadius: color.borderradius, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Scansave')}>
                                {
                                    this.state.scanImage ?
                                        <Image source={{ uri: this.state.scanImage }} style={{ height: 110, width: 140, borderRadius: 10 }} resizeMode="cover" />
                                        :
                                        <MaterialCommunityIcons name="line-scan" size={80} color={color.Secondry} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 20,
                            width:'100%'
                        }}>

                            <TouchableOpacity
                                style={{
                                    height: 45,
                                    width: '35%',
                                    borderRadius: color.borderradius,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: color.Secondry
                                }}
                            >

                                <Text style={{
                                    fontSize: 22,
                                    fontWeight: '800',
                                    color: 'red'
                                }}>
                                    Discard
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Home')}}
                                style={{
                                    height: 45,
                                    width: '35%',
                                    borderRadius: color.borderradius,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: color.Secondry
                                }}
                            >

                                <Text style={{
                                    fontSize: 22,
                                    fontWeight: '800',
                                    color: color.textcolor2
                                }}>
                                    Save
                                </Text>

                            </TouchableOpacity>

                        </View>
                    </View>



                </ScrollView>

                {/* DATE PICKER */}
                <DatePicker
                    modal
                    open={this.state.show}
                    date={this.state.date}
                    mode="date"
                    onConfirm={date => {
                        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                        this.setState({ date, selectedDate: formattedDate, show: false });
                    }}
                    onCancel={() => this.setState({ show: false })}
                />
            </View>
        );
    }
}
