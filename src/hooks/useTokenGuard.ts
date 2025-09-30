import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectAuth } from "@redux/features/auth/authSlice";
import { readToken, clearToken, clearProfile } from "@utils/authStorage";
import endPoint from "@routes/router";

export default function useTokenGuard(redirectTo: string = endPoint.HOMEPAGE) {
  const { accessToken } = useSelector(selectAuth);
  const location = useLocation();
  const checking = useRef(false);

  useEffect(() => {
    const hardLogout = () => {
      try {
        clearToken();
        clearProfile();
        localStorage.removeItem("persist:root");
      } catch {}
      // Hard refresh về redirectTo
      if (window.location.pathname !== redirectTo) {
        window.location.replace(redirectTo);
      } else {
        window.location.reload();
      }
    };

    const check = () => {
      if (checking.current) return;
      checking.current = true;
      try {
        const tokenOnDisk = readToken(); // đã kiểm TTL/exp bên trong
        const tokenInStore = accessToken;
        const lost = !!tokenInStore && !tokenOnDisk; // RAM có nhưng storage mất
        if (lost) {
          // KHÔNG dispatch/logout + navigate để tránh nháy UI,
          // hard refresh luôn cho sạch trạng thái.
          hardLogout();
        }
      } finally {
        checking.current = false;
      }
    };

    // 1) kiểm tra ngay khi mount & khi route đổi
    check();

    // 2) khi tab focus / visible
    const onFocus = () => check();
    const onVisibility = () =>
      document.visibilityState === "visible" && check();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    // 3) cross-tab
    const onStorage = () => check();
    window.addEventListener("storage", onStorage);

    // 4) Poll rất nhẹ (bắt case sửa storage bằng DevTools trong cùng TAB)
    const POLL_MS = Number(import.meta.env.VITE_AUTH_GUARD_POLL_MS ?? 1500);
    const id = POLL_MS > 0 ? window.setInterval(check, POLL_MS) : undefined;

    return () => {
      if (id) window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, [accessToken, location, redirectTo]);
}
