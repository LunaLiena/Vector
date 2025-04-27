import api, { apiDelete, apiGet } from "@api/api";
import type { User } from '@api-types/user'


export interface UpdateUserData {
    username?: string;
    role_id?: number;
    status_id?: number | null;
}

export const UserService = {
    getAllUsers: (): Promise<Array<User>> => apiGet<Array<User>>('/users'),
    getUserById: (id: number): Promise<User> => apiGet<User>(`/users/${id}`),
    deleteUser: (userId: number): Promise<void> => apiDelete<void>(`/users/${userId}`),

    async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get('/users/me');
            return response.data;
        } catch (err) {
            console.error('Error fetching current user:', err);
            throw err;
        }
    },

    async updateUser(id: number, userData: UpdateUserData): Promise<User> {
        try {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error updating user ${id}:`, error);
            throw error;
        }
    },


    async resetPassword(id: number): Promise<{ password: string }> {
        try {
            const response = await api.post(`/users/${id}/reset-password`);
            return response.data;
        } catch (error) {
            console.error(`Error resetting password for user ${id}:`, error);
            throw error;
        }
    },

    async getUserRole(id: number): Promise<{ id: number, name: string }> {
        try {
            const response = await api.get(`users/${id}/role`);
            return response.data;
        } catch (err) {
            console.error(`Error fetching role for user ${id}:`, err);
            throw err;
        }
    }
}