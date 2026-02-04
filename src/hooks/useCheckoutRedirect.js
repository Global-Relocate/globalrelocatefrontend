import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useCheckoutRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current path includes checkout success
    if (location.pathname.includes('checkout/success') || (location.search && location.search.includes('session_id'))) {
      // Redirect to thank you page on successful checkout
      navigate('/subscription/thank-you', { replace: true });
    } 
    // Check if the current path includes checkout/cancel or starts with checkout
    else if (location.pathname.includes('checkout/cancel') || location.pathname.startsWith('/checkout')) {
      // Immediately redirect to upgrade
      navigate('/upgrade', { replace: true });
    }
  }, [location.pathname, location.search, navigate]);
}; 