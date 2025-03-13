import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSubscriptionDetails } from '@/services/api';

const TrialContext = createContext();

export const TrialProvider = ({ children }) => {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const response = await getSubscriptionDetails();
        
        if (response.success) {
          const { trial } = response.data;
          
          // Check if trial has ended (remainingDays is 0)
          if (trial && trial.remainingDays === 0) {
            setIsTrialExpired(true);
            setShowTrialModal(true);
          } else {
            setIsTrialExpired(false);
            setShowTrialModal(false);
          }
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTrialStatus();

    // Check trial status every hour
    const interval = setInterval(checkTrialStatus, 3600000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    isTrialExpired,
    showTrialModal,
    setShowTrialModal,
    loading
  };

  return (
    <TrialContext.Provider value={value}>
      {children}
    </TrialContext.Provider>
  );
};

TrialProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTrial = () => {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  return context;
};

export default TrialContext; 