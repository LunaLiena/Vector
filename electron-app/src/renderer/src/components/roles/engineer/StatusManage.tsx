import { useState, useEffect } from 'react';
import { Spin } from '@gravity-ui/uikit';
import { Task, TaskService } from '@services/taskService';
import { CommentService } from '@services/commentService';
import { ExtendedComment, TaskDetailsModal } from './components/status-manage/TaskDescriptionModal';
import { TaskStatus, TaskStatusService } from '@services/taskStatusService';
import { UserService } from '@services/userService';
import { TaskCard } from './components/status-manage/TaskCard';
import { mutate } from 'swr';
import { TaskConfirmModal } from './components/status-manage/TaskConfirmModal';

export const StatusManage = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [users, setUsers] = useState<{ id: number, username: string }[]>([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [taskData, statusData, usersData] = await Promise.all([
          TaskService.getMyTasks(),
          TaskStatusService.getTaskStatuses(),
          UserService.getAllUsers()
        ]);
        setTasks(taskData);
        setStatuses(statusData);
        setUsers(usersData);
        console.log('Tasks loaded:', taskData); // Отладочная информация
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error('Ошибка загрузки:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Загрузка комментариев при выборе задачи
  useEffect(() => {
    if (!selectedTask) return;

    const loadComments = async () => {
      try {
        const commentsData = await CommentService.getTaskComments(selectedTask.id);
        const commentsWithAuthors = commentsData.map(comment => ({
          ...comment,
          author: users.find(u => u.id === comment.author_id) || null
        }));
        setComments(commentsWithAuthors);
        console.log('Comments loaded for task:', selectedTask.id, commentsWithAuthors);
      } catch (err) {
        console.error('Ошибка загрузки комментариев:', err);
      }
    };

    loadComments();
  }, [selectedTask, users]);

  const handleTaskSelect = async (task: Task) => {
    console.log('Selecting task:', task.id);
    try {
      setIsLoading(true);
      const taskDetails = await TaskService.getTaskById(task.id);
      console.log('Task details:', taskDetails);
      setSelectedTask(taskDetails);
    } catch (err) {
      console.error('Ошибка загрузки задачи:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!selectedTask || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const comment = await CommentService.createTaskComment(
        selectedTask.id,
        { text: newComment }
      );

      const commentWithAuthor = {
        ...comment,
        author: users.find(u => u.id === comment.author_id) || null
      };

      setComments(prev => [...prev, commentWithAuthor]);
      setNewComment('');
      setReplyToId(null);
    } catch (err) {
      console.error('Ошибка добавления комментария:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStatusChange = async (statusName: string) => {
    if(!selectedTask)return;

    const statusId = statuses.find(s=>
      s.status_name.toLowerCase() === statusName.toLowerCase()
    )?.id;

    if(!statusId){
      console.error('Статус не найден:',statusName);
      setError('Указанный статус не существует');
      return;
    }

    try{
      setIsLoading(true);
      const updatedTask = await TaskService.updateTaskStatus(selectedTask.id,statusId);

      setTasks(prev=>prev.map(t=>
        t.id === updatedTask.id ? updatedTask : t
      ));
      setSelectedTask(updatedTask);
      setError(null);

    }catch(err){
      console.error('Ошибка изменения статуса:', err);
      setError('Не удалось изменить статус');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedTask || pendingStatusId === null) return;

    try {
      setIsLoading(true);
      await TaskService.updateTaskStatus(selectedTask.id, pendingStatusId);
      mutate('/api/tasks');

      const updatedTasks = await TaskService.getTasks();
      setTasks(updatedTasks);
      
      const updatedTask = updatedTasks.find(t=>t.id===selectedTask.id);
      
      setSelectedTask(updatedTask || null);
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setPendingStatusId(null);
    }
  };

  if (isLoading) return <Spin size="l" />;
  if (error) return <div>{error}</div>;

  // Фильтрация задач по статусу "На выполнении"
  const inProgressTasks = tasks.filter(task=>
    task.status?.status_name === 'На выполнении'
  );

  console.log('Rendering with selectedTask:', selectedTask); // Отладочная информация

  return (
    <div style={{ padding: '20px' }}>
      <h2>Задачи в работе</h2>
      <br />
      <TaskCard 
        taskProgressList={inProgressTasks} 
        handleTaskSelect={handleTaskSelect} 
      />

      {/* Модальное окно с деталями задачи */}
      <TaskDetailsModal 
        selectedTask={selectedTask} 
        onClose={()=>setSelectedTask(null)} 
        comments={comments} 
        newComment={newComment} 
        setNewComment={setNewComment} 
        handleSubmitComment={handleSubmitComment}
        handleStatusChange={handleStatusChange}
        replyToId={replyToId} 
        setReplyToId={setReplyToId}
        isSubmittingComment={isSubmittingComment} 
        isLoading={isLoading}        
      />

      {/* Модальное окно подтверждения */}
      <TaskConfirmModal 
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        confirmStatusChange={confirmStatusChange}
      />
    </div>
  );
};