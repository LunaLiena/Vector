import { User } from '@api-types/user'

export interface WorkerStatus {
  id: number
  name: string
  workers?: Array<User>
}
