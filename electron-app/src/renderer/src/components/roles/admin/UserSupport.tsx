import { Button, TextInput, Label, Text, Card, User } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import  api  from "@api/api";

export const UserSupport = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    try {
      await api.post(`/users/${selectedUser.id}/reset-password`, {
        newPassword
      });
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className="user-support">
      <Card view="raised" className="section-card">
        <Text variant="header-2">Поддержка экипажа</Text>
        
        <div className="support-content">
          <div className="user-list">
            <Text variant="subheader-2">Выберите члена экипажа:</Text>
            {isLoading ? (
              <Text>Загрузка данных...</Text>
            ) : (
              <div className="users-grid">
                {users.map(user => (
                  <Card 
                    key={user.id} 
                    view={selectedUser?.id === user.id ? 'outlined' : 'filled'}
                    className="user-card"
                    onClick={() => setSelectedUser(user)}
                  >
                    <User
                      name={user.username}
                      imgUrl={user.avatar}
                      size="l"
                    />
                    <Text>{user.username}</Text>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {selectedUser && (
            <div className="support-actions">
              <Card view="raised" className="action-card">
                <Text variant="subheader-2">Сброс пароля для {selectedUser.username}</Text>
                
                <div className="form-group">
                  <Label>Новый пароль:</Label>
                  <TextInput 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  view="action" 
                  onClick={handleResetPassword}
                  disabled={!newPassword}
                >
                  Установить новый пароль
                </Button>
              </Card>

              <Card view="raised" className="action-card">
                <Text variant="subheader-2">Другие действия</Text>
                <Button view="outlined" className="action-button">
                  Разблокировать аккаунт
                </Button>
                <Button view="outlined" className="action-button">
                  Изменить статус
                </Button>
                <Button view="outlined" className="action-button">
                  Показать активность
                </Button>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};