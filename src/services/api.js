import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

if (!VITE_API_URL) {
  throw new Error("VITE_API_URL environment variable is not defined");
}

const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Custom error class for API errors
class CustomAPIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "CustomAPIError";
    this.status = status;
    this.data = data;
  }
}

// Add this helper function to check if the current route is a public/unauthenticated route
const isPublicRoute = () => {
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
    "/verifymail",
    "/welcome",
    "/help",
    "/privacy",
    "/term",
    "/shared-chat",
  ];
  const currentPath = window.location.pathname;

  // Check for exact matches
  if (publicRoutes.includes(currentPath)) {
    return true;
  }

  // Check for partial matches (like /help/some-article)
  return publicRoutes.some(
    (route) => route !== "/" && currentPath.startsWith(route)
  );
};

// Get error message based on status code
const getErrorMessage = (status, serverMessage) => {
  // Only use a generic message if the server doesn't provide one
  return serverMessage || "An unexpected error occurred.";
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);

    if (!error.response) {
      throw new CustomAPIError(
        "Network error. Please check your connection.",
        0
      );
    }

    const { response } = error;

    // Check if we're on a public route
    if (isPublicRoute()) {
      // Suppress all 401/403 auth errors on public routes
      if (response.status === 401 || response.status === 403) {
        // console.log(
        //   `Suppressing ${response.status} error on public route:`,
        //   response.config.url
        // );
        // Return empty data instead of throwing for endpoints on public routes
        return { success: false, data: null, message: null };
      }

      // Also suppress errors with auth-related error messages
      const errorMsg = response.data?.message || response.data?.error || "";
      if (
        typeof errorMsg === "string" &&
        (errorMsg.toLowerCase().includes("unauthorized") ||
          errorMsg.toLowerCase().includes("unauthenticated") ||
          errorMsg.toLowerCase().includes("token") ||
          errorMsg.toLowerCase().includes("auth"))
      ) {
        //  console.log(
        //   `Suppressing auth-related error on public route:`,
        //   response.config.url
        // );
        return { success: false, data: null, message: null };
      }
    }

    const errorMessage =
      response.data?.message ||
      getErrorMessage(response.status, response.data?.error);

    throw new CustomAPIError(errorMessage, response.status, response.data);
  }
);

