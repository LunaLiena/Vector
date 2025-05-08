import { Button, Card, Select, Text, TextArea, TextInput, Toast } from '@gravity-ui/uikit';
import { useState, useEffect, CSSProperties, ReactNode } from 'react';
import { useUserStore } from '@store/userStore';
import api, { apiGet } from '@api/api';
import { User } from '@api-types/user';
import { DatePicker } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';
import { useNavigate,Link,createFileRoute } from '@tanstack/react-router';
import react from '@vitejs/plugin-react';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: DateTime | null;
  assignedTo: number | null;
  status_id: number;
}

interface Status {
  id: number;
  statusName: string;
}

export const CreateTask = () => {
  const { role } = useUserStore();
  const [users, setUsers] = useState<Array<User>>([]);
  const [statuses, setStatuses] = useState<Array<Status>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: null,
    assignedTo: null,
    status_id: 1 // "Ожидает запуска" по умолчанию
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        setIsLoading(true);
        setError(null);

        const userResponse = await apiGet<Array<User>>('/users');
        setUsers(userResponse);
      
        const statusesResponse = await apiGet<Array<Status>>('/worker-statuses');
        setStatuses(statusesResponse);
      }catch(err){
        console.error('Error fetching data:',err);
        setError('Ошибка при загрузке данных');
      }finally{
        setIsLoading(false);
      }
    };

    fetchData();
  },[]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: DateTime | null) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  };

  const handleUserSelect = (value: string[]) => {
    const userId = value[0] ? parseInt(value[0]) : null;
    setFormData(prev => ({ ...prev, assignedTo: userId }));
  };

  const handleStatusSelect = (value:Array<string>)=>{
    const statusId = value[0] ? parseInt(value[0]):1;
    setFormData(prev=>({...prev,status_id:statusId}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Автоматически определяем статус на основе условий
      let statusId = formData.status_id;
      const now = new Date();
      const dueDate = formData.dueDate.toDate();
      
      // Если срок уже прошел, устанавливаем статус "Просрочена"
      if (dueDate < now) {
        const overdueStatus = statuses.find(s => s.statusName === "Просрочена");
        if (overdueStatus) statusId = overdueStatus.id;
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate.toISOString(),
        assignedTo: formData.assignedTo,
        status_id: statusId
      };

      await api.post('/tasks', taskData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate({to:'/commander/manage-tasks'});
      }, 1500);

    } catch (error) {
      console.error('Error creating task:', error);
      setError('Ошибка при создании задачи');
    } finally {
      setIsLoading(false);
    }
  };
return(
   <div style={{  maxWidth: '1200px', margin: '0 auto' }}>
      <Card view="raised" style={{ padding: '20px' }}>
        <Text variant="header-2" style={{ marginBottom: '20px' }}>Создание новой задачи</Text>
        
        <form onSubmit={handleSubmit} style={{marginTop:'20px'}}>
          <DivForm title='Название задачи' htmlFor='title' reactComponent={
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Введите название задачи"
              size="l"
              style={{ width: '100%' }}
            />
          }/>

          <DivForm title='Описание' htmlFor='description' reactComponent={
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Введите описание задачи"
              minRows={3}
              size="l"
              style={{ width: '100%' }}
            />
          }/>

          <DivForm title='Срок выполнения*' htmlFor='label' reactComponent={
            <DatePicker
              value={formData.dueDate}
              onUpdate={handleDateChange}
              placeholder="Выберите дату"
              size="l"
              format="DD.MM.YYYY"
            />
          }/>

          <div style={{ marginBottom: '16px' }}>
            <Text variant="subheader-2" as="label">
              Назначить на*
            </Text>
            <Select
              value={formData.assignedTo ? [formData.assignedTo.toString()] : []}
              onUpdate={handleUserSelect}
              placeholder="Выберите пользователя"
              size="l"
              disabled={isLoading}
            >
              {users.map(user => (
                <Select.Option key={user.id} value={user.id.toString()}>
                  {user.username} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Text variant="subheader-2" as="label">
              Статус
            </Text>
            <Select
              value={[formData.status_id.toString()]}
              onUpdate={handleStatusSelect}
              placeholder="Выберите статус"
              size="l"
              disabled={isLoading}
            >
              {statuses.map(status => (
                <Select.Option key={status.id} value={status.statusName.toString()}>
                  {status.statusName}
                </Select.Option>
              ))}
            </Select>
          </div>

          {error && (
            <Text color="danger" style={{ marginBottom: '16px' }}>
              {error}
            </Text>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              type="submit"
              view="action"
              size="l"
              loading={isLoading}
              disabled={isLoading}
            >
              Создать задачу
            </Button>
            <Link to="/commander/read-tasks">
              <Button view="outlined" size="l">
                Отмена
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {success && (
        <Toast
          title="Задача успешно создана"
          autoHiding={3000}
          onClose={() => setSuccess(false)}
          className="success-toast"
          name="success-toast"
          removeCallback={() => {}}
        />
      )}
    </div>
)
};

const DivForm = ({title,htmlFor,reactComponent}:{title:string,htmlFor:string,reactComponent:ReactNode}) =>{
  
  const Div16px = ({children}:{children:ReactNode})=>{
    return(
    <div style={{marginBottom:'16px'}}>
      {children}
    </div>)
  }

  return(
    <Div16px>
      <Text variant='subheader-2' as='label' htmlFor={htmlFor}>{title}</Text>
      {reactComponent}
    </Div16px>

  )
}