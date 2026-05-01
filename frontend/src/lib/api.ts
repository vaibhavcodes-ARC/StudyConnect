import axios from "axios";
import Cookies from "js-cookie";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const SERVER_URL = API_URL.replace(/\/api$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
