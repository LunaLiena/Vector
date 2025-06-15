import { CSSProperties, ReactNode, useState, useEffect } from 'react';
import { Button, TextInput, Label, Text, Select, Modal, useToaster } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';
import api from '@api/api';
import { Role } from '@api-types/role';
import { User } from '@api-types/user';
import { BaseModalForm } from './BaseModalForm';

interface UserFormProps {
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

interface Status {
  id: number;
  statusName: string;
}

const MotionDiv = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const UserForm = ({ user, onClose, onSuccess }: UserFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleId: '',
    statusId: ''
  });
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState({
    data: false,
    submit: false
  });
  const { add } = useToaster();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, data: true }));
      try {
        const [rolesRes, statusesRes] = await Promise.all([
          api.get<Role[]>('/roles'),
          api.get<Status[]>('/status')
        ]);
        
        setRoles(rolesRes.data);
        setStatuses(statusesRes.data);
        
        if (user) {
          setFormData({
            username: user.username,
            password: '',
            roleId: user.role?.id.toString() || '',
            statusId: user.status?.id.toString() || ''
          });
        }
      } catch (error) {
        add({
          name: 'load-error',
          title: 'Ошибка загрузки',
          content: 'Не удалось загрузить данные',
          theme: 'danger',
          autoHiding: 5000,
        });
      } finally {
        setLoading(prev => ({ ...prev, data: false }));
      }
    };

    fetchData();
  }, [user, add]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const payload = {
        ...formData,
        roleId: Number(formData.roleId),
        statusId: Number(formData.statusId)
      };

      if (user) {
        await api.put(`/users/${user.id}`, payload);
        add({
          name: 'update-success',
          title: 'Успешно',
          content: 'Данные пользователя обновлены',
          theme: 'success',
          autoHiding: 3000,
        });
      } else {
        await api.post('/register', payload);
        add({
          name: 'create-success',
          title: 'Успешно',
          content: 'Пользователь создан',
          theme: 'success',
          autoHiding: 3000,
        });
      }
      onSuccess();
    } catch (error) {
      add({
        name: 'save-error',
        title: 'Ошибка',
        content: 'Не удалось сохранить данные',
        theme: 'danger',
        autoHiding: 5000,
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <BaseModalForm
      title={user ? 'Редактировать члена экипажа' : 'Добавить нового члена экипажа'}
      onClose={onClose}
      width={500}
    >
          
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px' }}>
            <Text variant="subheader-2">Имя пользователя</Text>
          </div>
          <TextInput
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите имя пользователя"
            size="l"
            disabled={loading.data}
            hasClear
          />
        </div>
            
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px' }}>
            <Text variant="subheader-2">Пароль</Text>
          </div>
          <TextInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            size="l"
            disabled={loading.data}
            hasClear
          />
        </div>
            
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px' }}>
            <Text variant="subheader-2">Звание</Text>
          </div>
          <Select
            value={formData.roleId ? [formData.roleId] : []}
            onUpdate={(value) => setFormData(prev => ({ ...prev, roleId: value[0] }))}
            options={roles.map(role => ({
              value: role.id.toString(),
              content: role.name
            }))}
            placeholder="Выберите звание"
            size="l"
            disabled={loading.data}
            filterable
            hasClear
          />
        </div>
            
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '16px'
        }}>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            style={{ flex: 1 }}
          >
            <Button
              view="outlined"
              type="button"
              onClick={onClose}
              size="l"
              width="max"
              disabled={loading.submit}
            >
                  Отмена
            </Button>
          </motion.div>
              
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            style={{ flex: 1 }}
          >
            <Button
              view="action"
              type="submit"
              loading={loading.submit}
              size="l"
              width="max"
            >
              {user ? 'Сохранить' : 'Создать'}
            </Button>
          </motion.div>
        </div>
      </form>
    </BaseModalForm>
  );
};
