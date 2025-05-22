import axios from 'axios';
import { authStore } from '@store/authStore';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Track failed refresh attempts
let failedRefreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1; // Only try once before logging out

api.interceptors.request.use(config => {
  const { user } = authStore.getState();
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If not a 401 or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we've already tried refreshing, logout immediately
    if (failedRefreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      authStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Mark as retrying
    originalRequest._retry = true;
    failedRefreshAttempts++;

    try {
      const { refreshToken: currentRefreshToken } = authStore.getState().user || {};
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      // Attempt to refresh the token
      const response = await axios.post(`${API_URL}/refresh`, {
        refresh_token: currentRefreshToken
      });

      const newAccessToken = response.data.access_token;
      authStore.getState().refresh(newAccessToken);

      // Update the original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Reset failed attempts on success
      failedRefreshAttempts = 0;

      return api(originalRequest);
    } catch (refreshError) {
      // On any refresh error, logout the user
      authStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;