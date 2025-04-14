import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSubscriptionDetails } from '@/services/api';

const TrialContext = createContext();

// Helper function to check if current route is a public route
const isPublicRoute = () => {
  const publicRoutes = ['/', '/login', '/signup', '/forgotpassword', '/resetpassword', '/verifymail', '/welcome', '/help', '/privacy', '/term'];
  const currentPath = window.location.pathname;
  
  // Check for exact matches
  if (publicRoutes.includes(currentPath)) {
    return true;
  }
  
  // Check for partial matches (like /help/some-article)
  return publicRoutes.some(route => 
    route !== '/' && currentPath.startsWith(route)
  );
};

export const TrialProvider = ({ children }) => {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      // Skip checking trial status on public routes
      if (isPublicRoute()) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await getSubscriptionDetails();
        
        if (response && response.success) {
          const { subscription, trial, overallStatus } = response.data || {};
          
          // Check if user is an ADMIN or has INFINITE trial
          const isAdmin = subscription?.plan === "ADMIN";
          const hasActiveSubscription = overallStatus === "active";
          const hasInfiniteTrial = 
            trial?.remainingDays === "INFINITE" || 
            trial?.end === "INFINITE";
          
          // Don't show trial expiration for admin users or those with infinite trial
          if (isAdmin || hasInfiniteTrial || hasActiveSubscription) {
            setIsTrialExpired(false);
            setShowTrialModal(false);
          } else if (trial) {
            // For regular trial users, check if trial has ended
            let trialEnded = false;
            
            if (typeof trial.remainingDays === 'number') {
              trialEnded = trial.remainingDays <= 0;
            } else if (trial.remainingDays && trial.remainingDays !== "INFINITE") {
              // Try to parse remainingDays as a number
              const days = parseInt(trial.remainingDays, 10);
              if (!isNaN(days)) {
                trialEnded = days <= 0;
              }
            } else if (trial.end && trial.end !== "INFINITE") {
              // Check end date if provided as ISO string
              try {
                const endDate = new Date(trial.end);
                const now = new Date();
                
                // Verify we got a valid date (not Invalid Date)
                if (!isNaN(endDate.getTime())) {
                  trialEnded = now >= endDate;
                }
              } catch (e) {
                console.error('Error parsing trial end date:', e);
              }
            }
            
            setIsTrialExpired(trialEnded);
            setShowTrialModal(trialEnded);
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