import { router } from '@renderer/routes/router';
import { create } from 'zustand';
import { userStore } from '@store/userStore';
import type { User } from '@renderer/types/user';


interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
  user: User | null;

  login: (params: {
    accessToken: string;
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

export const authStore = create<AuthState>((set) => ({
  isAuth: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,

  login: ({ accessToken, user }) => {

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      isAuth: true,
      accessToken,
      user
    });
    router.invalidate();
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    set({
      isAuth: false,
      accessToken: null,
      user: null
    });

    router.navigate({ to: '/' });
  },

}));

export const useAuthStore = authStore;