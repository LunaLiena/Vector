export interface User {
    id: number;
    username: string;
    role?: {
        id: number;
        name: string;
    };
    status?: {
        id: number;
        status_name: string;
    };
    avatar?: string;
}