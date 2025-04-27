
export interface User {
    username: string;
    role: { id: number; name: string } | null;
    accessToken: string;
    refreshToken: string;
}