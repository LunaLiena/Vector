import { ApiStatus } from '@api-types/status';
import { Role } from '@api-types/role';

export interface User {
    assignable: boolean;
    id: number;
    username: string;
    role?: Role;
    status?: ApiStatus;
    avatar?: string;
    email?: string;
}