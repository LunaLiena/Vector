import axios from 'axios';
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';
import api from '@api/api';

export const setUpInterceptors = () => {
  axios.interceptors.request.use((config) => {
    const { accessToken } = useUserStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // api.ts
  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try refreshing token
          const { refreshToken } = useUserStore.getState();
          const refreshResponse = await api.post('/auth/refresh', {
            refresh_token: refreshToken
          });

          const { access_token, refresh_token } = refreshResponse.data;

          // Update tokens in store and localStorage
          useUserStore.getState().setUser({
            accessToken: access_token,
            refreshToken: refresh_token
          });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout user
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};