import api from '@api/api';
import { UserService } from '@services/userService';

// Получаем хранилища напрямую
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';

export const authService = {

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await api.post('/login', credentials);
      const { access_token, refresh_token } = response.data; // Получаем роль сразу из ответа


      const userResponse = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const userData = userResponse.data;
      console.log('Full user data:', userData);

      if (!userData.role) {
        throw new Error('Role information not available in user data');
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      useAuthStore.getState().login(access_token, refresh_token, userData.role);
      useUserStore.getState().setUser({
        username: userData.username,
        role: userData.role,
        accessToken: access_token,
        refreshToken: refresh_token
      });


      return {
        ...response.data,
        role: userData.role
      };// Возвращаем роль в ответе
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout() {
    localStorage.clear();
    useAuthStore.getState().logout();
  }
};