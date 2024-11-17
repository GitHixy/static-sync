import api from './axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};


export const createStatic = async (name, description) => {
  const token = await getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post(`/api/statics`, { name, description }, config);
  return response.data;
};


export const fetchStatics = async () => {
  const token = await getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/api/statics`, config);
  return response.data;
};

export const fetchStaticById = async (staticId) => {
  const token = await getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.get(`/api/statics/${staticId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching static by ID:', error.message);
    throw error;
  }
};



export const addMemberToStatic = async (staticId, player) => {
  const token = await getToken();
  
  
  try {
      const response = await api.post(`/api/statics/${staticId}/members`, 
        {
          playerId: player.data.id,
          name: player.name,
          lodestoneID: player.lodestoneID,
          role: player.role,
          playerClass: player.class,
          data: player.data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

      return response.data;
  } catch (error) {
      console.error('Error adding member to static:', error.message);
      throw error;
  }
};

export const updateStaticMembers = async (staticId) => {
  const token = await getToken();

  try {
    const response = await api.put(
      `/api/statics/${staticId}/update-members`,
      {playerId: staticId},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error('Error updating static members:', error.message);
    throw error;
  }
};

export const deleteStatic = async (staticId) => {
  const token = await getToken();

  try {
    const response = await api.delete(`/api/statics/${staticId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting static:', error.message);
    throw error;
  }
};


