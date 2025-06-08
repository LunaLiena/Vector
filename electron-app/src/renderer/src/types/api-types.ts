// src/types/api.ts
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    role: {
        id: number;
        name: string;
    };
}


export interface LoginRequest {
    username: string;
    password: string;
}