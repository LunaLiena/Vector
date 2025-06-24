export interface TaskStatus {
  id: number
  status_name: string
  description?: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
}

export interface UpdateTaskStatusRequest {
  status_id: number
}

export interface TaskStatusUpdateResponse {
  task: Task
  new_status: TaskStatus
}
