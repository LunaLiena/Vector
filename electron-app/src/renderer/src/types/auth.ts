export interface AuthContext {
    isAuth: boolean;
    role?: { id: number; name: string } | null;
    routes?: { id: number; name: string; description: string } | null;
}
