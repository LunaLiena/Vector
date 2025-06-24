import { WorkerStatus } from '@api-types/worker-status'
import api from '@api/api'

export const WorkerStatusService = {
  getWorkerStatuses: async (): Promise<Array<WorkerStatus>> => {
    const response = await api.get<Array<WorkerStatus>>('/worker-statuses')
    return response.data
  },

  getWorkerStatusById: async (id: number): Promise<WorkerStatus> => {
    const response = await api.get<WorkerStatus>(`/worker-statuses/${id}`)
    return response.data
  },

  deleteWorkerStatusById: async (id: number): Promise<void> => {
    try {
      const response = await api.delete(`/worker-statuses/${id}`)
      return response.data
    } catch (err) {
      console.error('Error fetching from delete worker status api', err)
      throw err
    }
  }
}
