import { router } from '@renderer/routes/router';
import { create } from 'zustand';
import { useUserStore } from '@store/userStore';
import { redirect } from '@tanstack/react-router';

interface AuthState {
    isAuth: boolean;
    login: (accessToken: string, refreshToken: string, role: { id: number; name: string }) => void;
    logout: () => void;
    refresh: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({


    isAuth: !!localStorage.getItem('accessToken'),
    login: (accessToken, refreshToken, role) => {
        useUserStore.getState().setUser({
            accessToken,
            refreshToken,
            role,
            username: '' // временно, будет обновлено после получения данных пользователя
        });
        set({ isAuth: true });
        router.invalidate();
    },
    logout: () => {
        useUserStore.getState().clearUser();
        set({ isAuth: false });
        router.navigate({ to: '/' });
    },
    refresh: (accessToken) => {
        useUserStore.getState().setUser({ accessToken });
    },


    beforeLoad: ({ context }) => {
        console.log('LoginRoute beforeLoad', {
            isAuth: context.auth.role.name
        });
        throw redirect(context.auth.role.name)
    },
}));