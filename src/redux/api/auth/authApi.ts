import { baseApi } from "@redux/api/baseApi";
import type { ApiEnvelope, AuthData, LoginBody, RegisterBody } from "./type";

type AuthProfile = Omit<AuthData, "token">;

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // Login: để component tự dispatch setLoggedIn (có remember)
    login: b.mutation<ApiEnvelope<AuthData>, LoginBody>({
      // Không có "/" đầu vì baseUrl đã có "/"
      query: (body) => ({ url: "Auth/login", method: "POST", body }),
    }),

    // Register: nếu BE trả token, lọc bỏ trước khi cache
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
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation } = authApi;
