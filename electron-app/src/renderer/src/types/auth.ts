export interface AuthContext {
    isAuth: boolean;
    role?: { id: number; name: string } | null;
}
