// src/redux/features/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { RootState } from "@redux/store/store";
import { logout } from "@redux/features/auth/authSlice";

/** Luôn gọi trực tiếp lên host thật (không dùng proxy localhost) */
const API_BASE =
  ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "")) ||
  "https://api.getsport.3docorp.vn/api";

/** Chuẩn hoá args: bỏ leading '/' ở URL tương đối để không cắt mất path của baseUrl */
const normalizeArgs = (args: string | FetchArgs): string | FetchArgs => {
  const isAbs = (u: string) => /^https?:\/\//i.test(u);

  if (typeof args === "string") {
    return isAbs(args) ? args : args.replace(/^\/+/, "");
  }
  if (typeof args.url === "string" && !isAbs(args.url)) {
    return { ...args, url: args.url.replace(/^\/+/, "") };
  }
  return args;
};

const rawBase = fetchBaseQuery({
  baseUrl: API_BASE,
  // Nếu backend dùng cookie, bật thêm: credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  unknown,
  FetchBaseQueryMeta
> = async (args, api, extra) => {
  const res = await rawBase(normalizeArgs(args), api, extra);

  if ("error" in res) {
    const err = res.error;
    if (err?.status === 401) api.dispatch(logout());

    // Nếu server trả HTML (IIS 404/405), hiển thị message dễ hiểu hơn
    const data = (err as FetchBaseQueryError).data as unknown;
    if (typeof data === "string" && /^\s*<!doctype html/i.test(data)) {
      (err as FetchBaseQueryError).data = {
        message:
          "Server trả về HTML (không phải JSON) — thường do sai route/method hoặc IIS/WebDAV chặn PUT/DELETE.",
        htmlSnippet: data.slice(0, 200),
      };
    }
  }

  return res;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Account"],
  endpoints: () => ({}),
});
