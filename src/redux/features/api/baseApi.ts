// src/redux/features/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@redux/store/store";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "@redux/features/auth/authSlice";

const rawBase = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: async (args, api, extra) => {
    const res = await rawBase(args, api, extra);
    if ("error" in res) {
      const err = res.error as FetchBaseQueryError;
      if (err.status === 401) api.dispatch(logout());
    }
    return res;
  },
  tagTypes: ["Account"],                                 
  endpoints: () => ({}),
});
