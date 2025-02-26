import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

if (!VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is not defined');
}

const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Custom error class for API errors
class CustomAPIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'CustomAPIError';
    this.status = status;
    this.data = data;
  }
}

// Get error message based on status code
const getErrorMessage = (status, serverMessage) => {
  // Only use a generic message if the server doesn't provide one
  return serverMessage || 'An unexpected error occurred.';
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);

    if (!error.response) {
      throw new CustomAPIError(
        'Network error. Please check your connection.',
        0
      );
    }

    const { response } = error;
    const errorMessage = response.data?.message || getErrorMessage(response.status, response.data?.error);

    throw new CustomAPIError(
      errorMessage,
      response.status,
      response.data
    );
  }
);

export const registerNewUser = async (userData) => {
  const endpoint = '/auth/register';
  console.log('Starting registration request to:', `${VITE_API_URL}${endpoint}`);

  try {
    const requiredFields = ['email', 'password', 'fullName', 'username', 'country', 'userType'];
    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
      throw new CustomAPIError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      );
    }

    const response = await api.post(endpoint, userData);
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to register user. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const loginUser = async (email, password) => {
  const endpoint = '/auth/login';
  console.log('Starting login request to:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { email, password });
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to log in. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const handleOAuthCallback = async (code, type) => {
  try {
    if (!code || !type) {
      throw new Error('Missing required authentication data');
    }
    
    const token = code;
    
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      
      setAuthToken(token);
      
      // Extract user data from the payload's data.user object
      const userData = payload.data?.user || payload;
      
      const userInfo = {
        id: userData.id,
        email: userData.email || '',
        name: userData.fullName || userData.name || '', // Try fullName first, then name
        username: userData.username || '',
        country: userData.country || ''
      };

      return {
        token,
        user: userInfo
      };
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw new Error('Invalid authentication token');
    }
  } catch (error) {
    sessionStorage.removeItem('oauth_redirect_uri');
    sessionStorage.removeItem('oauth_provider');
    
    console.error('OAuth callback error:', error);
    throw error;
  }
};

// Update the OAuth initialization functions
export const initiateGoogleAuth = async () => {
  try {
    const redirectUri = `${window.location.origin}/oauth/callback`;
    sessionStorage.setItem('oauth_redirect_uri', redirectUri);
    sessionStorage.setItem('oauth_provider', 'google');
    
    // Redirect to the Google auth endpoint
    window.location.href = `${VITE_API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    return true;
  } catch (error) {
    console.error('Google auth error:', error);
    throw new Error('Failed to initiate Google authentication');
  }
};

export const initiateMicrosoftAuth = async () => {
  try {
    const redirectUri = `${window.location.origin}/oauth/callback`;
    sessionStorage.setItem('oauth_redirect_uri', redirectUri);
    sessionStorage.setItem('oauth_provider', 'microsoft');
    
    // Redirect to the Microsoft auth endpoint
    window.location.href = `${VITE_API_URL}/auth/microsoft?redirect_uri=${encodeURIComponent(redirectUri)}`;
    return true;
  } catch (error) {
    console.error('Microsoft auth error:', error);
    throw new Error('Failed to initiate Microsoft authentication');
  }
};

export const verifyEmail = async (email, otp) => {
  const endpoint = '/auth/verify/otp';
  console.log('Starting email verification request to:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { email, otp });
    console.log('Email verification successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to verify email. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const forgotPassword = async (email) => {
  const endpoint = '/auth/forgot-password';
  console.log('Starting forgot password request to:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { email });
    console.log('Forgot password request successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to request password reset. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const resetPassword = async (email, password, otp) => {
  const endpoint = '/auth/reset-password';
  console.log('Starting reset password request to:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { 
      email,
      password,
      otp
    });
    console.log('Password reset successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to reset password. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const resendVerificationEmail = async (userId) => {
  const endpoint = '/auth/resend-verification';
  return api.post(endpoint, { userId });
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const resendOTP = async (email) => {
  const endpoint = '/auth/resend-otp';
  console.log('Starting resend OTP request to:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { email });
    console.log('OTP resend successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to resend OTP. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

// User Profile Endpoints
export const getUserProfile = async () => {
  const endpoint = '/user/profile';
  console.log('Fetching user profile from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Profile fetch successful:', response);
    return response;
  } catch (error) {
    console.error('Profile fetch error:', error);

    if (error.response?.status === 403) {
      // Return the actual error message from the backend
      return {
        success: false,
        message: error.response.data.message,
        data: {
          user: null
        }
      };
    }

    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch user profile. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const updateUserProfile = async (profileData) => {
  const endpoint = '/user/profile';
  console.log('Updating user profile at:', `${VITE_API_URL}${endpoint}`);

  try {
    // Create FormData instance for multipart/form-data
    const formData = new FormData();
    
    // Append file if avatar is provided
    if (profileData.avatar) {
      formData.append('avatar', profileData.avatar);
    }

    // Append other fields
    const fields = ['fullName', 'username', 'bio', 'country'];
    fields.forEach(field => {
      if (profileData[field] !== undefined) {
        formData.append(field, profileData[field]);
      }
    });

    const response = await api.put(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Profile update successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to update user profile. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const getUserPosts = async () => {
  const endpoint = '/user/profile/posts';
  console.log('Fetching user posts from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Posts fetch successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch user posts. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const getUserComments = async () => {
  const endpoint = '/user/profile/comments';
  console.log('Fetching user comments from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Comments fetch successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch user comments. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const getUserBookmarks = async () => {
  const endpoint = '/user/profile/bookmarks';
  console.log('Fetching user bookmarks from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Bookmarks fetch successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch user bookmarks. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

// User Preferences Endpoints
export const getUserPreferences = async () => {
  const endpoint = '/user/preferences';
  console.log('Fetching user preferences from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Preferences fetch successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch user preferences. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const updateUserPreferences = async (preferences) => {
  const endpoint = '/user/preferences';
  console.log('Updating user preferences at:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.put(endpoint, preferences);
    console.log('Preferences update successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to update user preferences. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

// Account Management Endpoints
export const getAccountDetails = async () => {
  const endpoint = '/user/account';
  console.log('Fetching account details from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Account details fetch successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch account details. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const deleteAccount = async () => {
  const endpoint = '/user/account';
  console.log('Deleting account at:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.delete(endpoint);
    console.log('Account deletion successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to delete account. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

// Notification Endpoints
export const getNotifications = async () => {
  const endpoint = '/notifications';
  console.log('Fetching notifications from:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    console.log('Notifications fetch successful:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to fetch notifications. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const markNotificationsAsRead = async (notificationIds) => {
  const endpoint = '/notifications';
  console.log('Marking notifications as read at:', `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, {
      ids: notificationIds
    });
    console.log('Notifications marked as read:', response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          'Network error. Please check your connection.',
          0
        );
      }

      const status = error.response?.status || 0;
      const message = error.response?.data?.message || getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to mark notifications as read. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export default api;
