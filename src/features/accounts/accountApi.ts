// src/features/account/accountApi.ts
import { baseApi } from "../api/baseApi";
import type { Account } from "../types/account";

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => "/Account", // đổi từ "/accounts" -> "/Account"
      transformResponse: (response: { data: Account[] }) => response.data,
      providesTags: ["Accounts"],
    }),
  }),
});

export const { useGetAccountsQuery } = accountApi;
