import useSWR from 'swr'
import { TaskService } from '@services/taskService'

export const useTasks = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/tasks', TaskService.getMyTasks)

  return {
    tasks: data ?? [],
    isLoading,
    error,
    refreshTasks: mutate
  }
}
