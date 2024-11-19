import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const SuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const storeUserData = async () => {
            const params = route.params;

            if (params?.auth) {
                try {
                    
                    await AsyncStorage.setItem('Token', params.auth);
                    await AsyncStorage.setItem('userId', params.id);
                    await AsyncStorage.setItem('username', params.username);
                    await AsyncStorage.setItem('discordId', params.discordId);

                    
                    console.log('Token salvato:', params.auth);
                    console.log('Dati utente:', params);

                    
                    navigation.navigate('Home');
                } catch (error) {
                    console.error('Errore nel salvataggio dei dati:', error);
                    navigation.navigate('Login');
                }
            } else {
                
                navigation.navigate('Login');
            }
        };

        storeUserData();
    }, [route.params, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Authenticated!</Text>
            <ActivityIndicator size={50} color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
});

export default SuccessScreen;
