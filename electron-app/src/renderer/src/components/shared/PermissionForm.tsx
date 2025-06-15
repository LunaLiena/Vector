import { CSSProperties, useState, useEffect } from 'react';
import { Button, TextInput, Text, Modal, useToaster } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';
import api from '@api/api';

interface Route {
  id: number;
  name: string;
  description?: string;
}

interface PermissionFormProps {
  route?: Route | null;
  onClose: () => void;
  onSuccess: () => void;
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

export const PermissionForm = ({ route, onClose, onSuccess }: PermissionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [loading, setLoading] = useState({
    submit: false
  });
  
  const { add } = useToaster();

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name,
        description: route.description || ''
      });
    }
  }, [route]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description
      };

      if (route) {
        await api.put(`/routes/${route.id}`, payload);
        add({
          name: 'update-success',
          title: 'Успешно',
          content: 'Право доступа обновлено',
          theme: 'success',
          autoHiding: 3000,
        });
      } else {
        await api.post('/routes', payload);
        add({
          name: 'create-success',
          title: 'Успешно',
          content: 'Право доступа создано',
          theme: 'success',
          autoHiding: 3000,
        });
      }
      onSuccess();
    } catch (error) {
      add({
        name: 'save-error',
        title: 'Ошибка',
        content: 'Не удалось сохранить данные',
        theme: 'danger',
        autoHiding: 5000,
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={true} onClose={onClose}>
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
            {route ? 'Редактировать право доступа' : 'Добавить новое право доступа'}
          </Text>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text variant="subheader-2">Имя (ключ)</Text>
              </div>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите имя права доступа"
                size="l"
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
                placeholder="Введите описание права доступа"
                size="l"
                hasClear
              />
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
                  {route ? 'Сохранить' : 'Создать'}
                </Button>
              </motion.div>
            </div>
          </form>
        </MotionDiv>
      </div>
    </Modal>
  );
};