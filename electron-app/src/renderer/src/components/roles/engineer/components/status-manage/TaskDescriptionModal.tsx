import { useState } from 'react';
import { Button, Text, TextArea, Modal } from '@gravity-ui/uikit';
import { Task } from '@services/taskService';
import { CommentService, Comment as CommentType } from '@services/commentService';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TaskService } from '../../../../../services/taskService';

export interface ExtendedComment extends Omit<CommentType, 'author'> {
  author: { username: string } | null;
}


interface TaskDetailsModalProps {
  selectedTask: Task | null;
  onClose: () => void;
  comments: ExtendedComment[];
  newComment: string;
  setNewComment: (value: string) => void;
  handleSubmitComment: () => void;
  handleStatusChange: (statusName: string) => void;
  replyToId: number | null;
  setReplyToId: (id: number | null) => void;
  isSubmittingComment: boolean;
  isLoading: boolean;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: ru });
};

export const TaskDetailsModal = ({
  selectedTask,
  onClose,
  comments,
  newComment,
  setNewComment,
  handleSubmitComment,
  handleStatusChange,
  replyToId,
  setReplyToId,
  isSubmittingComment,
  isLoading,
}: TaskDetailsModalProps) => {

  const [showStatusConfirmation,setShowStatusConfirmation] = useState(false);
  const [targetStatus,setTargetStatus] = useState<string|null>(null);
  const [isChaingingStatus,setIsChangingStatus] = useState(false);

  const statusNameToId:Record<string,number> = {
    'Ожидание запуска': 1,
    'На выполнении': 2,
    'Миссия выполнена': 3,
    'Отменена': 4,
    'Приостановлена': 5,
    'На проверке': 6,
    'Просрочена': 7,
    'Назначена': 8,
    'В очереди': 9,
  };

  const handleStatusChangeClick = (statusName: string) => {
    setTargetStatus(statusName);
    setShowStatusConfirmation(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedTask || !targetStatus) return;

    setIsChangingStatus(true);
    try {
      // Get the status ID from the mapping
      const statusId = statusNameToId[targetStatus];
      if (!statusId) {
        throw new Error('Invalid status name');
      }

      // Call your API to update the task status
      await TaskService.updateTaskStatus(selectedTask.id, statusId);

      // Close the confirmation modal
      setShowStatusConfirmation(false);
      // You might want to refresh the task data here or update local state
    } catch (error) {
      console.error('Error changing task status:', error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <Modal open={!!selectedTask} onOpenChange={onClose}>
      <div style={{
        padding: '24px',
        borderRadius: '8px',
      }}>
        {selectedTask && (
          <>
            <Text variant="header-1">{selectedTask.title}</Text><br />
            <Text>{selectedTask.description}</Text><br />
            <Text>Срок: {new Date(selectedTask.due_date).toLocaleDateString()}</Text>

            <div style={{ marginTop: '24px' }}>
              <Text variant="subheader-2">Комментарии:</Text>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                margin: '16px 0',
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '12px'
              }}>
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} style={{
                      marginBottom: '12px',
                      padding: '12px',
                      borderRadius: '4px',
                      borderWidth: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text variant="subheader-2">
                          {comment.author?.username || 'Аноним'}
                        </Text>
                        <Text color="secondary">
                          {comment.created_at ? formatDate(comment.created_at) : ''}
                        </Text>
                      </div>
                      <Text style={{ marginTop: '8px' }}>{comment.text}</Text>
                      <Button
                        size="s"
                        view="flat-secondary"
                        onClick={() => setReplyToId(comment.id)}
                        style={{ marginTop: '8px' }}
                      >
                        Ответить
                      </Button>
                    </div>
                  ))
                ) : (
                  <Text color="secondary">Нет комментариев</Text>
                )}
              </div>

              <TextArea
                placeholder={replyToId ? 'Ваш ответ...' : 'Новый комментарий...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                minRows={3}
                style={{ marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  view="action"
                  onClick={handleSubmitComment}
                  loading={isSubmittingComment}
                  disabled={!newComment.trim()}
                >
                  Отправить
                </Button>
                {replyToId && (
                  <Button
                    view="flat-secondary"
                    onClick={() => setReplyToId(null)}
                  >
                    Отменить
                  </Button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Text variant="subheader-2">Изменить статус:</Text>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px',flexDirection:'column' }}>
                <Button
                  view="outlined-success"
                  onClick={() => handleStatusChangeClick('Миссия выполнена')}
                  loading={isLoading}
                  disabled={isChaingingStatus}
                >
                  Завершить
                </Button>
                <Button
                  view="outlined-info"
                  onClick={() => handleStatusChangeClick('На проверке')}
                  disabled={isChaingingStatus}
                >
                  На проверку
                </Button>

                <Button
                  view="outlined-danger"
                  onClick={() => handleStatusChange('Приостановлена')}
                  disabled={isChaingingStatus}
                >
                  Приостановить
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};