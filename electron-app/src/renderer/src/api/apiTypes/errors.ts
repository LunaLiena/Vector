export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public details?: unknown,
    public isAxiosError = false
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  /**
   * Проверяет, является ли ошибка ошибкой API
   */
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  }

  /**
   * Преобразует любую ошибку в ApiError
   */
  static from(error: unknown): ApiError {
    if (ApiError.isApiError(error)) {
      return error
    }

    if (typeof error === 'string') {
      return new ApiError(error)
    }

    if (error instanceof Error) {
      // Обработка axios ошибок
      if ('isAxiosError' in error && error.isAxiosError) {
        const axiosError = error as {
          response?: {
            status?: number
            data?: {
              message?: string
              details?: unknown
            }
          }
          message: string
        }

        return new ApiError(
          axiosError.response?.data?.message || axiosError.message,
          axiosError.response?.status,
          axiosError.response?.data?.details,
          true
        )
      }

      return new ApiError(error.message)
    }

    return new ApiError('Unknown error')
  }
}

/**
 * Типизированные ошибки для конкретных статусов
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends ApiError {
  constructor(
    public details: Record<string, string[]>,
    message = 'Validation failed'
  ) {
    super(message, 422)
    this.name = 'ValidationError'
  }
}
