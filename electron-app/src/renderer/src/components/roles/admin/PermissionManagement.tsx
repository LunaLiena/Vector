import { Button, TextInput, Text, Card, Modal, Box } from '@gravity-ui/uikit';
import { useState, useEffect } from 'react';
import { PermissionForm } from '@shared/PermissionForm';
import api from '@api/api';
import { Stack } from './admin-components/stack';

export interface Route {
  id: number
  name: string
  description?: string
}

export const PermissionManagement = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Route[]>('/routes');
      setRoutes(response.data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (routeId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это право доступа?')) return;

    try {
      setIsLoading(true);
      await api.delete(`/routes/${routeId}`);
      await fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      setError('Ошибка удаления права доступа');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.description && route.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ height: '100%' }}>
      <Card
        view="raised"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Фиксированная верхняя часть */}
        <div style={{ padding: 16, flexShrink: 0 }}>
          <Text variant="header-2" style={{ marginBottom: 12 }}>
            Управление правами доступа
          </Text>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TextInput
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1, marginTop: 12 }}
            />
            <Button
              view="action"
              onClick={() => {
                setEditingRoute(null);
                setShowForm(true);
              }}
              style={{
                marginTop: 10
              }}
              loading={isLoading}
            >
              Добавить право доступа
            </Button>
          </div>
        </div>

        {/* Прокручиваемая область с карточками */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '0 16px 16px'
          }}
        >
          {isLoading ? (
            <Text>Загрузка данных...</Text>
          ) : error ? (
            <Text color="danger">{error}</Text>
          ) : filteredRoutes.length === 0 ? (
            <Card view="outlined" style={{ padding: 16, textAlign: 'center' }}>
              <Text color="secondary">Права доступа не найдены</Text>
            </Card>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredRoutes.map((route) => (
                <Card key={route.id} view="outlined" style={{ padding: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Stack gap={2}>
                      <Text variant="subheader-2">{route.name}</Text>
                      {route.description && <Text color="secondary">{route.description}</Text>}
                    </Stack>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button
                        view="outlined"
                        size="m"
                        onClick={() => {
                          setEditingRoute(route);
                          setShowForm(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        view="outlined-danger"
                        size="m"
                        onClick={() => handleDelete(route.id)}
                        loading={isLoading}
                      >
                        Удалить
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
