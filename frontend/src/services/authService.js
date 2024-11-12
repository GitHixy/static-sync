import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL;

export const loginUser = async (email, password) => {
  try { 
    const response = await axios.post(`${apiUrl}/api/users/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/api/users/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
