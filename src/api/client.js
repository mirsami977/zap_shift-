import axios from "axios";

export const TOKEN_STORAGE_KEY = "zapshift_token";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";
