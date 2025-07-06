import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your actual API base URL
});

// Add an interceptor to include the token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    const userInfo = JSON.parse(localStorage.getItem("user")) || {};
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
      return config;
    } else {
      // If no token is found, reject the request
      return Promise.reject(new Error("No token found"));
    }
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
