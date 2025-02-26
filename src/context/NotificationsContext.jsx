import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getNotifications, markNotificationsAsRead, setAuthToken } from '@/services/api';
import { showToast } from '@/components/ui/toast';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError(response.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch notifications');
      showToast({
        message: error.message || 'Failed to fetch notifications',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await markNotificationsAsRead([notificationId]);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isUnread: false }
              : notification
          )
        );
      }
    } catch (error) {
      showToast({
        message: error.message || 'Failed to mark notification as read',
        type: 'error'
      });
    }
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
    isLoading,
    error,
    setNotifications,
    markAsRead,
    deleteNotification,
    showLessLikeThis,
    refreshNotifications: fetchNotifications
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