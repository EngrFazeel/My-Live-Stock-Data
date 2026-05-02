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
    ];

    genderData = [
        { label: 'Cow', value: 'cow' },
        { label: 'OX', value: 'ox' },
        { label: 'Buffalo', value: 'buffalo' },
        { label: 'Buffalo Female', value: 'buffalo_female' },
    ];

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            if (this.props.route?.params?.scanImage) {
                this.setState({ scanImage: this.props.route.params.scanImage });
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
                    <View style={{ height: 220, justifyContent: 'center', alignItems: 'center',}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor:color.Secondry , height:50, width:'100%', marginTop: -45, }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Ionicons name="arrow-back" size={30} marginLeft= {20} color={color.primary} />
                            </TouchableOpacity>

                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                marginLeft: 40,
                                color: color.primary
                            }}>
                                Add Animal Details
                            </Text>
                        </View>

                        {/* PROFILE IMAGE */}
                        <Image
                            style={{ height: 100, width: 100, borderRadius: 50 }}
                            source={
                                this.state.photo
                                    ? { uri: this.state.photo }
                                    : require('../Assets/Profile.png')
                            }
                        />

                        <TouchableOpacity>
                            <Image
                                style={{
                                    height: 30,
                                    width: 30,
                                    marginTop: -25,
                                    marginLeft: 50
                                }}
                                source={require('../Assets/Camera.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* FORM */}
                    <View style={{ width: '90%', alignSelf: 'center' }}>

                        {/* NAME */}
                        <View style={styles.inputBox}>
                            <Image style={styles.iconImg} source={require('../Assets/Cow.png')} />
                            <TextInput placeholder="Name" style={styles.input} placeholderTextColor="black" />
                        </View>

                        {/* OWNER */}
                        <View style={styles.inputBox}>
                            <MaterialCommunityIcons name="account" size={25} color={color.Secondry} />
                            <TextInput placeholder="Owner Name" style={styles.input} placeholderTextColor="black" />
                        </View>

                        {/* PHONE */}
                        <View style={styles.inputBox}>
                            <Ionicons name="call" size={25} color={color.Secondry} />
                            <TextInput placeholder="Phone Number" keyboardType="numeric" style={styles.input} placeholderTextColor="black" />
                        </View>

                        {/* DATE */}
                        <View style={styles.inputBox}>
                            <Ionicons name="calendar" size={25} color={color.Secondry} />
                            <TouchableOpacity onPress={this.showDatePicker} style={{ flex: 1 }}>
                                <Text style={{ marginLeft: 10, color: 'black' }}>
                                    {this.state.selectedDate || 'Register Date'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* DROPDOWNS */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholder="Age"
                                data={this.ageData}
                                labelField="label"
                                valueField="value"
                                value={this.state.age}
                                onChange={item => this.setState({ age: item.value })}
                            />

                            <Dropdown
                                style={styles.dropdown}
                                placeholder="Category"
                                data={this.genderData}
                                labelField="label"
                                valueField="value"
                                value={this.state.gender}
                                onChange={item => this.setState({ gender: item.value })}
                            />
                        </View>

                        {/* SCAN */}
                        <TouchableOpacity
                            style={styles.scanBox}
                            onPress={() => this.props.navigation.navigate('Scansave')}
                        >
                            {
                                this.state.scanImage
                                    ? <Image source={{ uri: this.state.scanImage }} style={{ height: '100%', width: '100%' }} />
                                    : <MaterialCommunityIcons name="line-scan" size={70} color={color.Secondry} />
                            }
                        </TouchableOpacity>

                        {/* BUTTONS */}
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: 'red' }]}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Discard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: color.Secondry }]}
                                onPress={() => this.props.navigation.navigate('Home')}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
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
                    onConfirm={(date) => {
                        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                        this.setState({
                            date,
                            selectedDate: formattedDate,
                            show: false
                        });
                    }}
                    onCancel={() => this.setState({ show: false })}
                />

            </View>
        );
    }
}

const styles = {
    inputBox: {
        height: 50,
        borderWidth: 2,
        borderColor: color.borderColor,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 12
    },

    input: {
        flex: 1,
        marginLeft: 10,
        color: 'black'
    },

    iconImg: {
        height: 25,
        width: 25
    },

    dropdown: {
        height: 50,
        width: '45%',
        borderWidth: 2,
        borderColor: color.Secondry,
        borderRadius: 10,
        paddingHorizontal: 10
    },

    scanBox: {
        height: 120,
        borderWidth: 2,
        borderColor: color.borderColor,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },

    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },

    btn: {
        height: 45,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
};