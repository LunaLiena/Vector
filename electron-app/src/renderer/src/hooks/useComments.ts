import useSWR from 'swr'
import { CommentService } from '@services/commentService'

export const useComments = (taskId: number | null) => {
  const { data, error, mutate } = useSWR(taskId ? `/api/tasks/${taskId}/comments` : null, () =>
    CommentService.getTaskComments(taskId!)
  )

  return {
    comments: data ?? [],
    error,
    refreshComments: mutate
  }
}
