import api from '@api/api'
import { createSWRService } from './swrService'
import { mutate } from 'swr'

export interface CreateTaskRequest {
  title: string
  description: string
  dueDate: string
  assignedTo: number
  createdBy: number
  statusId?: number
}

export interface Task {
  id: number
  title: string
  description: string
  due_date: string
  assigned_to: number
  created_by: number
  status_id: number
  status?: {
    id: number
    status_name: string
  }
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  dueDate?: string
  assignedTo?: number
  statusId?: number
}

export const TaskService = {
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task)

    return response.data
  },
  getTasks: async (): Promise<Array<Task>> => {
    const response = await api.get<Array<Task>>('/tasks')
    return response.data
  },
  getTaskById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`)
    return response.data
  },

  getTasksByUser: async (userId: number): Promise<Array<Task>> => {
    const response = await api.get<Array<Task>>(`/tasks/user/${userId}`)
    return response.data
  },

  getTasksForUsers: async (userIds: Array<number>): Promise<Array<Task>> => {
    const response = await api.get<Array<Task>>('/tasks/user', {
      params: { userIds: userIds.join(',') }
    })
    return response.data
  },

  getMyTasks: async (): Promise<Array<Task>> => {
    const response = await api.get<Array<Task>>('/tasks/user/me')
    return response.data
  },

  updateTask: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`tasks/${id}`, data)
    return response.data
  },
  updateTaskStatus: async (taskId: number, statusId: number): Promise<Task> => {
    const response = await api.patch<Task>(`tasks/${taskId}/status`, { status_id: statusId })
    return response.data
  },
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },

  swr: {
    useTasks: () => createSWRService('tasks', TaskService.getTasks).useQuery(),
    useTaskById: (id: number) =>
      createSWRService('task-by-id', TaskService.getTaskById).useQuery(id),
    useTasksByUser: (userId: number) =>
      createSWRService('tasks-by-user', TaskService.getTasksByUser).useQuery(userId),
    mutateAll: () => {
      mutate('tasks')
      mutate('/^task-by-id/')
      mutate('/^tasks-by-user/')
    }
  }
}
