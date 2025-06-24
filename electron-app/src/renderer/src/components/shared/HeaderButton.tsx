import { Button, Icon, Popup, Tab, TabList, TabProvider } from '@gravity-ui/uikit';
import { useAuthStore } from '@store/authStore';
import { motion } from 'framer-motion';
import { transition } from './animation';
import { ArrowRightFromSquare } from '@gravity-ui/icons';
import { useState } from 'react';
import { NotificationsList } from '@shared/NotificationList';
import { Bell } from '@gravity-ui/icons';

export interface TabButton<T extends string = string> {
  id: T
  text: string
  disabled?: boolean
}

export interface HeaderButtonProps<T extends string = string> {
  tabs: Array<TabButton<T>>
  activeTab: T
  onTabChange: (tabId: T) => void
}
export const HeaderButton = <T extends string>({
  tabs,
  activeTab,
  onTabChange
}: HeaderButtonProps<T>) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useAuthStore();
  const handleTabChange = (value: string) => {
    if (tabs.some((tab) => tab.id === value)) {
      onTabChange(value as T);
    }
  };

  return (
    <div
      className="admin-tabs"
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        marginTop: '16px',
        alignItems: 'center'
      }}
    >
      <Button size="l" view="flat" onClick={() => setNotificationsOpen(!notificationsOpen)}>
        <Icon data={Bell} size={16} />
      </Button>
      <Popup
        open={notificationsOpen}
        onOpenChange={() => setNotificationsOpen(false)}
        placement={'bottom-end'}
      >
        <div style={{ width: 400, padding: 16 }}>
          <NotificationsList />
        </div>
      </Popup>

      <TabProvider value={activeTab} onUpdate={handleTabChange}>
        <div style={{ flexGrow: 1 }}>
          <TabList
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                style={{ position: 'relative', textAlign: 'center' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={transition}
              >
                <Tab value={tab.id} disabled={tab.disabled} style={{ marginRight: 30 }}>
                  {tab.text}
                </Tab>
              </motion.div>
            ))}
          </TabList>
        </div>
      </TabProvider>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={transition}>
        <Button
          size="l"
          onClick={logout}
          view="flat"
          pin="round-round"
          style={{ marginLeft: 'auto' }}
        >
          <Icon data={ArrowRightFromSquare} />
          Выход
        </Button>
      </motion.div>
    </div>
  );
};
