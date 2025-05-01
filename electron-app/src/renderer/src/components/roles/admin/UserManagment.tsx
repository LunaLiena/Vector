import { Button, TextInput, Text, Card, User } from "@gravity-ui/uikit";
import { useState, useEffect, CSSProperties } from "react";
import { UserForm } from "@shared/UserForm";
import {UserService} from "@services/userService";
import { Stack } from "./admin-components/stack";
import { type User as UserType} from '@api-types/user';
import api from "@api/api";

export const UserManagement = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<Array<UserType>>('/users');
      setUsers(response.data || []);
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
    <div style={{height:'100%'}}>
      <Card view="raised" className="section-card" style={{ display: 'flex', flexDirection: 'column', height: '100%',overflow:'hidden' }}>
        {/* Фиксированная верхняя часть */}
        <div style={{ padding: 12, flexShrink: 0 }}>
          <Text variant="header-2">Состав экипажа</Text>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <TextInput 
              placeholder="Поиск по имени..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <Button 
              view="action" 
              onClick={() => {
                setEditingUser(undefined);
                setShowForm(true);
              }}
            >
              Добавить члена экипажа
            </Button>
          </div>
        </div>

        {/* Прокручиваемая область с карточками */}
        <div style={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          padding: 12,
          marginTop: 8
        }}>
          {isLoading ? (
            <Text>Загрузка данных...</Text>
          ) : error ? (
            <Text color="danger">{error}</Text>
          ) : filteredUsers.length === 0 ? (
            <Text>Пользователи не найдены</Text>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredUsers.map(user => (
                <Card key={user.id} view="outlined" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      
                      <Stack gap={4}>
                        <Text variant="subheader-2">{user.username}</Text>
                        <Text color="secondary">{user.role?.name || 'Роль не назначена'}</Text>
                      </Stack>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button view="outlined" size="m" onClick={() => handleEdit(user)}>
                        Редактировать
                      </Button>
                      <Button view="outlined-danger" size="m" onClick={() => handleDelete(user.id)}>
                        Списать
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <UserForm 
          user={editingUser} 
          onClose={() => {
            setShowForm(false);
            setEditingUser(undefined);
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

interface OutterContainerProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

export const OutterContainer = ({ children, style }: OutterContainerProps) => (
  <div style={{ height: '100%', ...style }}>
    {children}
  </div>
);