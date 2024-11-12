import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL;

export const fetchMaintenance = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/lodestone/maintenance`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch maintenance data');
  }
};
