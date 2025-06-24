import { Route } from '@api-types/route'

export interface Role {
  id: number
  name: string
  routes?: Array<Route>
  description?: string
}
