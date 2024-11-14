import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL;

export const fetchCharacterData = async (name, serverSlug, serverRegion) => {
  try {
    const response = await axios.get(`${apiUrl}/api/fflogs/character/${name}/${serverSlug}/${serverRegion}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching character data:", error.message);
    throw error;
  }
};
