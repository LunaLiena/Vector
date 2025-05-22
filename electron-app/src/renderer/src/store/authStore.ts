import { router } from '@renderer/routes/router';
import { create } from 'zustand';
import { userStore } from '@store/userStore';
import type { User } from '@renderer/types/user';


interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  login: (params: {
    accessToken: string;
    refreshToken: string;
    role: User['role'];
    username: string;
  }) => void;

  logout: () => void;
  refresh: (accessToken: string) => void;
  setUser: (user: Partial<User>) => void;
}

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.error('Failed to parse localStorage value:', value);
    return fallback;
  }
};

export const authStore = create<AuthState>((set) => ({
  isAuth: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: localStorage.getItem('accessToken') ? {
    username: localStorage.getItem('username') || '',
    role: safeJsonParse(localStorage.getItem('role'), null),
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  } : null,

  login: ({ accessToken, refreshToken, role, username }) => {
    if (!role) throw new Error('Role is required for login');

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', JSON.stringify(role));
    localStorage.setItem('username', username);

    set({
      isAuth: true,
      accessToken,
      refreshToken,
      user: {
        username,
        role,
        accessToken,
        refreshToken
      }
    });
    router.invalidate();
  },

  refresh: (accessToken) => {
    set((state) => {
      localStorage.setItem('accessToken', accessToken);
      return {
        accessToken,
        user: state.user ? {
          ...state.user,
          accessToken
        } : null
      };
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

    set({
      isAuth: false,
      accessToken: null,
      refreshToken: null,
      user: null
    });

    router.navigate({ to: '/' });
  },

  setUser: (partialUser) => {
    set((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...partialUser };

      if (partialUser.accessToken) {
        localStorage.setItem('accessToken', partialUser.accessToken);
      }
      if (partialUser.refreshToken) {
        localStorage.setItem('refreshToken', partialUser.refreshToken);
      }
      if (partialUser.role) {
        localStorage.setItem('role', JSON.stringify(partialUser.role));
      }
      if (partialUser.username) {
        localStorage.setItem('username', partialUser.username);
      }

      return {
        user: updatedUser,
        ...(partialUser.accessToken && { accessToken: partialUser.accessToken }),
        ...(partialUser.refreshToken && { refreshToken: partialUser.refreshToken })
      };
    });
  }
}));

export const useAuthStore = authStore;