import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { markNotificationsAsRead } from '@/services/api';
import { showToast } from "@/components/ui/toast";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = useCallback((notifs) => {
    const count = notifs.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await markNotificationsAsRead([notificationId]);
      
      if (response.success) {
        setNotifications(prev => {
          const updated = prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          );
          updateUnreadCount(updated);
          return updated;
        });
        
        showToast({
          message: "Notification marked as read",
          type: "success"
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast({
        message: "Failed to mark notification as read",
        type: "error"
      });
    }
  }, [updateUnreadCount]);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.filter(notification => notification.id !== notificationId);
      updateUnreadCount(updated);
      return updated;
    });
  }, [updateUnreadCount]);

  const showLessLikeThis = useCallback((notificationId) => {
    // Implementation for showing less notifications like this
    console.log('Show less notifications like:', notificationId);
  }, []);

  const value = {
    notifications,
    setNotifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    showLessLikeThis,
    updateUnreadCount,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

NotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
} 