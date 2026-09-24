import axios from 'react';
import axiosInstance from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Para el emulador de Android 10.0.2.2 equivale a localhost. 
// Para iOS o Web es localhost.
// IMPORTANTE: Si usas Expo Go en un dispositivo físico, cambia esto por tu IP local (ej. 192.168.1.X)
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5190/api' : 'http://localhost:5190/api';

const api = axiosInstance.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
