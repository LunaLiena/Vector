import { router } from '@renderer/routes/router';
import { create } from 'zustand';
import { userStore } from '@store/userStore';

interface AuthState {
    isAuth: boolean;
    role: { id: number; name: string } | null;
    login: (accessToken: string, refreshToken: string, role?: { id: number; name: string }) => void;
    logout: () => void;
    refresh: (accessToken: string) => void;
}

// Функция безопасного получения состояния
const getInitialAuthState = () => ({
    isAuth: !!localStorage.getItem('accessToken'),
    role: localStorage.getItem('role') ? JSON.parse(localStorage.getItem('role')!) : null
});

export const authStore = create<AuthState>((set) => ({
    ...getInitialAuthState(),

    login: (accessToken, refreshToken, role) => {

        if (!role) {
            throw new Error('Role is required for login');
        }

        userStore.getState().setUser({
            accessToken, refreshToken, role, username: '',
        })
        set({ isAuth: true, role: role });
        router.invalidate();
    },

    logout: () => {
        userStore.getState().clearUser();
        set({ isAuth: false, role: null });
        router.navigate({ to: '/' });
    },

    refresh: (accessToken) => {
        const role = userStore.getState().role;
        userStore.getState().setUser({ accessToken });
        set({ role });
    }
}));

export const useAuthStore = authStore;