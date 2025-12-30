import apiClient from "./client";

// Authentication APIs
export const authAPI = {
  signup: (data) => apiClient.post("/auth/signup", data),
  login: (data) => apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  getCurrentUser: () => apiClient.get("/auth/me"),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get("/users/profile"),
  updateProfile: (data) => apiClient.put("/users/profile", data),
  changePassword: (data) => apiClient.put("/users/change-password", data),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: (page = 1, limit = 10) =>
    apiClient.get(`/admin/users?page=${page}&limit=${limit}`),
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),
  activateUser: (id) => apiClient.patch(`/admin/users/${id}/activate`),
  deactivateUser: (id) => apiClient.patch(`/admin/users/${id}/deactivate`),
};
