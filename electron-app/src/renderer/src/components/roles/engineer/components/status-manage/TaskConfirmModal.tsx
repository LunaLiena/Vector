import { Modal,Text,Button } from '@gravity-ui/uikit';
import { SetStateAction } from 'react';

export interface TaskConfirmModalProps{
  showConfirmation:boolean;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  confirmStatusChange: () => Promise<void>;
}

export const TaskConfirmModal = ({showConfirmation,setShowConfirmation,confirmStatusChange}:TaskConfirmModalProps) =>{

  return(
    <Modal open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
      <div style={{
        padding: '25px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <Text variant="header-2">Подтверждение</Text>
        <Text style={{ margin: '16px 0' }}>
                Вы уверены, что хотите изменить статус задачи?
        </Text>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button view="normal" onClick={confirmStatusChange}>
                  Да
          </Button>
          <Button view="outlined" onClick={() => setShowConfirmation(false)}>
                  Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );

};