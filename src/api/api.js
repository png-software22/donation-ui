import axios from "axios";
import { USER_KEY } from "../constant";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(
      localStorage.getItem(USER_KEY) ?? "{}"
    ).accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(USER_KEY);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
