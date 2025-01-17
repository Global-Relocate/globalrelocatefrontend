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
      const type = searchParams.get('type') || 'google'; // Default to google if type is not specified

      if (!code) {
        navigate('/login', { 
          state: { error: 'Invalid authentication response' }
        });
        return;
      }

      try {
        const response = await handleOAuthCallback(code, type);
        
        if (response?.token && response?.user) {
          // Important: Call login with both token and user data
          login(response.token, response.user);
          navigate('/welcome');
        } else {
          throw new Error('Invalid authentication response');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login', { 
          state: { error: error.message || 'Authentication failed. Please try again.' }
        });
      }
    };

    handleAuth();
  }, [login, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4">Processing your login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}
