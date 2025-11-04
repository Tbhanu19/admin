
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  
});


export const adminLogin = (username, password) =>
  api.post("/admin/login", { username, password });

export const adminLogout = () => api.post("/admin/logout");


export const getAllUsers = () => api.get("/admin/users");


export const createUser = (userData) => api.post("/admin/create_user", userData);


export const getUserSessions = (userId) => api.get(`/admin/user_sessions/${userId}`);


export const userLogin = (username, password) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  return api.post("/user/login", form.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const userLogout = () => api.post("/user/logout");

export const getUserDashboard = () => api.get("/user/dashboard");

export default api;
