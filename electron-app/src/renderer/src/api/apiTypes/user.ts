export interface User {
    id: number;
    username: string;
    role?: {
        id: number;
        name: string;
    };
    status?: {
        id: number;
        statusName: string;
    };
    avatar?: string;
    email?: string;

}