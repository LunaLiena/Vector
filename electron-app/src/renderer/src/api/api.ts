import { useUserStore } from '@store/userStore';
import { useAuthStore } from '@store/authStore';
import axios from 'axios';
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const { accessToken } = useUserStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, error => Promise.reject(error));


api.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const { refreshToken } = useUserStore.getState();
      const response = await api.post('/refresh', { refresh_token: refreshToken });
      const { access_token } = response.data;
      useAuthStore.getState().refresh(access_token);
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default api;

export const apiGet = <T>(url: string, params = {}): Promise<T> => api.get(url, { params });
export const apiPost = <T>(url: string, data = {}): Promise<T> => api.post(url, data);
export const apiPut = <T>(url: string, data = {}): Promise<T> => api.put(url, data);
export const apiPatch = <T>(url: string, data = {}): Promise<T> => api.patch(url, data);
export const apiDelete = <T>(url: string): Promise<T> => api.delete(url);