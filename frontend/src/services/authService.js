import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './axiosInterceptor';



export const loginUser = async (email, password) => {
  const response = await api.post('/api/users/login', { email, password });
  const { accessToken, refreshToken } = response.data;

  await AsyncStorage.setItem('token', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  return response.data;
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post(`/api/users/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
