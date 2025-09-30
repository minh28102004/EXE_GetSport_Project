import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@redux/features/auth/authSlice";
import {
  decodeExp,
  readToken,
  clearToken,
  clearProfile,
} from "@utils/authStorage";
import endPoint from "@routes/router";

export default function AuthTokenWatcher() {
  const token = useSelector(selectToken);
  const timerRef = useRef<number | null>(null);

  // ————— Tự logout khi token sắp/hết hạn (trước 30s) —————
  useEffect(() => {
    const hardLogout = () => {
      try {
        clearToken();
        clearProfile();
        // Nếu có dùng redux-persist toàn cục:
        localStorage.removeItem("persist:root");
      } catch {}
      if (window.location.pathname !== endPoint.HOMEPAGE) {
        window.location.replace(endPoint.HOMEPAGE);
      } else {
        window.location.reload();
      }
    };

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!token) return;

    const exp = decodeExp(token);
    if (!exp) return;

    const msLeft = exp * 1000 - Date.now() - 30_000; // trước 30s
    if (msLeft <= 0) {
      hardLogout();
      return;
    }

    timerRef.current = window.setTimeout(hardLogout, msLeft);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [token]);

  // ————— Bắt trường hợp xóa token ngay trong cùng tab / tab khác —————
  useEffect(() => {
    const hardLogout = () => {
      try {
        clearToken();
        clearProfile();
        localStorage.removeItem("persist:root");
      } catch {}
      if (window.location.pathname !== endPoint.HOMEPAGE) {
        window.location.replace(endPoint.HOMEPAGE);
      } else {
        window.location.reload();
      }
    };

    const checkStorage = () => {
      const onDisk = readToken(); // đã kiểm TTL/exp trong readToken
      if (!onDisk && token) {
        // RAM còn token nhưng storage đã mất -> hard refresh
        hardLogout();
      }
    };

    const onStorage = () => checkStorage(); // cross-tab
    const onFocus = () => checkStorage(); // quay lại tab
    const onVis = () => !document.hidden && checkStorage(); // visible
    const pollId = window.setInterval(checkStorage, 1500); // devtools same-tab

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.clearInterval(pollId);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [token]);

  return null;
}
