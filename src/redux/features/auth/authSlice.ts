import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  readProfile,
  writeProfile,
  clearProfile,
  persistToken,
  readToken,
  clearToken,
} from "@utils/authStorage";

export type User = { fullname: string; email: string; role: string };

export type AuthState = {
  accessToken: string | null; // RAM (có thể rehydrate từ storage nếu bật)
  user: User | null;          // persist cho UX
  remember: boolean;          // persist
};

const { user, remember } = readProfile();
const initialToken = readToken(); // đã được kiểm tra exp/TTL bên trong

const initialState: AuthState = {
  accessToken: initialToken ?? null,
  user,
  remember,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ONE-SHOT tiện dùng trong Login: set token + profile + remember
    setLoggedIn: (
      s,
      a: PayloadAction<{ token: string; user: User; remember?: boolean }>
    ) => {
      s.accessToken = a.payload.token;
      s.user = a.payload.user;
      if (typeof a.payload.remember === "boolean") s.remember = a.payload.remember;

      // persist profile
      writeProfile(s.user, s.remember);
      // persist token (nếu cho phép)
      persistToken(s.accessToken, s.remember);
    },

    // Update token riêng (ví dụ đổi token sau khi đổi mật khẩu…)
    setAccessToken: (s, a: PayloadAction<string | null>) => {
      s.accessToken = a.payload;
      if (s.accessToken) persistToken(s.accessToken, s.remember);
      else clearToken();
    },

    // Update hồ sơ hoặc remember (không đụng token)
    setUserProfile: (s, a: PayloadAction<{ user: User | null; remember?: boolean }>) => {
      s.user = a.payload.user;
      if (typeof a.payload.remember === "boolean") s.remember = a.payload.remember;
      writeProfile(s.user, s.remember);

      // nếu đang có token, chuyển nơi lưu theo remember mới
      if (s.accessToken) persistToken(s.accessToken, s.remember);
    },

    logout: (s) => {
      s.accessToken = null;
      s.user = null;
      s.remember = false;
      clearProfile();
      clearToken();
    },
  },
});

export const { setLoggedIn, setAccessToken, setUserProfile, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth  = (st: { auth: AuthState }) => st.auth;
export const selectToken = (st: { auth: AuthState }) => st.auth.accessToken;
export const selectUser  = (st: { auth: AuthState }) => st.auth.user;
