import { create } from 'zustand';
import { router } from '@renderer/routes/router';
import type { User } from '@renderer/types/user';
import { getRouteByRole } from '@utils/getInterface';

interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  login: (params: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  }) => void;

  logout: () => void;
}

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.error('Failed to parse localStorage value:', value);
    return fallback;
  }
};

const getInitialUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? safeJsonParse<User|null>(userJson, null) : null;
};

export const authStore = create<AuthState>((set) => ({
  isAuth: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: getInitialUser(),

  login: ({ accessToken, refreshToken, user }) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      isAuth: true,
      accessToken,
      refreshToken: refreshToken || null,
      user,
    });

    router.navigate({to:getRouteByRole(user.role?.name ?? ''),replace:true});
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    set({
      isAuth: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });

    router.navigate({ to: '/',replace:true });

  },
}));

export const useAuthStore = authStore;
