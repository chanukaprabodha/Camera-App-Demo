import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native'
import { DATA_KEY } from '@/constants';
import React from 'react'

const asyncStorage = () => {
    const storeData = async () => {
        try {
            await AsyncStorage.setItem(DATA_KEY, "this is data");
            // save the tokens
        } catch (e) {
            // saving error
        }
    }

    const getData = async () => {
        try {
            await AsyncStorage.getItem(DATA_KEY);
            //Remove value or handle the logic
        } catch (e) {
            // error reading value
        }
    }

}

export default asyncStorage