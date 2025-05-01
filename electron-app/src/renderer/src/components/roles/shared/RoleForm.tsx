import { Button, TextInput, Text, Modal, Box, useToaster, Checkbox } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Stack } from "../admin/admin-components/stack";
import { Role } from '@api-types/role';
import { Route } from '@api-types/route';
import api from "@api/api";

interface RoleFormProps {
  role: Role | null;
  routes?: Route[];
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  routeIds: number[];
}

const MotionDiv = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const RoleForm = ({ role, routes = [], onClose, onSuccess }: RoleFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    routeIds: []
  });

  const [loading, setLoading] = useState({
    submit: false
  });

  const { add } = useToaster();

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        routeIds: role.routes?.map(r => r.id) || []
      });
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ submit: true });
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        routeIds: formData.routeIds
      };

      if (role) {
        await api.put(`/roles/${role.id}`, payload);
        add({
          name: 'update-success',
          title: 'Успешно',
          content: 'Роль обновлена',
          theme: 'success',
          autoHiding: 3000,
        });
      } else {
        await api.post('/roles', payload);
        add({
          name: 'create-success',
          title: 'Успешно',
          content: 'Роль создана',
          theme: 'success',
          autoHiding: 3000,
        });
      }
      onSuccess();
    } catch (error) {
      add({
        name: 'save-error',
        title: 'Ошибка',
        content: 'Не удалось сохранить роль',
        theme: 'danger',
        autoHiding: 5000,
      });
    } finally {
      setLoading({ submit: false });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRouteToggle = (routeId: number) => {
    setFormData(prev => {
      const newRouteIds = prev.routeIds.includes(routeId)
        ? prev.routeIds.filter(id => id !== routeId)
        : [...prev.routeIds, routeId];
      return { ...prev, routeIds: newRouteIds };
    });
  };

  return (
    <Modal open={true} onOpenChange={onClose}>
      <div style={{ 
        padding: '32px',
        width: '500px',
        maxWidth: '80vw',
        margin: '0 auto'
      }}>
        <MotionDiv>
          <Text 
            variant="header-2" 
            as="h2" 
            style={{ 
              marginBottom: '24px', 
              textAlign: 'center',
              color: 'var(--g-color-text-primary)'
            }}
          >
            {role ? 'Редактировать роль' : 'Создать новую роль'}
          </Text>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text variant="subheader-2">Название роли</Text>
              </div>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите название роли"
                size="l"
                disabled={loading.submit}
                hasClear
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text variant="subheader-2">Описание</Text>
              </div>
              <TextInput
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Введите описание роли"
                size="l"
                disabled={loading.submit}
                hasClear
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text variant="subheader-2">Права доступа</Text>
              </div>
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '12px',
                border: '1px solid var(--g-color-line-generic)',
                borderRadius: '8px'
              }}>
                {routes.map(route => (
                  <Box key={route.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox 
                      checked={formData.routeIds.includes(route.id)}
                      onChange={() => handleRouteToggle(route.id)}
                      size="l"
                      disabled={loading.submit}
                    />
                    <Stack gap={2}>
                      <Text variant="body-2">{route.name}</Text>
                      {route.description && (
                        <Text color="secondary" variant="body-1">{route.description}</Text>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '16px'
            }}>
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                style={{ flex: 1 }}
              >
                <Button
                  view="outlined"
                  type="button"
                  onClick={onClose}
                  size="l"
                  width="max"
                  disabled={loading.submit}
                >
                  Отмена
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                style={{ flex: 1 }}
              >
                <Button
                  view="action"
                  type="submit"
                  loading={loading.submit}
                  size="l"
                  width="max"
                >
                  {role ? 'Сохранить' : 'Создать'}
                </Button>
              </motion.div>
            </div>
          </form>
        </MotionDiv>
      </div>
    </Modal>
  );
};