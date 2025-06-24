import useSWR from 'swr'
import { WorkerStatusService } from '@services/workerStatusService'

export const useStatuses = (options?: { refreshInterval?: number }) => {
  const key = '/api/statuses'
  const { data, error, isLoading, mutate } = useSWR(
    key,
    WorkerStatusService.getWorkerStatuses,
    options
  )
  return {
    statuses: data ?? [],
    isLoading,
    error,
    mutate
  }
}
