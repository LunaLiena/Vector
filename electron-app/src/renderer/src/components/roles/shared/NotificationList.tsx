// components/NotificationsList.tsx
import { useEffect, useState } from 'react';
import { Button, Card, Text,Icon } from '@gravity-ui/uikit';
import { notify } from '@services/notificationService';
import type { Notification } from '@api-types/notification';
import { notificationService } from '@services/notificationApiService';
import { motion,AnimatePresence } from 'framer-motion';
import {formatDistanceToNow} from 'date-fns';
import {ru} from 'date-fns/locale';
import { Xmark,CheckShape,ExclamationShape,CircleInfoFill,Bell, CircleCheck } from '@gravity-ui/icons';
import cn from 'classnames';
import styles from './style/NotificationList.module.css';

const notificationIcons = {
  info:<Icon data={CircleInfoFill} size={18} className={styles.infoIcon} />,
  warning:<Icon data={ExclamationShape} size={18} className={styles.warningIcon} />,
  alert:<Icon data={Bell} size={18} className={styles.alertIcon} />,
  success:<Icon data={CheckShape} size={18} className={styles.successIcon} />
};

export const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [data,count] = await Promise.all([
          notify.fetchNotifications({isRead:false}),
          notificationService.getUnreadCount()
        ]);
        setNotifications(data);
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notify.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const containerVariants = {
    hidden:{opacity:0},
    show:{
      opacity:1,
      transition:{
        staggerChildren:0.1,
      },
    },
  };

  const itemVariants = {
    hidden:{opacity:0,y:20},
    show:{opacity:1,y:0},
    exit:{opacity:0,y:50,transition:{duration:0.2}},
  };



  if (isLoading) {
    return(
      <div className={styles.skeletonContainer}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.skeleton}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.6 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: 'mirror' }}
          />
        ))}
      </div>
    );
  }
  if (!notifications.length) return <Text>Нет новых уведомлений</Text>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text variant="header-2">Уведомления</Text>
        <div className={styles.badge}>{unreadCount}</div>
      </div>

      <AnimatePresence>
        {notifications.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Icon data={CircleCheck} size={24} className={styles.emptyIcon} />
            <Text variant="subheader-1">Все уведомления прочитаны</Text>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={styles.list}
          >
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                >
                  <Card
                    className={cn(styles.card, styles[notification.type])}
                    theme="info"
                  >
                    <div className={styles.cardHeader}>
                      {notificationIcons[notification.type]}
                      <Text variant="subheader-1" className={styles.title}>
                        {notification.title}
                      </Text>
                      <Button
                        view="flat-secondary"
                        size="s"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={styles.closeButton}
                      >
                        <Icon data={Xmark} size={14} />
                      </Button>
                    </div>
                    <Text color="secondary" className={styles.message}>
                      {notification.message}
                    </Text>
                    <div className={styles.footer}>
                      <Text color="hint" variant="caption-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};