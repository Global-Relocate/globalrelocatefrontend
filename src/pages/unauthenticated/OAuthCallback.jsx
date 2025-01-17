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
      const type = searchParams.get('type')?.toLowerCase();

      if (code && type) {
        try {
          const response = await handleOAuthCallback(code, type);
          if (response?.token) {
            login(response.token, {
              email: response.user.email,
              name: response.user.name,
              id: response.user.id,
            });
            navigate('/welcome');
          } else {
            throw new Error('No token received');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          navigate('/login', { 
            state: { 
              error: 'Authentication failed. Please try again.' 
            }
          });
        }
      } else {
        navigate('/login', { 
          state: { 
            error: 'Invalid authentication response' 
          }
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
