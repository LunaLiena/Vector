import { Button, Text, Card, Checkbox, Modal, Box } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import { RoleForm } from "@shared/RoleForm";
import api from '@api/api';
import {Route} from '@api-types/route';
import { Role } from "@api-types/role";

interface ModalWindowProps {
  routes: Array<Route>;
  role: Role | null;
}

const PermissionsModal = ({ routes, role }: ModalWindowProps) => {
  return (
    <Box style={{padding:2}}>
      <Text variant="subheader-2" as="h3" className="permissions-title">
        Разрешения для роли: {role?.name}
      </Text>
      <div className="permissions-grid">
        {routes.map(route => (
          <Box key={route.id} style={{padding:2}}>
            <Checkbox
              checked={role?.routes?.some(r => r.id === route.id) || false}
              disabled
              size="l"
            >
              <Text variant="body-2">{route.description || route.description}</Text>
            </Checkbox>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [routes, setRoutes] = useState<Array<Route>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [rolesResponse,routesResponse] = await Promise.all([
        api.get<Array<Role>>('/roles'),
        api.get<Array<Route>>('/routes'),
      ]);
      

      console.log('Roles response:',rolesResponse);
      console.log('Routes response:',routesResponse);

      setRoles(rolesResponse.data || []);
      setRoutes(routesResponse.data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(()=>{
    fetchData();
  },[]);

  const handleDelete = async (roleId: number) => {

    if (!window.confirm('Вы уверены, что хотите удалить эту роль?')) return;

    try {
      setIsLoading(true);
      await api.delete(`/roles/${roleId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting role:', error);
      setError('Ошибка удаления роли');
    }finally{
      setIsLoading(false);
    }
  };

  const handleShowPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  return (

    <div className="role-management">
      <Card view="raised" className="section-card">
        <div className="section-header">
          <Text variant="header-2">Управления ролями</Text>
          <Button view="action" onClick={() => {
            setEditingRole(null);
            setShowForm(true);
          }}
          loading={isLoading}
          >
            Создать новое звание
          </Button>
        </div>

        {error && (
          <div className="error-message">
            <Text color="danger">{error}</Text>
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">
            <Text>Загрузка данных...</Text>
          </div>
        ) : (
          <div className="roles-list">
            {!roles || roles.length === 0 ? (
              <div className="empty-state">
                <Text>Нет доступных ролей</Text>
              </div>
            ) : (
              roles.map(role => (
                <Card key={role.id} view="filled" className="role-card">
                  <div className="role-header">
                    <Text variant="subheader-2">{role.name}</Text>
                    {role.description && (
                      <Text color="secondary">{role.description}</Text>
                    )}
                  </div>

                  <div className="role-actions">
                    <Button view="outlined" onClick={() => handleShowPermissions(role)} disabled={isLoading}>
                      Просмотр разрешений
                    </Button>
                    <Button view="outlined" onClick={() => {
                      setEditingRole(role);
                      setShowForm(true);
                    }}>
                      Редактировать
                    </Button>
                    <Button view="outlined-danger" onClick={() => handleDelete(role.id)} loading={isLoading}>
                      Удалить
                    </Button>
                  </div>
                </Card>
              ))
            )}
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
            fetchData();
            setShowForm(false);
          }}
        />
      )}

      <Modal open={showPermissionsModal} onOpenChange={() => setShowPermissionsModal(false)}>
        <Card view="raised" className="permissions-modal-card">
          {selectedRole && (
            <PermissionsModal 
              routes={routes || []} 
              role={selectedRole} 
            />
          )}
          <div className="modal-footer">
            <Button view="normal" onClick={() => setShowPermissionsModal(false)}>
              Закрыть
            </Button>
          </div>
        </Card>
      </Modal>
    </div>

    );
};