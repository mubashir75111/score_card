import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =====================================================
// SERVER URL
// IP ADDRESS SIRF YAHAN CHANGE KARNA HAI
// =====================================================

export const SERVER_URL = 'http://192.168.1.7:5000';

// =====================================================
// API
// =====================================================

const API = axios.create({
  baseURL: `${SERVER_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================================================
// JWT TOKEN
// Har request ke saath token automatically jayega
// =====================================================

API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default API;
