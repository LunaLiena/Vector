import { Progress } from '@gravity-ui/uikit';
import { useState } from 'react';
import { UserCard } from './task-progress-components/UserCard';
import { TaskProgressPanel } from './task-progress-components/TaskProgressPanel';

interface Task {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
}

interface User {
  id: string;
  name: string;
  tasks: Task[];
}

export const TaskProgress = () => {
  // Состояние для хранения выбранного пользователя
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'Иван Иванов',
      tasks: [
        { id: '1', name: 'Разработка API', status: 'completed', progress: 100 },
        { id: '2', name: 'Тестирование', status: 'in_progress', progress: 65 },
      ],
    },
    {
      id: '2',
      name: 'Петр Петров',
      tasks: [
        { id: '3', name: 'Дизайн макетов', status: 'not_started', progress: 0 },
        { id: '4', name: 'Верстка', status: 'in_progress', progress: 30 },
      ],
    },
    {
      id: '3',
      name: 'Сидор Сидоров',
      tasks: [
        { id: '5', name: 'Документация', status: 'in_progress', progress: 80 },
      ],
    },
  ];

  // Получаем выбранного пользователя
  const selectedUser = selectedUserId
    ? users.find(user => user.id === selectedUserId)
    : null;

  // Функция для обработки выбора пользователя
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  return (
    <div style={{ display: 'flex', gap: '32px' }}>
      {/* Список пользователей */}
      <div style={{ width: '250px' }}>
        <h2>Пользователи</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.map(user => (
            <UserCard 
              key={user.id} 
              id={user.id} 
              name={user.name} 
              taskCount={user.tasks.length} 
              selected={selectedUserId === user.id} 
              onSelect={handleUserSelect} 
            />
          ))}
        </div>
      </div>

      {/* Список задач с прогрессом */}
      <div style={{ flex: 1 }}>
        <h2>Прогресс задач</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {
            selectedUser ? <TaskProgressPanel 
              userName={selectedUser.name} 
              tasks={selectedUser.tasks} 
            /> :
              users.map(user=>(
                <TaskProgressPanel 
                  key={user.id} 
                  userName={user.name} 
                  tasks={user.tasks} 
                />
              ))
          }
        </div>
      </div>
    </div>
  );
};