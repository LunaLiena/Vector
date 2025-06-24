import api from '@api/api'
import type { Notification } from '@api-types/notification'
import { ToastNotification } from './notificationService'

export const notificationService = {
  async getNotifications(params?: {
    type?: string
    isRead?: boolean
    page?: number
    limit?: number
  }): Promise<Array<Notification>> {
    const queryParams = new URLSearchParams()

    if (params?.type) queryParams.append('type', params.type)
    if (params?.isRead !== undefined) queryParams.append('is_read', String(params.isRead))
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))

    const response = await api.get(`/notifications?${queryParams.toString()}`)
    return response.data as Array<Notification>
  },

  async markAsRead(id: string) {
    await api.put(`/notification/${id}/read`)
  },

  async markAllAsRead() {
    // Можно добавить такой endpoint на бэкенде, если нужно
    // await api.put('/notifications/read-all');
  },

  async createSystemNotification(notification: ToastNotification) {
    //создание системных уведомлений
    //await api.post('/notifications/system',notification);
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count')
    return response.data.count
  }
}
