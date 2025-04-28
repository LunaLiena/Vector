import { Button, TextInput, Text, Card, User } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import { UserForm } from "@shared/UserForm";
import {UserService} from "@services/userService";
import { type User as UserType} from '@api-types/user';
import api from "@api/api";

export const UserManagement = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<Array<UserType>>('/users');
      setUsers(response.data || []); // Добавлено || [] на случай если data undefined
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await UserService.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Не удалось удалить пользователя');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-management">
      <Card view="raised" className="section-card">
        <div className="section-header">
          <Text variant="header-2">Состав экипажа</Text>
          <div className="controls">
            <TextInput 
              placeholder="Поиск по имени..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button view="action" onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}>
              Добавить члена экипажа
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Text>Загрузка данных...</Text>
        ) : error ? (
          <Text color="danger">{error}</Text>
        ) : filteredUsers.length === 0 ? (
          <Text>Пользователи не найдены</Text>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <Card key={user.id} view="filled" className="user-card">
                <div className="user-info">
                  <User
                    name={user.username}
                    avatar={user.avatar}
                    size="xl"
                  />
                  <div className="user-details">
                    <Text variant="subheader-2">{user.username}</Text>
                    <Text color="secondary">{user.role?.name || 'Не назначено'}</Text>
                    <Text color="hint">{user.status?.statusName || 'Статус не указан'}</Text>
                  </div>
                </div>
                <div className="user-actions">
                  <Button view="outlined" onClick={() => handleEdit(user)}>
                    Редактировать
                  </Button>
                  <Button view="outlined-danger" onClick={() => handleDelete(user.id)}>
                    Списать
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {showForm && (
        <UserForm 
          user={editingUser} 
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onSuccess={() => {
            fetchUsers();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};