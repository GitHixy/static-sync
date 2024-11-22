import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SuccessScreen = ({ navigation }) => {
    const handleDeepLink = async (url) => {
        if (!url) {
            Alert.alert('Error', 'No URL received');
            navigation.replace('Login');
            return;
        }

        const { queryParams } = Linking.parse(url);
        const { auth, refreshToken, id, username, discordId } = queryParams;

        if (auth && refreshToken && id && username && discordId) {
            try {
                await AsyncStorage.setItem('token', auth);
                await AsyncStorage.setItem('refreshToken', refreshToken);
                await AsyncStorage.setItem('userId', id);
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('discordId', discordId);
                navigation.replace('Home');
            } catch (error) {
                console.error('Error saving data:', error);
                Alert.alert('Error', 'Failed to save login data');
                navigation.replace('Login');
            }
        } else {
            Alert.alert('Error', 'Invalid login data');
            navigation.replace('Login');
        }
    };

    useEffect(() => {
        const getInitialURL = async () => {
            const url = await Linking.getInitialURL();
            handleDeepLink(url);
        };

        const onLink = ({ url }) => handleDeepLink(url);

        Linking.addEventListener('url', onLink);
        getInitialURL();

        return () => Linking.removeEventListener('url', onLink);
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size={50} color="#007bff" />
            <Text style={styles.text}>Processing Login...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: '#333',
    },
});

export default SuccessScreen;







