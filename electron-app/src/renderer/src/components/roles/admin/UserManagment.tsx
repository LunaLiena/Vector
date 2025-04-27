import { Button, TextInput, Text, Card, User } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import { UserForm } from "@shared/UserForm";
import {UserService} from "@services/userService";
import type {User as UserType} from '@api-types/user';

export const UserManagement = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error,setError] = useState<string|null>(null);


    const fetchUsers = async () =>{
      setIsLoading(true);
      setError(null);
      try{
        const response = await UserService.getAllUsers();
        setUsers(Array.isArray(response) ? response : []);
      }catch(err){
        console.error('Failed to fetch users:', error);
        setError('Не удалось загрузить пользователей');
        setUsers([]);
      }finally{
        setIsLoading(false);
      }
    };

    useEffect(()=>{
      fetchUsers();
    },[]);

  const handleEdit = (user:UserType)=>{
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId:number)=>{
    try{
      await UserService.deleteUser(userId);
      await fetchUsers();
    }catch(err){
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user=>user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  
  if (isLoading) {
    return <Text>Загрузка данных...</Text>;
  }

  if (error) {
    return <Text color="danger">{error}</Text>;
  }

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
        ) : (
          <div className="users-grid">
            {users.map(user => (
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

      {error &&(
        <div className="error-message">
          <Text color="danger">{error}</Text>
        </div>
      )}
    </div>
  );
};