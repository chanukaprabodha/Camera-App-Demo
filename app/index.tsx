import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, RotateCcw, Image as ImageIcon } from 'lucide-react-native';
import "../global.css"
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
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
            <View className="flex-1 items-center justify-center bg-gray-50 px-6">
                <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-blue-600 text-2xl">📷</Text>
                        </View>
                        <Text className="text-gray-800 text-xl font-semibold mb-2 text-center">
                            Media Access Required
                        </Text>
                        <Text className="text-center text-gray-600 leading-relaxed">
                            We need permission to save photos to your gallery for the best experience
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={requestMediaPermission}
                        className="bg-blue-600 rounded-xl py-4 px-6 shadow-sm"
                    >
                        <Text className="text-white text-lg font-semibold text-center">Allow Access</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    if (!permission?.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 px-6">
                <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-green-600 text-2xl">📸</Text>
                        </View>
                        <Text className="text-gray-800 text-xl font-semibold mb-2 text-center">
                            Camera Access Required
                        </Text>
                        <Text className="text-center text-gray-600 leading-relaxed">
                            Please grant camera permission to take photos and scan QR codes
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={requestPermission}
                        className="bg-green-600 rounded-xl py-4 px-6 shadow-sm"
                    >
                        <Text className="text-white text-lg font-semibold text-center">Enable Camera</Text>
                    </TouchableOpacity>
                </View>
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
            {/* Photo Preview */}
            {photo && (
                <View className="absolute top-12 right-4 z-10">
                    <View className="bg-white rounded-xl p-1 shadow-lg">
                        <Image source={{ uri: photo }} className="w-20 h-20 rounded-lg" />
                        <TouchableOpacity
                            onPress={() => setPhoto(null)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                            <Text className="text-white text-xs font-bold">×</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Full Screen Camera View */}
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
                onBarcodeScanned={handleBarcodeScanned}
            />

            {/* Bottom Controls */}
            <View className='absolute bottom-12 left-0 right-0'>
                <View className="flex-row items-center justify-center px-8">
                    {/* Gallery Button */}
                    <TouchableOpacity
                        className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl items-center justify-center border border-white/30 mr-8"
                        onPress={handlePickImage}
                        activeOpacity={0.8}
                    >
                        <ImageIcon size={22} color="white" />
                    </TouchableOpacity>

                    {/* Capture Button */}
                    <TouchableOpacity
                        className="w-24 h-24 bg-white rounded-full items-center justify-center shadow-2xl border-4 border-white/20"
                        onPress={handleTakePhoto}
                        activeOpacity={0.9}
                    >
                        <View className="w-20 h-20 bg-white border-2 border-slate-200 rounded-full items-center justify-center">
                            <Camera size={28} color="#374151" />
                        </View>
                    </TouchableOpacity>

                    {/* Flip Camera Button */}
                    <TouchableOpacity
                        className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl items-center justify-center border border-white/30 ml-8"
                        onPress={() => setFacing(facing === "back" ? "front" : "back")}
                        activeOpacity={0.8}
                    >
                        <RotateCcw size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default App