import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import "../global.css"
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const app = () => {
    const [permission, requestPermission] = useCameraPermissions()

    const [facing, setFacing] = useState<CameraType>("back")

    const [isScan, setIsScan] = useState<boolean>(true)

    const cameraRef = useRef<CameraView>(null)

    const [photo, setPhoto] = useState<any>(null)

    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions()

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        if (result?.data && isScan) {
            setIsScan(false)
            console.log("Scanned barcode data:", result.data);
            Alert.alert("Scanned", result.data, [
                { text: "Scan Again", onPress: () => setIsScan(true) }
            ]);
        }
    }

    if (!permission || mediaPermission) <View />

    if (!mediaPermission?.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-center mb-3 text-lg text-gray-700">
                    We need permision to save photo to your gallery
                </Text>
                <TouchableOpacity
                    onPress={requestMediaPermission}
                    className="items-center bg-black/50 rounded-xl py-3 px-3"
                >
                    <Text className="text-white text-xl font-bold">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (!permission?.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-center mb-3 text-lg text-gray-700">
                    We need permission to show the camera
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="items-center bg-black/50 rounded-xl py-3 px-3"
                >
                    <Text className="text-white text-xl font-bold">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleTakePhoto = async () => {
        if (cameraRef?.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync()
                setPhoto(photo.uri)
                // save photo to media library
                const asset = await MediaLibrary.createAssetAsync(photo.uri)
                await MediaLibrary.createAlbumAsync("gdse70_lastday", asset)
                Alert.alert("Saved", "your photo has been saved to gallery!")
            } catch (error) {
                console.error("Error taking photo:", error)
            }
        }
    }

    const handlePickImage = async () => {
        const permissionRes = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionRes.granted) {
            Alert.alert("Permission Required", "We need permission to access your photos.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            // only images
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allow editing
            allowsEditing: true,
            quality: 1
        })

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    }

    return (
        <View className='flex-1'>
            <Image source={{ uri: photo }} className="w-full h-96" />
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
                onBarcodeScanned={handleBarcodeScanned} />
            <View className='absolute bottom-16 w-full left-0 right-0 p-4'>
                <TouchableOpacity
                    className=' bg-black p-4 rounded-lg'
                    onPress={() => setFacing(facing === "back" ? "front" : "back")}>
                    <Text className='text-white text-lg font-semibold text-center'>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=' bg-black p-4 rounded-lg'
                    onPress={handleTakePhoto}>
                    <Text className='text-white text-lg font-semibold text-center'>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=' bg-black p-4 rounded-lg'
                    onPress={handlePickImage}>
                    <Text className='text-white text-lg font-semibold text-center'>Pick Image</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default app