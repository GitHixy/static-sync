import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL;

export const fetchServerStatus = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/server-status`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch server status:", error);
    throw error;
  }
};
