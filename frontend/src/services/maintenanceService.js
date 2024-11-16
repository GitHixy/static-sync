import api from './axiosInterceptor';

export const fetchMaintenance = async () => {
  try {
    const response = await api.get(`/api/lodestone/maintenance`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch maintenance data');
  }
};
