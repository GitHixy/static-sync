import api from './axiosInterceptor';

export const fetchCharacterData = async (name, serverSlug, serverRegion) => {
  try {
    const response = await api.get(`/api/fflogs/character/${name}/${serverSlug}/${serverRegion}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching character data:", error.message);
    throw error;
  }
};
