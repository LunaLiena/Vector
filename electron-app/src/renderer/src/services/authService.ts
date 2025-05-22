import api from '@api/api';

// Получаем хранилища напрямую
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';
import { User } from '@api-types/user';

export const authService = {

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await api.post('/login', credentials);
      const { access_token, refresh_token } = response.data;

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

      // Создаем объект пользователя для передачи в хранилище
      const user: User = {
        username: userData.username,
        role: userData.role,
        ...(userData.status && { status: userData.status }),
        ...(userData.avatar && { avatar: userData.avatar })
      };

      // Передаем одним объектом, как ожидает authStore
      useAuthStore.getState().login({
        accessToken: access_token,
        refreshToken: refresh_token,
        role: userData.role,
        username: userData.username
      });

      useUserStore.getState().setUser(user);

      return {
        ...response.data,
        role: userData.role
      };
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