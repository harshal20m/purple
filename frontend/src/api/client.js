import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      // Return standardized error
      return Promise.reject({
        message: error.response.data?.message || "An error occurred",
        errors: error.response.data?.errors || null,
        status,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: "Network error. Please check your connection.",
        errors: null,
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        errors: null,
        status: 0,
      });
    }
  }
);

export default apiClient;
