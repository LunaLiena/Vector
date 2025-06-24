import { Role } from '@api-types/role'

export interface User {
  username: string
  role: Role | null
  accessToken: string
  refreshToken: string
}
