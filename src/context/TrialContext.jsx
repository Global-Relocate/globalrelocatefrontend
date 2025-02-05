import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TrialContext = createContext();

export const TrialProvider = ({ children }) => {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);

  // This would typically be connected to your backend
  // For now, we'll use localStorage to simulate trial status
  useEffect(() => {
    const checkTrialStatus = () => {
      const trialStartDate = localStorage.getItem('trialStartDate');
      
      if (!trialStartDate) {
        // First time user, set trial start date
        localStorage.setItem('trialStartDate', new Date().toISOString());
        return;
      }

      const startDate = new Date(trialStartDate);
      const currentDate = new Date();
      const trialDuration = 3; // 3 days
      const diffTime = Math.abs(currentDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > trialDuration) {
        setIsTrialExpired(true);
        setShowTrialModal(true);
      }
    };

    checkTrialStatus();
  }, []);

  const value = {
    isTrialExpired,
    showTrialModal,
    setShowTrialModal
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