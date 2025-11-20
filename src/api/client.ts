import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://contect-publisher-api.onrender.com",
});
// http://localhost:3000
// https://contect-publisher-api.onrender.com
// https://content-publisher-fe.onrender.com
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
