import api from '@api/api';
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';
import { UserService } from '@services/userService';
import { LoginResponse } from '../types/api';


export const authService = {
    async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
        try {
            const response = await api.post('/login', credentials);
            const { access_token, refresh_token, role } = response.data;

            useAuthStore.getState().login(access_token, refresh_token, role);
            const userData = await UserService.getCurrentUser();

            useUserStore.getState().setUser({
                username: userData.username,
                role: userData.role || null,
                accessToken: access_token,
                refreshToken: refresh_token,
            });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    logout() {
        useAuthStore.getState().logout();
    }
}