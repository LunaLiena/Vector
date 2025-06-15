// shared/BaseModalForm.tsx
import { Text, Box, Button, Card, Modal } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';

interface BaseModalFormProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: number | string;
}

const MotionDiv = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

export const BaseModalForm = ({ 
  title, 
  children, 
  onClose, 
  width = 500 
}: BaseModalFormProps) => {
  return (
    <Modal open={true} onClose={onClose}>
      <div style={{ 
        padding: '32px',
        width: width,
        maxWidth: '90vw',
        margin: '0 auto'
      }}>
        <MotionDiv>
          <Text 
            variant="header-2" 
            as="h2" 
            style={{ 
              marginBottom: 24, 
              textAlign: 'center',
              color: 'var(--g-color-text-primary)'
            }}
          >
            {title}
          </Text>
            
          {children}
        </MotionDiv>
      </div>
    </Modal>
  );
};