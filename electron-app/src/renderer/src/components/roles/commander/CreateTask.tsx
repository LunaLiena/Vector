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
import { apiGet, apiPost } from '@api/api';
import { User } from '@api-types/user';
import { DateTime } from '@gravity-ui/date-utils';

export const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<DateTime | null>(null);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [users, setUsers] = useState<Array<User>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // Fetch available users (not admins and not busy)
  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        setLoading(true);
        const response = await apiGet<Array<User>>('/users/assignable');
        const response_user = await apiGet<User>('/users/me');
        setUsers(response);
        setUser(response_user);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load available users');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !assignedTo) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await apiPost('/tasks', {
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
      <Text variant="header-1">Create New Task</Text>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <TextInput
            label="Title:"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            size="l"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Label theme='normal'>Description</Label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            minRows={4}
            size="l"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <DatePicker
            label="Due Date:"
            value={dueDate}
            onUpdate={(date) => setDueDate(date)}
            pin='brick-brick'
            placeholder="Select due date"
            size="l"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Select
            label="Assign To:"
            value={[assignedTo]}
            onUpdate={(vals) => setAssignedTo(vals[0])}
            options={userOptions}
            placeholder="Select a crew member"
            size="l"
            disabled={loading}
            renderOption={(option) => (
              <div>
                <Text>{option.content}</Text>
              </div>
            )}
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
          Create Task
        </Button>
      </form>

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