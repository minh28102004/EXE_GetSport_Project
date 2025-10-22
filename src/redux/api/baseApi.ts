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
  ) || "https://localhost:7260/api";

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

    const data = (err as FetchBaseQueryError).data as unknown;
    if (typeof data === "string" && /^\s*<!doctype html/i.test(data)) {
  (err as FetchBaseQueryError).data = {
    message:
      "Server trả về HTML (có thể sai route/method hoặc IIS/WebDAV chặn PUT/DELETE/OPTIONS).",
    htmlSnippet: data.slice(0, 200),
  };
} else {

  if (data && typeof data === "object") {
    const d = data as {
      message?: string;
      Message?: string;
      statusCode?: number;
      status?: string;
      errors?: Record<string, string[]>;
    };

    const message =
      d.message ||
      d.Message ||
      (d.statusCode && d.status
        ? `${d.statusCode} ${d.status}`
        : "Đã xảy ra lỗi không xác định");

    (err as FetchBaseQueryError).data = {
      message,
      details: d.errors || undefined,
      statusCode: d.statusCode || undefined,
      status: d.status || undefined,
    };
  } else {
    (err as FetchBaseQueryError).data = {
      message: "Phản hồi từ server không hợp lệ.",
      raw: data,
    };
  }
}
  }
  return res;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes,
  endpoints: () => ({}),
});
