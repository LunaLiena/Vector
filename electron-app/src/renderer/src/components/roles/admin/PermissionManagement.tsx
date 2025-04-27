import { Button, TextInput, Label, Text, Card } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import { PermissionForm } from "@shared/PermissionForm";
import api from "@api/api";

export interface Route {
    id: number;
    name: string;
    description?: string;
}

export const PermissionManagement = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (routeId) => {
    try {
      await api.delete(`/routes/${routeId}`);
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  return (
    <div className="permission-management">
      <Card view="raised" className="section-card">
        <div className="section-header">
          <Text variant="header-2">Права доступа</Text>
          <Button view="action" onClick={() => {
            setEditingRoute(null);
            setShowForm(true);
          }}>
            Добавить новое право
          </Button>
        </div>

        {isLoading ? (
          <Text>Загрузка данных...</Text>
        ) : (
          <div className="routes-table">
            <div className="table-header">
              <Text variant="subheader-2">Имя</Text>
              <Text variant="subheader-2">Описание</Text>
              <Text variant="subheader-2">Действия</Text>
            </div>
            
            {routes.map(route => (
              <div key={route.id} className="table-row">
                <Text>{route.name}</Text>
                <Text color="secondary">{route.description}</Text>
                <div className="row-actions">
                  <Button view="outlined" size="s" onClick={() => {
                    setEditingRoute(route);
                    setShowForm(true);
                  }}>
                    Редактировать
                  </Button>
                  <Button view="outlined-danger" size="s" onClick={() => handleDelete(route.id)}>
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showForm && (
        <PermissionForm 
          route={editingRoute} 
          onClose={() => {
            setShowForm(false);
            setEditingRoute(null);
          }}
          onSuccess={() => {
            fetchRoutes();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};