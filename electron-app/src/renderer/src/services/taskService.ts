import api, { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@api/api'
import { TaskStatusResponse } from '@api-types/task-status';
import type { Task } from '@api-types/task'
import type { CreateTaskRequest, UpdateTaskRequest } from '@api-types/task';

export const TaskService = {
    getAllTasks: (): Promise<Array<Task>> => apiGet<Array<Task>>('/tasks'),
    getTaskById: (id: number): Promise<Task> => apiGet<Task>(`/tasks/${id}`),
    createTask: (taskData: CreateTaskRequest): Promise<Task> => apiPost<Task>('/tasks', taskData),
    updateTask: (id: number, taskData: UpdateTaskRequest): Promise<Task> => apiPut<Task>(`/tasks/${id}`, taskData),
    deleteTask: (id: number): Promise<void> => apiDelete<void>(`tasks/${id}`),
    getTaskStatuses: (): Promise<Array<TaskStatusResponse>> => apiGet<Array<TaskStatusResponse>>('/task-statuses'),
    updateTaskStatus: (taskId: number, statusId: number): Promise<Task> => apiPatch<Task>(`tasks/${taskId}/status`, { status_id: statusId }),
    getMyTasks: (): Promise<Array<Task>> => apiGet<Array<Task>>('tasks/me'),
    getTasksICreated: (): Promise<Array<Task>> => apiGet<Array<Task>>('/tasks/created-by-me')
}