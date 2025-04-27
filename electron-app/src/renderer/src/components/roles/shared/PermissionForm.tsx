import { Button, TextInput, Label, Text, Modal } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";

export const PermissionForm = ({ route, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name,
        description: route.description
      });
    }
  }, [route]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Здесь будет вызов API для сохранения права
      console.log('Saving route:', formData);
      onSuccess();
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="permission-form">
        <Text variant="header-2">{route ? 'Редактировать право' : 'Добавить новое право'}</Text>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label>Имя (ключ):</Label>
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
          
          <div className="form-actions">
            <Button view="normal" type="button" onClick={onClose}>
              Отмена
            </Button>
            <Button view="action" type="submit">
              {route ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};