import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your actual API base URL
});

// Add an interceptor to include the token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtNjRpbXZlcDAwMDBibDJnYjduYXRncmwiLCJpYXQiOjE3Mzg1OTIwNTh9.TgpAaTcQ4QRnkyytbclAY_CDOSFcHviU1KmCyDHIbPo";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
