import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not defined');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
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
const getErrorMessage = (status) => {
  const messages = {
    400: 'Invalid request. Please check your input.',
    401: 'Unauthorized. Please log in.',
    403: 'Access forbidden. You do not have permission.',
    404: 'Resource not found.',
    409: 'This email is already registered.',
    422: 'Validation error. Please check your input.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  return messages[status] || 'An unexpected error occurred.';
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);

    if (!error.response) {
      // Network error or timeout
      throw new CustomAPIError(
        'Network error. Please check your connection.',
        0
      );
    }

    const { response } = error;
    const errorMessage = response.data?.message || getErrorMessage(response.status);

    throw new CustomAPIError(
      errorMessage,
      response.status,
      response.data
    );
  }
);

export const registerNewUser = async (userData) => {
  const endpoint = '/v1/auth/register';
  console.log('Starting registration request to:', `${API_URL}${endpoint}`);

  try {
    // Validate required fields
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'country', 'userType'];
    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
      throw new CustomAPIError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      );
    }

    const response = await api.post(endpoint, {
      ...userData,
      username: userData.username || userData.email.split('@')[0], // Default username logic
    });

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
      const message = error.response?.data?.message || getErrorMessage(status);

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
  const endpoint = '/v1/auth/login';
  console.log('Starting login request to:', `${API_URL}${endpoint}`);

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
      const message = error.response?.data?.message || getErrorMessage(status);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to log in. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const verifyEmail = async (token) => {
  const endpoint = `/v1/auth/verify/${token}`;
  console.log('Starting email verification request to:', `${API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
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
      const message = error.response?.data?.message || getErrorMessage(status);

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
  const endpoint = '/v1/auth/forgot-password';
  console.log('Starting forgot password request to:', `${API_URL}${endpoint}`);

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
      const message = error.response?.data?.message || getErrorMessage(status);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      'Failed to request password reset. Please try again.',
      0,
      { originalError: error.message }
    );
  }
};

export const resetPassword = async (token, password) => {
  const endpoint = `/v1/auth/reset-password/${token}`;
  console.log('Starting reset password request to:', `${API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { password });
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
      const message = error.response?.data?.message || getErrorMessage(status);

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
  return api.post('/v1/auth/resend-verification', { userId });
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
