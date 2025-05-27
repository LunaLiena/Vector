import api from '@api/api';

// Получаем хранилища напрямую
import { useAuthStore } from '@store/authStore';

export const authService = {

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await api.post('/login', credentials);
      const { access_token, user } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      useAuthStore.getState().login({
        accessToken: access_token,
        user
      });

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout() {
    try{
      delete api.defaults.headers.common['Authorization'];
      useAuthStore.getState().logout();
    } catch(error) {
      console.error('Logout error:', error);
    }
  },

  async checkAuth(){
    const {accessToken,isAuth} = useAuthStore.getState();
    if(!accessToken || !isAuth){
      this.logout();
      return false;
    }
    return true;
  }
};