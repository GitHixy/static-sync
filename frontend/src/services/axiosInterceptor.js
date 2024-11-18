import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL || 'http://192.168.1.60:5000';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log('Interceptor triggered:', error.response?.status, error.response?.data);

        if (
            error.response &&
            error.response.status === 401 &&
            (error.response.data.message === 'jwt expired' || error.response.data.message === 'Not authorized, token failed') &&
            !originalRequest._retry
        ) {
            console.log('JWT expired or token failed, attempting token refresh...');
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                console.log('Refresh Token:', refreshToken);

                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                const response = await axios.post(`${apiUrl}/api/refresh`, { token: refreshToken });
                console.log('Token refreshed successfully:', response.data);

                const newAccessToken = response.data.accessToken;
                await AsyncStorage.setItem('token', newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                Alert.alert('Session Expired', 'Please log in again.');
                await AsyncStorage.clear();
            }
        }

        return Promise.reject(error);
    }
);


export default api;


