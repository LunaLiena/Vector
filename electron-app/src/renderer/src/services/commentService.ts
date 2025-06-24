import api from '@api/api'
import { createSWRService } from './swrService'
import { mutate } from 'swr'
import { Task } from '@services/taskService'
import { User } from '@api-types/user'

export interface Comment {
  id: number
  task_id: number
  task: Task
  author_id: number
  author: User
  text: string
  created_at: string
}

export interface CreateCommentRequest {
  text: string
}

export interface UpdateCommentRequest {
  text: string
}

export const CommentService = {
  createTaskComment: async (task_id: number, comment: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post<Comment>(`/tasks/${task_id}/comments`, comment)
    return response.data
  },

  getTaskComments: async (task_id: number): Promise<Array<Comment>> => {
    const response = await api.get<Array<Comment>>(`/tasks/${task_id}/comments`)
    return response.data
  },

  updateComment: async (commentId: number, comment: UpdateCommentRequest): Promise<Comment> => {
    const response = await api.put<Comment>(`/comments/${commentId}`, comment)
    return response.data
  },

  deleteTaskComment: async (task_id: number): Promise<void> => {
    await api.delete<Comment>(`/tasks/${task_id}/comments`)
  },

  swr: {
    useTaskComments: (task_id: number) =>
      createSWRService('task-comments', CommentService.getTaskComments).useQuery(task_id),
    mutateTaskComments: (task_id: number) => {
      mutate(['task-comments', task_id])
    }
  }
}
