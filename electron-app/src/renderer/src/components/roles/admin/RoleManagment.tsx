import { Button, TextInput, Label, Text, Card, Checkbox } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import { RoleForm } from "../shared/RoleForm";
import api from '@api/api';

export const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchRoutes();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const handleDelete = async (roleId) => {
    try {
      await api.delete(`/roles/${roleId}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  return (
    <div className="role-management">
      <Card view="raised" className="section-card">
        <div className="section-header">
          <Text variant="header-2">Звания и должности</Text>
          <Button view="action" onClick={() => {
            setEditingRole(null);
            setShowForm(true);
          }}>
            Создать новое звание
          </Button>
        </div>

        {isLoading ? (
          <Text>Загрузка данных...</Text>
        ) : (
          <div className="roles-list">
            {roles.map(role => (
              <Card key={role.id} view="filled" className="role-card">
                <div className="role-header">
                  <Text variant="subheader-2">{role.name}</Text>
                  <Text color="secondary">{role.description}</Text>
                </div>
                
                <div className="role-permissions">
                  <Text variant="subheader-3">Доступные действия:</Text>
                  <div className="permissions-grid">
                    {routes.map(route => (
                      <Checkbox 
                        key={route.id}
                        checked={role.routes?.some(r => r.id === route.id)}
                        disabled
                        size="l"
                      >
                        {route.description}
                      </Checkbox>
                    ))}
                  </div>
                </div>
                
                <div className="role-actions">
                  <Button view="outlined" onClick={() => {
                    setEditingRole(role);
                    setShowForm(true);
                  }}>
                    Редактировать
                  </Button>
                  <Button view="outlined-danger" onClick={() => handleDelete(role.id)}>
                    Удалить
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {showForm && (
        <RoleForm 
          role={editingRole} 
          routes={routes}
          onClose={() => {
            setShowForm(false);
            setEditingRole(null);
          }}
          onSuccess={() => {
            fetchRoles();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};