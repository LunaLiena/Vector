import { useState, useEffect } from 'react';
import {
  Button,
  Text,
  TextInput,
  Select,
  TextArea,
  Modal,
  Spin,
  Label,
} from '@gravity-ui/uikit';
import { DatePicker } from '@gravity-ui/date-components';
import api from '@api/api';
import { User } from '@api-types/user';
import { DateTime } from '@gravity-ui/date-utils';
import { UserService } from '../../../services/userService';

export const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<DateTime | null>(null);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [users, setUsers] = useState<Array<User>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<User>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // Fetch available users (not admins and not busy)

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        setLoading(true);
        setError('');


        const [currentUser, assignableUsers] = await Promise.all([
          UserService.getCurrentUser(),
          UserService.getAssignableUsers()
        ]);

        // Fetch current user
        setUser(currentUser);
        setUsers(assignableUsers);
        setFilteredUsers(assignableUsers);

      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load available users');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || (u.role?.name && u.role.name.toLowerCase().includes(searchTerm.toLowerCase())) || (u.status?.statusName && u.status.statusName.toLowerCase().includes(searchTerm.toLowerCase())));
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !assignedTo) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/tasks', {
        title,
        description,
        dueDate: dueDate.toISOString(),
        assignedTo: parseInt(assignedTo),
        createdBy: user?.id,
        statusId: 1, // "Ожидание запуска" status
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setDueDate(null);
      setAssignedTo('');
      setError('');
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({
    value: u.id.toString(),
    content: `${u.username} (${u.role?.name}) - ${u.status?.statusName}`,
  }));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Text variant="header-1">Создать новую задачу</Text>

      {loading && !users.length ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Spin size="l" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <TextInput
              label="Название задачи:"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
              size="l"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Label theme='normal'>Описание</Label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание задачи"
              minRows={4}
              size="l"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <DatePicker
              label="Дата:"
              value={dueDate}
              onUpdate={(date) => setDueDate(date)}
              pin='brick-brick'
              placeholder="Выберите крайнюю дату"
              size="l"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>

            <Label>Поиск пользователя:</Label>
            <TextInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Поиск по имени, роли или статусу'
              size='l'
              style={{ marginBottom: '10px' }}
            />

            <Select
              label="Назначить на:"
              value={[assignedTo]}
              onUpdate={(vals) => setAssignedTo(vals[0])}
              options={userOptions}
              placeholder="Выбрать исполняющего"
              size="l"
              disabled={loading}
              renderOption={(option) => (
                <div>
                  <Text>{option.content}</Text>
                </div>
              )}
              filterable={false}
            />
          </div>

          {error && (
            <div style={{ marginBottom: '20px', color: 'var(--g-color-text-danger)' }}>
              <Text color="danger">{error}</Text>
            </div>
          )}

          <Button
            view="action"
            size="l"
            type="submit"
            loading={loading}
          >
            Создать задачу
          </Button>
        </form>
      )}


      <Modal open={success} onClose={() => setSuccess(false)}>
        <div style={{ padding: '20px' }}>
          <Text variant="header-2">Task Created Successfully!</Text>
          <Text>Your task has been assigned to the selected crew member.</Text>
          <div style={{ marginTop: '20px' }}>
            <Button view="action" onClick={() => setSuccess(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};