export const registerNewUser = async (userData) => {
  const endpoint = "/auth/register";
  //  console.log(
  //   "Starting registration request to:",
  //   `${VITE_API_URL}${endpoint}`
  // );

  try {
    const requiredFields = [
      "email",
      "password",
      "fullName",
      "username",
      "country",
      "userType",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      throw new CustomAPIError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const response = await api.post(endpoint, userData);
    // console.log("Registration successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to register user. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

export const loginUser = async (email, password) => {
  const endpoint = "/auth/login";
  // console.log("Starting login request to:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { email, password });
    // console.log("Login successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to log in. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

export const handleOAuthCallback = async (code, type) => {
  try {
    if (!code || !type) {
      throw new Error("Missing required authentication data");
    }

    const token = code;

    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));

      setAuthToken(token);

      // Extract user data from the payload's data.user object
      const userData = payload.data?.user || payload;

      const userInfo = {
        id: userData.id,
        email: userData.email || "",
        name: userData.fullName || userData.name || "", // Try fullName first, then name
        username: userData.username || "",
        country: userData.country || "",
      };

      return {
        token,
        user: userInfo,
      };
    } catch (error) {
      console.error("Error decoding JWT:", error);
      throw new Error("Invalid authentication token");
    }
  } catch (error) {
    sessionStorage.removeItem("oauth_redirect_uri");
    sessionStorage.removeItem("oauth_provider");

    console.error("OAuth callback error:", error);
    throw error;
  }
};

// Update the OAuth initialization functions
export const initiateGoogleAuth = async (accountType) => {
  const param = accountType || "INDIVIDUAL";

  try {
    // Redirect to the Google auth endpoint
    window.location.href = `${VITE_API_URL}/auth/google?&state=${encodeURIComponent(
      param
    )}`;
    return true;
  } catch (error) {
    console.error("Google auth error:", error);
    throw new Error("Failed to initiate Google authentication");
  }
};

export const initiateMicrosoftAuth = async () => {
  try {
    const redirectUri = `${window.location.origin}/oauth/callback`;
    sessionStorage.setItem("oauth_redirect_uri", redirectUri);
    sessionStorage.setItem("oauth_provider", "microsoft");

    // Redirect to the Microsoft auth endpoint
    window.location.href = `${VITE_API_URL}/auth/microsoft?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    return true;
  } catch (error) {
    console.error("Microsoft auth error:", error);
    throw new Error("Failed to initiate Microsoft authentication");
  }
};

export const verifyEmail = async (email, otp) => {
  const endpoint = "/auth/verify/otp";
  //  console.log(
  //   "Starting email verification request to:",
  //   `${VITE_API_URL}${endpoint}`
  // );

  try {
    const response = await api.post(endpoint, { email, otp });
    // console.log("Email verification successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to verify email. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

export const forgotPassword = async (email) => {
  const endpoint = "/auth/forgot-password";
  //  console.log(
  //   "Starting forgot password request to:",
  //   `${VITE_API_URL}${endpoint}`
  // );

  try {
    const response = await api.post(endpoint, { email });
    // console.log("Forgot password request successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to request password reset. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const resetPassword = async (email, password, otp) => {
  const endpoint = "/auth/reset-password";
  //  console.log(
  //   "Starting reset password request to:",
  //   `${VITE_API_URL}${endpoint}`
  // );

  try {
    const response = await api.post(endpoint, {
      email,
      password,
      otp,
    });
    // console.log("Password reset successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to reset password. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

export const resendVerificationEmail = async (userId) => {
  const endpoint = "/auth/resend-verification";
  return api.post(endpoint, { userId });
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const resendOTP = async (email) => {
  const endpoint = "/auth/resend-otp";
  // console.log("Starting resend OTP request to:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint, { email });
    // console.log("OTP resend successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to resend OTP. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

// User Profile Endpoints
export const getUserProfile = async () => {
  const endpoint = "/user/profile";
  // console.log("Fetching user profile from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Profile fetch successful:", response);
    return response;
  } catch (error) {
    console.error("Profile fetch error:", error);

    if (error.response?.status === 403) {
      // Return the actual error message from the backend
      return {
        success: false,
        message: error.response.data.message,
        data: {
          user: null,
        },
      };
    }

    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch user profile. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const updateUserProfile = async (profileData) => {
  const endpoint = "/user/profile";
  // console.log("Updating user profile at:", `${VITE_API_URL}${endpoint}`);

  try {
    // Create FormData instance for multipart/form-data
    const formData = new FormData();

    // Append file if avatar is provided
    if (profileData.avatar) {
      formData.append("avatar", profileData.avatar);
    }

    // Append other fields
    const fields = ["fullName", "username", "bio", "country"];
    fields.forEach((field) => {
      if (profileData[field] !== undefined) {
        formData.append(field, profileData[field]);
      }
    });

    const response = await api.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log("Profile update successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to update user profile. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const getUserPosts = async () => {
  const endpoint = "/user/profile/posts";
  // console.log("Fetching user posts from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Posts fetch successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch user posts. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const getUserComments = async () => {
  const endpoint = "/user/profile/comments";
  // console.log("Fetching user comments from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Comments fetch successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch user comments. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const getUserBookmarks = async () => {
  const endpoint = "/user/profile/bookmarks";
  // console.log("Fetching user bookmarks from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Bookmarks fetch successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch user bookmarks. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

// User Preferences Endpoints
export const getUserPreferences = async () => {
  const endpoint = "/user/preferences";
  // console.log("Fetching user preferences from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Preferences fetch successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch user preferences. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const updateUserPreferences = async (preferences) => {
  const endpoint = "/user/preferences";
  // console.log("Updating user preferences at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.put(endpoint, preferences);
    // console.log("Preferences update successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to update user preferences. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

// Account Management Endpoints
export const getAccountDetails = async () => {
  const endpoint = "/user/account";
  // console.log("Fetching account details from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Account details fetch successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch account details. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const deleteAccount = async () => {
  const endpoint = "/user/account";
  // console.log("Deleting account at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.delete(endpoint);
    // console.log("Account deletion successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to delete account. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

// Subscription Endpoints
export const createCheckoutSession = async (plan) => {
  const endpoint = "/subscription/create-checkout-session";
  // console.log("Creating checkout session at:", `${VITE_API_URL}${endpoint}`);

  try {
    if (!["BASIC", "PREMIUM"].includes(plan)) {
      throw new CustomAPIError(
        "Invalid plan type. Must be either BASIC or PREMIUM",
        400
      );
    }

    const response = await api.post(endpoint, { plan });

    if (!response.data?.checkout_link) {
      throw new CustomAPIError("Invalid checkout response from server", 500);
    }

    return {
      data: {
        checkout_link: response.data.checkout_link,
      },
    };
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to create checkout session. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const createBillingPortalSession = async () => {
  const endpoint = "/subscription/create-portal-session";
  //  console.log(
  //   "Creating billing portal session at:",
  //   `${VITE_API_URL}${endpoint}`
  // );

  try {
    const response = await api.get(endpoint);
    // console.log("Billing portal session created successfully:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to create billing portal session. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const getSubscriptionDetails = async () => {
  const endpoint = "/subscription";
  const userInfo = JSON.parse(localStorage.getItem("user"));

  // Check if we're on a public route and if there's no token before making the call
  if (isPublicRoute() && !(userInfo && userInfo.token)) {
    // console.log("Skipping subscription check on public route");
    return { success: false, data: null };
  }

  try {
    const response = await api.get(endpoint);
    // console.log("Subscription details fetched successfully:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to fetch subscription details. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const cancelSubscription = async () => {
  const endpoint = "/subscription/cancel";
  // console.log("Canceling subscription at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint);
    // console.log("Subscription canceled successfully:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to cancel subscription. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

export const reactivateSubscription = async () => {
  const endpoint = "/subscription/cancel";
  // console.log("Reactivating subscription at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Subscription reactivated successfully:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to reactivate subscription. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

// Feedback Endpoint
export const submitFeedback = async (content, type) => {
  const endpoint = "/feedback";
  // console.log("Submitting feedback at:", `${VITE_API_URL}${endpoint}`);

  try {
    if (!content || !type) {
      throw new CustomAPIError("Content and type are required", 400);
    }

    // Ensure we're sending the exact structure the API expects
    const response = await api.post(endpoint, {
      content: content,
      type: type,
    });

    // console.log("Feedback submitted successfully:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError(
      "Failed to submit feedback. Please try again.",
      0,
      { originalError: error.message }
    );
  }
};

// Notification Endpoints
export const getNotifications = async (page = 1, limit = 10, type = null) => {
  const endpoint = `/notifications?page=${page}&limit=${limit}${
    type ? `&type=${type}` : ""
  }`;
  // console.log("Fetching notifications from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Notifications fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch notifications");
  }
};

export const markNotificationsAsRead = async (notificationId) => {
  const endpoint = `/notifications/${notificationId}`;

  try {
    const response = await api.post(endpoint);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to mark notifications as read");
  }
};

export const removeNotification = async (notificationId) => {
  const endpoint = `/notifications/${notificationId}`;
  // console.log("Deleting notification at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.delete(endpoint);
    // console.log("Notification deleted successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to delete notification");
  }
};

// Community Posts Endpoints
export const getPosts = async (page = 1, limit = 20) => {
  const endpoint = `/community/post?limit=${limit}&page=${page}`;
  // console.log("Fetching posts from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Posts fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch posts");
  }
};

export const createPost = async (text, media, privacy = "PUBLIC") => {
  const endpoint = "/community/post";
  // console.log("Creating post at:", `${VITE_API_URL}${endpoint}`);

  try {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("privacy", privacy);

    if (media && media.length > 0) {
      media.forEach((file) => {
        formData.append("media", file);
      });
    }

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Post created successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to create post");
  }
};

export const getSinglePost = async (postId) => {
  const endpoint = `/community/post/${postId}`;
  // console.log("Fetching single post from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Post fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch post");
  }
};

export const editPost = async (postId, text, media, privacy = "PUBLIC") => {
  const endpoint = `/community/post/${postId}`;
  // console.log("Editing post at:", `${VITE_API_URL}${endpoint}`);

  try {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("privacy", privacy);

    if (media && media.length > 0) {
      media.forEach((file) => {
        formData.append("media", file);
      });
    }

    const response = await api.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Post edited successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to edit post");
  }
};

export const deletePost = async (postId) => {
  const endpoint = `/community/post/${postId}`;
  // console.log("Deleting post at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.delete(endpoint);
    // console.log("Post deleted successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to delete post");
  }
};

// Community Comments Endpoints
export const createComment = async (postId, text, media) => {
  const endpoint = `/community/post/${postId}/comment`;
  // console.log("Creating comment at:", `${VITE_API_URL}${endpoint}`);

  try {
    const formData = new FormData();
    formData.append("text", text);

    if (media) {
      formData.append("media", media);
    }

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Comment created successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to create comment");
  }
};

export const getPostComments = async (postId) => {
  const endpoint = `/community/post/${postId}/comment`;
  // console.log("Fetching post comments from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Comments fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch comments");
  }
};

export const replyToComment = async (commentId, postId, text, media) => {
  const endpoint = `/community/comment/${commentId}/reply`;
  // console.log("Creating reply at:", `${VITE_API_URL}${endpoint}`);

  try {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("postId", postId);

    if (media) {
      formData.append("media", media);
    }

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Reply created successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to create reply");
  }
};

export const getCommentReplies = async (postId, commentId) => {
  const endpoint = `/community/post/${postId}/comment/${commentId}/replies`;
  // console.log("Fetching comment replies from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Replies fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch replies");
  }
};

export const editComment = async (commentId, text, media) => {
  const endpoint = `/community/comment/${commentId}`;
  // console.log("Editing comment at:", `${VITE_API_URL}${endpoint}`);

  try {
    const formData = new FormData();
    formData.append("text", text);

    if (media && media.length > 0) {
      media.forEach((file) => {
        formData.append("media", file);
      });
    }

    const response = await api.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Comment edited successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to edit comment");
  }
};

export const deleteComment = async (commentId) => {
  const endpoint = `/community/comment/${commentId}`;
  // console.log("Deleting comment at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.delete(endpoint);
    // console.log("Comment deleted successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to delete comment");
  }
};

// Community Likes Endpoints
export const likePost = async (postId) => {
  const endpoint = `/community/post/${postId}/like`;
  // console.log("Liking/unliking post at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint);
    // console.log("Post like/unlike successful:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to like/unlike post");
  }
};

export const getPostLikes = async (postId) => {
  const endpoint = `/community/post/${postId}/like`;
  // console.log("Fetching post likes from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Post likes fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch post likes");
  }
};

export const likeComment = async (postId, commentId) => {
  const endpoint = `/community/post/${postId}/comment/${commentId}/like`;
  // console.log("Liking/unliking comment at:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.post(endpoint);
    // console.log("Comment like/unlike successful:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to like/unlike comment");
  }
};

export const getCommentLikes = async (postId, commentId) => {
  const endpoint = `/community/post/${postId}/comment/${commentId}/likes`;
  // console.log("Fetching comment likes from:", `${VITE_API_URL}${endpoint}`);

  try {
    const response = await api.get(endpoint);
    // console.log("Comment likes fetched successfully:", response);
    return response;
  } catch (error) {
    handleApiError(error, "Failed to fetch comment likes");
  }
};

export const calculateTaxAPI = async (data) => {
  const endpoint = "/tax/calculate-german";
  // console.log("Calculating tax at:", `${VITE_API_URL}${endpoint}`);

  try {
    if (!data) {
      throw new CustomAPIError("Amount and country are required", 400);
    }

    const response = await api.post(endpoint, data);
    // console.log("Tax calculation successful:", response);
    return response;
  } catch (error) {
    if (error instanceof CustomAPIError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new CustomAPIError(
          "Network error. Please check your connection.",
          0
        );
      }

      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        getErrorMessage(status, error.response?.data?.error);

      throw new CustomAPIError(message, status, error.response?.data);
    }

    throw new CustomAPIError("Failed to calculate tax. Please try again.", 0, {
      originalError: error.message,
    });
  }
};

// Helper function for error handling
const handleApiError = (error, defaultMessage) => {
  if (error instanceof CustomAPIError) {
    throw error;
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new CustomAPIError(
        "Network error. Please check your connection.",
        0
      );
    }

    const status = error.response?.status || 0;
    const message =
      error.response?.data?.message ||
      getErrorMessage(status, error.response?.data?.error);

    throw new CustomAPIError(message, status, error.response?.data);
  }

  throw new CustomAPIError(`${defaultMessage}. Please try again.`, 0, {
    originalError: error.message,
  });
};

export default api;
