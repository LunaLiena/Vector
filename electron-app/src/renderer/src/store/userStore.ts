import { create } from 'zustand';
import type { User } from '@renderer/types/user';

interface UserState {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
}

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.error('Failed to parse localStorage value:', value);
    return fallback;
  }
};

export const userStore = create<UserState>((set) => ({
  user: localStorage.getItem('accessToken') ? {
    username: localStorage.getItem('username') || '',
    role: safeJsonParse(localStorage.getItem('role'), null),
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  } : null,

  setUser: (partialUser) => {
    set((state) => {
      const user = state.user || {
        username: '',
        role: null,
        accessToken: '',
        refreshToken: ''
      };

      const updatedUser = { ...user, ...partialUser };

      // Update localStorage
      if (partialUser.accessToken) localStorage.setItem('accessToken', partialUser.accessToken);
      if (partialUser.refreshToken) localStorage.setItem('refreshToken', partialUser.refreshToken);
      if (partialUser.role) localStorage.setItem('role', JSON.stringify(partialUser.role));
      if (partialUser.username) localStorage.setItem('username', partialUser.username);

      return { user: updatedUser };
    });
  },

  clearUser: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

    set({ user: null });
  }
}));

// Экспортируем и хук для использования в компонентах
export const useUserStore = userStore;