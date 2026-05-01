import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    StyleSheet,
    ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera } from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Colors
const color = {
    Secondry: "#4CAF50",
};

export default class AddAnimal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            owner: '',
            phone: '',
            date: new Date(),
            isDatePickerVisible: false,
            age: '',
            gender: '',
            image: null,
            scanImage: null,
        };
    }

    // 📸 Profile Image
    openCamera = () => {
        launchCamera(
            { mediaType: 'photo', cameraType: 'back' },
            (response) => {
                if (response.didCancel) return;
                if (response.assets?.length > 0) {
                    this.setState({ image: response.assets[0].uri });
                }
            }
        );
    };

    // 🐾 Scanner
    openScanner = () => {
        launchCamera(
            { mediaType: 'photo', cameraType: 'back' },
            (response) => {
                if (response.didCancel) return;
                if (response.assets?.length > 0) {
                    this.setState({ scanImage: response.assets[0].uri });
                }
            }
        );
    };

    // 📅 Date Confirm
    handleConfirm = (date) => {
        this.setState({
            date,
            isDatePickerVisible: false
        });
    };

    // 💾 Save
    saveData = () => {
        const formattedDate = this.formatDate(this.state.date);

        const animal = {
            ...this.state,
            date: formattedDate,
        };

        this.props.navigation.navigate('Home', { animal });
    };

    formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    render() {
        const formattedDate = this.formatDate(this.state.date);

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={color.Secondry} barStyle="light-content" />

                {/* Header */}
                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="white"
                        onPress={() => this.props.navigation.goBack()}
                        style={styles.backIcon}
                    />
                    <Text style={styles.title}>Add Animal Details</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>

                    {/* Profile Image */}
                    <TouchableOpacity style={styles.imageContainer} onPress={this.openCamera}>
                        <View style={styles.imageCircle}>
                            {this.state.image ? (
                                <Image source={{ uri: this.state.image }} style={styles.imagePreview} />
                            ) : (
                                <Icon name="person" size={60} color="#fff" />
                            )}
                            <View style={styles.cameraIcon}>
                                <Icon name="camera-alt" size={18} color="#fff" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Name */}
                    <View style={styles.inputRow}>
                        <Icon name="pets" size={20} color={color.Secondry} />
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="black"
                            style={styles.inputText}
                            value={this.state.name}
                            onChangeText={(t) => this.setState({ name: t })}
                        />
                    </View>

                    {/* Owner */}
                    <View style={styles.inputRow}>
                        <Icon name="person" size={20} color={color.Secondry} />
                        <TextInput
                            placeholder="Owner Name"
                            placeholderTextColor="black"
                            style={styles.inputText}
                            value={this.state.owner}
                            onChangeText={(t) => this.setState({ owner: t })}
                        />
                    </View>

                    {/* Phone */}
                    <View style={styles.inputRow}>
                        <Icon name="phone" size={20} color={color.Secondry} />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor="black"
                            keyboardType="phone-pad"
                            style={styles.inputText}
                            value={this.state.phone}
                            onChangeText={(t) => this.setState({ phone: t })}
                        />
                    </View>

                    {/* 📅 Date Picker */}
                    <TouchableOpacity
                        style={styles.inputRow}
                        onPress={() => this.setState({ isDatePickerVisible: true })}
                    >
                        <Icon name="calendar-today" size={20} color={color.Secondry} />
                        <Text style={styles.dateText}>
                            {formattedDate}  Register date
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={() => this.setState({ isDatePickerVisible: false })}
                    />

                    {/* Age & Gender */}
                    <View style={styles.row}>
                        <View style={styles.smallInputRow}>
                            <TextInput
                                placeholder="Age"
                                placeholderTextColor="black"
                                style={styles.inputText}
                                value={this.state.age}
                                onChangeText={(t) => this.setState({ age: t })}
                            />
                        </View>

                        <View style={styles.smallInputRow}>
                            <TextInput
                                placeholder="Gender"
                                placeholderTextColor="black"
                                style={styles.inputText}
                                value={this.state.gender}
                                onChangeText={(t) => this.setState({ gender: t })}
                            />
                        </View>
                    </View>

                    {/* Scanner */}
                    <TouchableOpacity style={styles.scanBox} onPress={this.openScanner}>
                        {this.state.scanImage ? (
                            <Image
                                source={{ uri: this.state.scanImage }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            <>
                                <Icon name="qr-code-scanner" size={40} color={color.Secondry} />
                                <Text style={{ color: 'black', marginTop: 5 }}>
                                    Tap to Scan
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.discard}>
                            <Text style={styles.btnText}>Discard</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.save} onPress={this.saveData}>
                            <Text style={styles.btnText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAEAEA' },

    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.Secondry,
    },

    backIcon: {
        position: 'absolute',
        left: 15,
    },

    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },

    scroll: { padding: 20 },

    imageContainer: { alignItems: 'center', marginVertical: 20 },

    imageCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: color.Secondry,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },

    imagePreview: { width: 120, height: 120, borderRadius: 60 },

    cameraIcon: {
        position: 'absolute',
        bottom: 5,
        right: 10,
        backgroundColor: color.Secondry,
        borderRadius: 15,
        padding: 5,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: color.Secondry,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 12,
        height: 50,
    },

    inputText: {
        marginLeft: 10,
        flex: 1,
        color: 'black'
    },

    dateText: {
        marginLeft: 10,
        color: 'black',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    smallInputRow: {
        width: '48%',
        borderWidth: 1.5,
        borderColor: color.Secondry,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center'
    },

    scanBox: {
        height: 120,
        borderWidth: 1.5,
        borderColor: color.Secondry,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        overflow: 'hidden'
    },

    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },

    discard: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center'
    },

    save: {
        backgroundColor: color.Secondry,
        padding: 12,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center'
    },

    btnText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});