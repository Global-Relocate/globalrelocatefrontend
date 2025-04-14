import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import axiosInstance from '@/services/api';

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth(); // Assuming you have an auth context
  
  useEffect(() => {
    // Only fetch subscription data if the user is authenticated
    if (isAuthenticated) {
      fetchSubscriptionData();
    }
  }, [isAuthenticated]);
  
  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/v1/subscription');
      setSubscriptionData(response.data);
      setError(null);
    } catch (error) {
      // Handle error quietly without showing a toast
      console.error('Error fetching subscription:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Rest of your context provider
}; 