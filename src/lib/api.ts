// src/lib/api.ts
import axios, { AxiosHeaders } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

let _getToken: (() => string | null) | null = null;
export const connectTokenSource = (fn: () => string | null) => {
  _getToken = fn;
};

export const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: false,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? "get").toLowerCase();

  // Luôn chuyển headers hiện có về AxiosHeaders, rồi set từng key
  const headers = AxiosHeaders.from(config.headers);

  headers.set("Accept", "application/json, text/plain, */*");
  if (["post", "put", "patch"].includes(method)) {
    headers.set("Content-Type", "application/json");
  }

  const token = _getToken?.() ?? localStorage.getItem("accessToken");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  config.headers = headers; // gán lại bằng AxiosHeaders
  return config;
});



