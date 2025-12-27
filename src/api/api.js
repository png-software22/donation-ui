import axios from "axios";
import { USER_KEY } from "../constant";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `bearer ${
      JSON.parse(localStorage.getItem(USER_KEY) ?? "{}").accessToken
    }`,
  },
});

export default api;
