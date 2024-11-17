import api from './axiosInterceptor';

export const fetchActPlugins = async () => {
  try {
    const response = await api.get('/api/act/plugins');
    return response.data;
  } catch (error) {
    console.error('Error fetching ACT plugins:', error.message);
    throw new Error('Failed to fetch ACT plugins');
  }
};

export const fetchActOverlays = async () => {
  try {
    const response = await api.get('/api/act/overlays');
    return response.data;
  } catch (error) {
    console.error('Error fetching ACT overlays:', error.message);
    throw new Error('Failed to fetch ACT overlays');
  }
};

export const fetchDalamudPlugins = async () => {
  try {
    const response = await api.get('/api/dalamud/plugins');
    return response.data;
  } catch (error) {
    console.error('Error fetching Dalamud plugins:', error.message);
    throw new Error('Failed to fetch Dalamud plugins');
  }
};

export const fetchDalamudRepos = async () => {
  try {
    const response = await api.get('/api/dalamud/repos');
    return response.data;
  } catch (error) {
    console.error('Error fetching Dalamud repos:', error.message);
    throw new Error('Failed to fetch Dalamud repos');
  }
};
