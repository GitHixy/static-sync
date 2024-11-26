import api from './axiosInterceptor';

export const fetchDalamudNews = async () => {
    try {
      const response = await api.get(`/api/dalamud-news`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character data:", error.message);
      throw error;
    }
  };