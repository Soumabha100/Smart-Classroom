import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your computer's actual IP address from the previous step
const API_URL = 'http://192.168.1.7:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;