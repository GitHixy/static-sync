import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL;

export const fetchNews = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/lodestone/news`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
