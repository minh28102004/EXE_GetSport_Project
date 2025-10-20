import { baseApi } from "@redux/api/baseApi";
import type { ApiEnvelope, AuthData, LoginBody, RegisterBody, VerifyAccountRequest, ForgotPasswordBody, ResetPasswordBody } from "./type";

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

    forgotPassword: b.mutation<ApiEnvelope<null>, ForgotPasswordBody>({
      query: (body) => ({
        url: "Auth/forgot-password-token",
        method: "POST",
        body,
      }),
    }),

    resetPassword: b.mutation<ApiEnvelope<null>, ResetPasswordBody>({
      query: (body) => ({
        url: "Auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;