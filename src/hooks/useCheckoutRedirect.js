import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useCheckoutRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current path includes checkout/cancel or starts with checkout
    if (location.pathname.includes('checkout/cancel') || location.pathname.startsWith('/checkout')) {
      // Immediately redirect to upgrade
      navigate('/upgrade', { replace: true });
    }
  }, [location.pathname, navigate]);
}; 