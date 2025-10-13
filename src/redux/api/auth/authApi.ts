import { baseApi } from "@redux/api/baseApi";
import type { ApiEnvelope, AuthData, LoginBody, RegisterBody, VerifyAccountRequest } from "./type";

type AuthProfile = Omit<AuthData, "token">;

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<ApiEnvelope<AuthData>, LoginBody>({
      query: (body) => ({ url: "Auth/login", method: "POST", body }),
    }),

    register: b.mutation<ApiEnvelope<AuthProfile | null>, RegisterBody>({
      query: (body) => ({ url: "Auth/register", method: "POST", body }),
      transformResponse: (
        resp: ApiEnvelope<AuthData | null>
      ): ApiEnvelope<AuthProfile | null> => {
        if (!resp?.data) return { ...resp, data: null };
        const { token, ...profile } = resp.data;
        return { ...resp, data: profile as AuthProfile };
      },
    }),

    verifyAccount: b.mutation<ApiEnvelope<string>, VerifyAccountRequest>({
      query: (body) => ({
        url: "Auth/verify",
        method: "POST",
        body,
      }),
      transformResponse: (resp: ApiEnvelope<string>): ApiEnvelope<string> => {
        console.log("verifyAccount Response:", resp); 
        return resp;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useVerifyAccountMutation } = authApi;