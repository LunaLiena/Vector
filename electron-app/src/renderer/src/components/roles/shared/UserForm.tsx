import { Button, TextInput, Label, Text, Select, Modal } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import  api  from "@api/api";

export const UserForm = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleId: '',
    statusId: ''
  });
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRolesAndStatuses();
    
    if (user) {
      setFormData({
        username: user.username,
        password: '',
        roleId: user.role?.id || '',
        statusId: user.status?.id || ''
      });
    }
  }, [user]);

  const fetchRolesAndStatuses = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, statusesRes] = await Promise.all([
        api.get('/roles'),
        api.get('/status')
      ]);
      setRoles(rolesRes.data);
      setStatuses(statusesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (user) {
        // Обновление пользователя
        await api.put(`/users/${user.id}`, formData);
      } else {
        // Создание пользователя
        await api.post('/register', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="user-form">
        <Text variant="header-2">{user ? 'Редактировать члена экипажа' : 'Добавить нового члена экипажа'}</Text>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label>Имя пользователя:</Label>
            <TextInput 
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <Label>Пароль:</Label>
            <TextInput 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <Label>Звание:</Label>
            <Select
              name="roleId"
              value={[formData.roleId]}
              onUpdate={(value) => setFormData(prev => ({ ...prev, roleId: value[0] }))}
              options={roles.map(role => ({
                value: role.id,
                content: role.name
              }))}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <Label>Статус:</Label>
            <Select
              name="statusId"
              value={[formData.statusId]}
              onUpdate={(value) => setFormData(prev => ({ ...prev, statusId: value[0] }))}
              options={statuses.map(status => ({
                value: status.id,
                content: status.statusName
              }))}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-actions">
            <Button view="normal" type="button" onClick={onClose}>
              Отмена
            </Button>
            <Button view="action" type="submit" loading={isLoading}>
              {user ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};