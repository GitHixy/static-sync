import axios from 'axios';
url = process.env.EXPO_API_URL
export const loginUser = async (email, password) => {
  try { 
    const response = await axios.post(`${url}/api/users/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${url}/api/users/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
