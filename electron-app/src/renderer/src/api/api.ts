import axios from 'axios';
import { authStore } from '@store/authStore';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  response => response,
  error => {
    // Если токен истек или недействителен
    if (error.response?.status === 401) {
      authStore.getState().logout();
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }
    return Promise.reject(error);
  }
);

export default api;