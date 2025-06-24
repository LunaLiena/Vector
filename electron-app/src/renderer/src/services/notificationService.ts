import { notificationService } from './notificationApiService'
import type { Notification } from '@api-types/notification'
import { toaster } from '../main'

export type ToastNotification = {
  title: string
  message: string
  type: 'normal' | 'info' | 'success' | 'warning' | 'danger' | 'utility'
  duration?: number
  broadcast?: boolean //рассылка для всех пользователей
  targetRoles?: Array<string>
}

export const notify = {
  showToast: (notification: ToastNotification) => {
    toaster.add({
      name: `notification-${Date.now()}`,
      title: notification.title,
      content: notification.message,
      theme: notification.type || 'normal',
      autoHiding: notification.duration || 5000
    })
  },

  fetchNotifications: async (params?: {
    type?: string
    isRead?: boolean
    page?: number
    limit?: number
  }): Promise<Array<Notification>> => {
    return notificationService.getNotifications(params)
  },

  markAsRead: async (id: string) => {
    await notificationService.markAsRead(id)
  },

  system: {
    successLogin: (username: string): void => {
      notify.showToast({
        title: 'Добро пожаловать',
        message: `Вы вошли как ${username}`,
        type: 'success',
        duration: 5000
      })
    },

    tokenExpiringSoon: (): void => {
      notify.showToast({
        title: 'Сессия скоро завершится',
        message: 'Ваша сессия истечет через 5 минут. Пожалуйста, сохраните изменения.',
        type: 'warning',
        duration: 10000
      })
    },

    sessionExpired: (): void => {
      notify.showToast({
        title: 'Сессия истекла',
        message: 'Пожалуйста, войдите снова',
        type: 'danger',
        duration: 10000
      })
    },

    broadcast: (notification: ToastNotification) => {
      if (notification.broadcast) {
        notificationService.createSystemNotification(notification)
      }
      notify.showToast(notification)
    }
  },

  initRealTimeUpdates() {
    const ws = new WebSocket('wss://my-api/notifications')
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      this.showToast(notification)
      this.updateUnreadCount()
    }
  },

  updateUnreadCount() {
    //logic for update count messages
  }
}

notify.initRealTimeUpdates()
