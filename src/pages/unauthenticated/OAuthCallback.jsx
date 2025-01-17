import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { handleOAuthCallback } from '../../services/api';

export default function OAuthCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      
      if (!code) {
        console.error('Missing authorization code');
        navigate('/login', { 
          state: { error: 'Invalid authentication response' }
        });
        return;
      }

      try {
        const response = await handleOAuthCallback(code);
        
        if (response?.token && response?.user) {
          // Ensure we have all required user data
          const userData = {
            email: response.user.email,
            name: response.user.name,
            id: response.user.id,
            username: response.user.username,
            country: response.user.country
          };

          // Call login with complete user data
          login(response.token, userData);
          
          // Navigate to welcome page with username
          navigate('/welcome', {
            state: { username: userData.name }
          });
        } else {
          throw new Error('Invalid authentication response');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        const provider = sessionStorage.getItem('oauth_provider') || 'OAuth';
        navigate('/login', { 
          state: { 
            error: error.message || `${provider} authentication failed. Please try again.`
          }
        });
      }
    };

    handleAuth();
  }, [login, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-2xl font-medium mb-4">Processing your login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}
