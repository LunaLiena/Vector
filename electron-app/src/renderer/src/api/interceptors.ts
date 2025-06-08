import axios from 'axios';
import { useAuthStore } from '@store/authStore';

export const setUpInterceptors = () => {
  axios.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { refreshToken } = useAuthStore.getState();

          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await axios.post('/api/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;

          // Обновим accessToken в хранилище
          const { user, login } = useAuthStore.getState();
          login({ accessToken: access_token, refreshToken, user: user! });

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (err) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};
