import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isUnread: false }
          : notification
      )
    );
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const showLessLikeThis = useCallback((notificationId) => {
    // In a real application, this would likely call an API to update user preferences
    console.log('Show less notifications like:', notificationId);
  }, []);

  const value = {
    notifications,
    setNotifications,
    markAsRead,
    deleteNotification,
    showLessLikeThis,
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