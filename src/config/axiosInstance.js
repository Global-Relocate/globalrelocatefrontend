import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your actual API base URL
});

// Add an interceptor to include the token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    // const { user } = useContext(AuthContext);
    const { token } = JSON.parse(localStorage.getItem("user"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
