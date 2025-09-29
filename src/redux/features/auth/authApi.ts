// src/redux/features/auth/authApi.ts
import { baseApi } from "@redux/features/api/baseApi";
import type { ApiEnvelope, AuthData, LoginBody, RegisterBody } from "./type";
// import { setLoggedIn } from "./authSlice"; // ❌ KHÔNG cần ở đây, để component làm

// Dữ liệu hồ sơ KHÔNG chứa token
type AuthProfile = Omit<AuthData, "token">;

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // ===== LOGIN: chỉ gọi API, để component xử lý setLoggedIn (có remember) =====
    login: b.mutation<ApiEnvelope<AuthData>, LoginBody>({
      query: (body) => ({ url: "/Auth/login", method: "POST", body }),
      // ❌ bỏ onQueryStarted để không tự ghi token ở đây
    }),

    // ===== REGISTER: nếu BE trả token, loại bỏ trước khi cache =====
    register: b.mutation<ApiEnvelope<AuthProfile | null>, RegisterBody>({
      query: (body) => ({ url: "/Auth/register", method: "POST", body }),
      transformResponse: (
        resp: ApiEnvelope<AuthData | null>
      ): ApiEnvelope<AuthProfile | null> => {
        if (!resp?.data) return { ...resp, data: null };
        const { token, ...profile } = resp.data;
        return { ...resp, data: profile as AuthProfile };
      },
      // Không dispatch setLoggedIn ở đây
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation } = authApi;


