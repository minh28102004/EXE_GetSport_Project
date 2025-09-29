// src/utils/authTokenWatcher.tsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, logout } from "@redux/features/auth/authSlice";
import { decodeExp } from "@utils/authStorage";

export default function AuthTokenWatcher() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!token) return;

    const exp = decodeExp(token);
    if (!exp) return;

    const msLeft = exp * 1000 - Date.now() - 30_000;
    if (msLeft <= 0) {
      dispatch(logout());
      return;
    }

    timerRef.current = window.setTimeout(() => dispatch(logout()), msLeft);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [token, dispatch]);

  return null;
}
