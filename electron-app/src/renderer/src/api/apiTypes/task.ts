import { Status } from "@api-types/status";

export interface Task {
    id: number;
    title: string;
    description?: string;
    assigned_to: number;
    due_date: string;
    status: Status;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    assigned_to: number;
    due_date: string;
    status: string;
}
export interface UpdateTaskRequest {
    title: string;
    description?: string;
    assigned_to: number;
    due_date: string;
    status: string;
}