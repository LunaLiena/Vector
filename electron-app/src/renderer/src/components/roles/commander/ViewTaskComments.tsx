import { useMemo, useState } from 'react';
import { Spin, Text } from '@gravity-ui/uikit';
import useSWR from 'swr';
import { TaskService, Task } from '@services/taskService';
import { CommentService } from '@services/commentService';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import { TaskListTable } from './comment-components/TaskListTable';
import { CreateCommentArea } from './comment-components/CommentArea';
import { CommentHistory } from './comment-components/CommentHistory';

export const ViewTaskComments = () => {
  const { data: taskData, isLoading: loadingTasks } = useSWR('/api/tasks', TaskService.getTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const {
    data: commentsData,
    mutate: refreshComments,
    isLoading: loadingComments
  } = useSWR(
    selectedTaskId ? ['task-comments', selectedTaskId] : null,
    ([, taskId]) => CommentService.getTaskComments(taskId)
  );

  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!selectedTaskId || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await CommentService.createTaskComment(selectedTaskId, {
        text: newComment,
      });
      setNewComment('');
      setReplyToId(null);
      await refreshComments();
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (event: RowClickedEvent<Task>) => {
    if (event.data) {
      setSelectedTaskId(event.data.id);
      CommentService.swr.mutateTaskComments(event.data.id);
    }
  };

  const columnDefs = useMemo<ColDef<Task>[]>(() => [
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
        color: params.value === 'Завершена' ? 'green' :
          params.value === 'В работе' ? 'orange' : 'gray'
      })
    }
  ], []);

  if (loadingTasks) return <Spin size="l" />;

  return (
    <div style={{ display: 'flex', color: '#fff' }}>
      {/* Список задач */}
      <div style={{ flex: 2, minWidth: '300px', marginRight: 16 }}>
        <h3>📋 Задачи</h3>
        <TaskListTable 
          rowData={taskData || []} 
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
                  loadingComments={loadingComments} 
                  commentsData={commentsData} 
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#aaa'
          }}>
            <Text variant="body-2">Выберите задачу, чтобы просмотреть комментарии</Text>
          </div>
        )}
      </div>
    </div>
  );
};