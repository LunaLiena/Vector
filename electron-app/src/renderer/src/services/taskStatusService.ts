import api from '@api/api';
import { createSWRService } from './swrService';
import { mutate } from 'swr';
export interface TaskStatus{
  id:number;
  status_name:string;
}

export interface CreateTaskStatusRequest{
  status_name:string;
}

export const TaskStatusService = {
  createTaskStatus:async (task_status:CreateTaskStatusRequest):Promise<TaskStatus>=>{
    const response = await api.post<TaskStatus>('/task-statuses',task_status);
    return response.data;
  },
  getTaskStatuses:async():Promise<Array<TaskStatus>>=>{
    const response = await api.get<Array<TaskStatus>>('/task-statuses');
    return response.data;
  },
  getTaskStatusById:async(id:number):Promise<TaskStatus>=>{
    const response = await api.get<TaskStatus>(`/tasks/${id}`);
    return response.data;
  },
  deleteTaskStatusById:async(id:number):Promise<TaskStatus>=>{
    const response = await api.delete<TaskStatus>(`/tasks/${id}`);
    return response.data;
  },

  swr:{
    useTaskStatuses:()=>createSWRService('task-statuses',TaskStatusService.getTaskStatuses).useQuery(),
    useTaskStatusById:(id:number)=>createSWRService('task-status-by-id',TaskStatusService.getTaskStatusById).useQuery(id),
    mutateAll:()=>{
      mutate('task-statuses');
      mutate('/^task-statuses-by-id/');
    },
  },
};