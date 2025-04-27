import { Button, TextInput, Label, Text, Checkbox, Modal } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";

export const RoleForm = ({ role, routes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    routeIds: []
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        routeIds: role.routes?.map(r => r.id) || []
      });
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Здесь будет вызов API для сохранения роли
      console.log('Saving role:', formData);
      onSuccess();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRouteToggle = (routeId) => {
    setFormData(prev => {
      const newRouteIds = prev.routeIds.includes(routeId)
        ? prev.routeIds.filter(id => id !== routeId)
        : [...prev.routeIds, routeId];
      return { ...prev, routeIds: newRouteIds };
    });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="role-form">
        <Text variant="header-2">{role ? 'Редактировать звание' : 'Создать новое звание'}</Text>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label>Название звания:</Label>
            <TextInput 
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <Label>Описание:</Label>
            <TextInput 
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <Label>Права доступа:</Label>
            <div className="permissions-grid">
              {routes.map(route => (
                <Checkbox 
                  key={route.id}
                  checked={formData.routeIds.includes(route.id)}
                  onChange={() => handleRouteToggle(route.id)}
                  size="l"
                >
                  {route.description}
                </Checkbox>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <Button view="normal" type="button" onClick={onClose}>
              Отмена
            </Button>
            <Button view="action" type="submit">
              {role ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};