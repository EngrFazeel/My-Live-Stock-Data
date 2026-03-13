import React, { useEffect } from 'react'
import {
    View,
    Alert,
    PermissionsAndroid,
    Platform,
    StyleSheet
} from 'react-native'
import { launchCamera } from 'react-native-image-picker'

export default function CameraScreen({ navigation }) {

    useEffect(() => {
        checkPermissionAndOpenCamera()
    }, [])


    // 🔹 Request Camera Permission (Android)

    const requestCameraPermission = async () => {

        if (Platform.OS === 'android') {

            try {

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                )

                return granted === PermissionsAndroid.RESULTS.GRANTED

            } catch (err) {

                console.warn(err)
                return false

            }

        }

        return true

    }


    // 🔹 Check Permission then Open Camera

    const checkPermissionAndOpenCamera = async () => {

        const hasPermission = await requestCameraPermission()

        if (hasPermission) {

            openCamera()

        } else {

            Alert.alert('Permission Denied', 'Camera permission is required')

        }

    }


    // 🔹 Open Camera

    const openCamera = async () => {

        const result = await launchCamera({

            mediaType: 'photo',
            quality: 0.8,
            cameraType: 'back',
            saveToPhotos: true

        })

        if (result.didCancel) {

            navigation.goBack()

        }
        else if (result.errorCode) {

            Alert.alert('Error', result.errorMessage)

        }
        else {

            const imageUri = result.assets[0].uri

            // 🔹 Send image back to Add Animal Screen

            navigation.navigate('Addanimal', { scanImage: imageUri })

        }

    }

    return (

        <View style={styles.container} />

    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff'
    }

})
