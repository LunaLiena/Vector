import { Button, TextInput, Text, Card, User } from "@gravity-ui/uikit";
import { useState, useEffect, CSSProperties } from "react";
import { UserForm } from "@shared/UserForm";
import {UserService} from "@services/userService";
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
    <OutterContainer>
      <Card view="raised" className="section-card">
        <div className="section-header" style={{padding:12}}>
          <Text variant="header-2">Состав экипажа</Text>
          <div className="controls" style={{marginTop:5}}>
            <TextInput 
              placeholder="Поиск по имени..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button view="action" onClick={() => {
              setEditingUser(undefined);
              setShowForm(true);
            }} style={{marginTop:12}}>
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
          <div className="users-grid" style={{margin:12}}>
            {filteredUsers.map(user => (
              <Card key={user.id} view="outlined" className="user-card" style={{marginBottom:6}}>
                <div className="user-info" style={{margin:12}}>
                  <User
                    name={user.username}
                    avatar={user.avatar}
                    size="xl"
                  />
                  <Stack>
                    <Text variant="subheader-2">{user.username}</Text>
                    <Text color="secondary">Роль: {user.role?.name || 'Не назначено'}</Text>
                    <Text color="hint">{user.status?.statusName || 'Статус не указан'}</Text>
                  </Stack>
                </div>
                <div className="user-actions" style={{margin:12}}>
                  <Button view="outlined" onClick={() => handleEdit(user)} style={{marginRight:7}}>
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
            setEditingUser(undefined);
          }}
          onSuccess={() => {
            fetchUsers();
            setShowForm(false);
          }}
        />
      )}
    </OutterContainer>
  );
};

interface OutterContainerProps{
  children:React.ReactNode;
  style?:CSSProperties;
}

interface StackProps{
  children:React.ReactNode;
  gap?:number;
}

const Stack = ({children,gap=1}:StackProps) => (
  <div style={{display:'flex',flexDirection:'column',gap:`${gap}px`}}>
    {children}
  </div>
)

const OutterContainer = ({children}:OutterContainerProps) =>(
  <div>
    {children}
  </div>
)
