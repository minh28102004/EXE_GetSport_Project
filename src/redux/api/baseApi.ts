import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { RootState } from "@redux/store/store";
import { logout } from "@redux/features/auth/authSlice";
import { tagTypes } from "./tagTypes";

// PROD: dùng biến môi trường hoặc fallback; DEV: dùng proxy /api
const PROD_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/+$/,
    ""
  ) || "https://getsport.3docorp.vn/api";

// Kết thúc bằng "/" để RTK join đúng
const API_BASE =
  (import.meta.env.DEV ? "/api" : PROD_BASE).replace(/\/+$/, "") + "/";

// Bỏ dấu "/" đầu ở url tương đối (an toàn khi lỡ viết "/Auth/login")
const normalizeArgs = (args: string | FetchArgs): string | FetchArgs => {
  if (typeof args === "string") return args.replace(/^\/+/, "");
  if (typeof args.url === "string")
    return { ...args, url: args.url.replace(/^\/+/, "") };
  return args;
};

const rawBase = fetchBaseQuery({
  baseUrl: API_BASE,
  // credentials: "include", // bật nếu dùng cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    // KHÔNG ép Content-Type cho mọi request; RTK sẽ set cho JSON POST
    return headers;
  },
});

// Lấy đúng kiểu extra từ rawBase để tránh lệch generic
type RawExtra = Parameters<typeof rawBase>[2];

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  RawExtra,
  FetchBaseQueryMeta
> = async (args, api, extra) => {
  const res = await rawBase(normalizeArgs(args), api, extra);

  if ("error" in res) {
    const err = res.error;
    if (err?.status === 401) api.dispatch(logout());

    // Nếu server trả HTML (IIS 404/405/OPTIONS), gợi ý dễ hiểu hơn
    const data = (err as FetchBaseQueryError).data as unknown;
    if (typeof data === "string" && /^\s*<!doctype html/i.test(data)) {
      (err as FetchBaseQueryError).data = {
        message:
          "Server trả về HTML (sai route/method hoặc IIS/WebDAV chặn PUT/DELETE/OPTIONS).",
        htmlSnippet: data.slice(0, 200),
      };
    }
  }
  return res;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes, // dùng mảng chung tagTypes: ["Account"] => thêm thì vào tagTypes.ts mà add
  endpoints: () => ({}),
});
