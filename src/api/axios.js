import axios from "axios";

// Centralized axios instance. `withCredentials` lets the httpOnly auth
// cookie set by the backend travel with every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Fallback: also attach the token from localStorage as a Bearer header,
// for setups where the cookie isn't used (e.g. cross-domain deployments).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
