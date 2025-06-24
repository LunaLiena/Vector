import { useMemo, useState } from 'react'
import { Spin, Text } from '@gravity-ui/uikit'
import useSWR from 'swr'
import { TaskService, Task } from '@services/taskService'
import { CommentService, Comment as CommentType } from '@services/commentService'
import { ColDef, RowClickedEvent } from 'ag-grid-community'
import { TaskListTable } from './comment-components/TaskListTable'
import { CreateCommentArea } from './comment-components/CommentArea'
import { CommentHistory } from './comment-components/CommentHistory'
import { UserService } from '@services/userService'
import { TaskStatusService } from '@renderer/services/taskStatusService'

export const ViewTaskComments = () => {
  const { data: taskData, isLoading: loadingTasks } = useSWR('/api/tasks', TaskService.getTasks)
  const { data: usersData, isLoading: loadingUsers } = useSWR('/api/users', UserService.getAllUsers)
  const { data: taskStatusData, isLoading: loadingTaskStatusData } = useSWR(
    '/api/load-status-data',
    TaskStatusService.getTaskStatuses
  )
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  const [newComment, setNewComment] = useState('')
  const [replyToId, setReplyToId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: commentsData,
    mutate: refreshComments,
    isLoading: loadingComments
  } = useSWR<Array<CommentType>>(selectedTaskId ? `/tasks/${selectedTaskId}/comments` : null, () =>
    selectedTaskId ? CommentService.getTaskComments(selectedTaskId) : Promise.resolve([])
  )

  console.log('Comments data:', commentsData)

  const handleSubmitComment = async () => {
    if (!selectedTaskId || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      await CommentService.createTaskComment(selectedTaskId, {
        text: newComment
      })
      setNewComment('')
      setReplyToId(null)
      await refreshComments()
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRowClick = (event: RowClickedEvent<Task>) => {
    if (event.data) {
      setSelectedTaskId(event.data.id)
    }
  }

  const commentsWithAuthors = useMemo(() => {
    if (!commentsData || !usersData) return commentsData
    return commentsData.map((comment) => ({
      ...comment,
      author: usersData.find((u) => u.id === comment.author_id) || null
    }))
  }, [commentsData, usersData])

  const tasksWithStatus = useMemo(() => {
    if (!taskData || !taskStatusData) return []
    const statusMap = new Map(taskStatusData.map((status) => [status.id, status]))
    return taskData.map((task) => ({
      ...task,
      status: statusMap.get(task.status_id) || { id: task.status_id, status_name: 'not found' }
    }))
  }, [taskData, taskStatusData])

  const columnDefs = useMemo<ColDef<Task>[]>(
    () => [
      {
        headerName: 'Название задачи',
        field: 'title',
        flex: 1,
        cellStyle: { color: '#000' }
      },
      {
        headerName: 'Статус',
        field: 'status.status_name',
        width: 150,
        cellStyle: (params) => ({
          color:
            params.value === 'Миссия выполнена'
              ? 'green'
              : params.value === 'На выполнении'
                ? 'orange'
                : 'gray'
        })
      }
    ],
    []
  )

  if (loadingTasks || loadingComments || loadingTaskStatusData) return <Spin size="l" />

  return (
    <div style={{ display: 'flex', color: '#fff' }}>
      {/* Список задач */}
      <div style={{ flex: 2, minWidth: '300px', marginRight: 16 }}>
        <h3>📋 Задачи</h3>
        <TaskListTable
          rowData={tasksWithStatus || []}
          columnDefs={columnDefs}
          onRowClicked={handleRowClick}
        />
      </div>

      {/* Комментарии */}
      <div style={{ flex: 2 }}>
        <h3>💬 Комментарии {selectedTaskId && `(Задача #${selectedTaskId})`}</h3>

        {selectedTaskId ? (
          <>
            {loadingComments ? (
              <Spin size="m" />
            ) : (
              <>
                <CommentHistory
                  selectedTaskId={selectedTaskId}
                  loadingComments={loadingComments || loadingUsers}
                  commentsData={commentsWithAuthors}
                  setReplyToId={setReplyToId}
                />

                <CreateCommentArea
                  replyToId={replyToId}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleSubmitComment={handleSubmitComment}
                  isSubmitting={isSubmitting}
                  setReplyToId={setReplyToId}
                />
              </>
            )}
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#aaa'
            }}
          >
            <Text variant="body-2">Выберите задачу, чтобы просмотреть комментарии</Text>
          </div>
        )}
      </div>
    </div>
  )
}
