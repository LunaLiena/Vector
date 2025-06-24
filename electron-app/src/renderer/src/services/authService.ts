import api from '@api/api'

// Получаем хранилища напрямую
import { useAuthStore } from '@store/authStore'
import { notify } from './notificationService'
import { LoginRequest } from '@renderer/types/api-types'

export const authService = {
  tokenExpirationTime: null as NodeJS.Timeout | null,

  async login(credentials: LoginRequest) {
    try {
      const response = await api.post('/login', credentials)
      const { access_token, user, expires_in } = response.data

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      useAuthStore.getState().login({
        accessToken: access_token,
        user
      })

      notify.system.successLogin(user.username)

      // Запускаем таймер для предупреждения об истечении токена
      this.scheduleTokenExpirationWarning(expires_in)

      return user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  logout() {
    try {
      if (this.tokenExpirationTime) {
        clearTimeout(this.tokenExpirationTime)
        this.tokenExpirationTime = null
      }

      delete api.defaults.headers.common['Authorization']
      useAuthStore.getState().logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  async checkAuth() {
    const { accessToken, isAuth } = useAuthStore.getState()
    if (!accessToken || !isAuth) {
      this.logout()
      return false
    }
    return true
  },

  scheduleTokenExpirationWarning(expiresIn: number) {
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime)
    }

    const warningTime = expiresIn - 300
    if (warningTime > 0) {
      this.tokenExpirationTime = setTimeout(() => {
        notify.system.tokenExpiringSoon()

        const remainingTime = expiresIn - warningTime
        setTimeout(() => {
          notify.system.sessionExpired()
          this.logout()
        }, remainingTime * 1000)
      }, warningTime * 1000)
    }
  }
}
