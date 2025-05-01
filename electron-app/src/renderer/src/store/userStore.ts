import { create } from 'zustand';
import type { User } from '@renderer/types/user';

interface UserState extends User {
    setUser: (user: Partial<UserState>) => void;
    clearUser: () => void;
}

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        console.error('Failed to parse localStorage value:', value);
        return fallback;
    }
}

export const userStore = create<UserState>((set) => ({
    username: localStorage.getItem('username') || '',
    role: safeJsonParse(localStorage.getItem('role'), null),
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    setUser: (user) => {
        if (user.accessToken) localStorage.setItem('accessToken', user.accessToken);
        if (user.refreshToken) localStorage.setItem('refreshToken', user.refreshToken);
        if (user.role) localStorage.setItem('role', JSON.stringify(user.role));
        if (user.username) localStorage.setItem('username', user.username);

        set((state) => ({ ...state, ...user }));
    },
    clearUser: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('username');

        set({
            username: '',
            role: null,
            accessToken: '',
            refreshToken: ''
        });
    }
}));

// Экспортируем и хук для использования в компонентах
export const useUserStore = userStore;