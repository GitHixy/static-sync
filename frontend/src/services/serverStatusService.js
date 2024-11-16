import api from "./axiosInterceptor";

export const fetchServerStatus = async () => {
  try {
    const response = await api.get(`/api/server-status`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch server status:", error);
    throw error;
  }
};
