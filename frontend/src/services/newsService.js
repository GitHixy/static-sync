import api from "./axiosInterceptor";



export const fetchNews = async () => {
  try {
    const response = await api.get(`/api/lodestone/news`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
