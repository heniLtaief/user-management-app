// src/utils/api.js
import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with smarter refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors for specific paths (not login/register)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;
      console.log("Token expired, attempting refresh...");

      try {
        // Try to refresh the token
        const refreshRes = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        if (refreshRes.data.token) {
          // Save new token
          localStorage.setItem("token", refreshRes.data.token);

          // Update the original request header
          originalRequest.headers.Authorization = `Bearer ${refreshRes.data.token}`;

          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error("No token in refresh response");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear tokens and redirect to login
        localStorage.removeItem("token");

        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // For other errors or auth endpoints, just reject
    return Promise.reject(error);
  },
);

// Helper function to set token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Helper function to clear token
export const clearToken = () => {
  localStorage.removeItem("token");
};

export default api;
