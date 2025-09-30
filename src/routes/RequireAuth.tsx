// src/routes/RequireAuth.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectAuth } from "@redux/features/auth/authSlice";
import useTokenGuard from "@hooks/useTokenGuard";
import endPoint from "@routes/router";

export default function RequireAuth({
  redirectTo = endPoint.HOMEPAGE,
  children,
}: {
  redirectTo?: string;
  children?: React.ReactNode;
}) {
  const { accessToken } = useSelector(selectAuth);

  // Theo dõi mất token & hard refresh nếu cần
  useTokenGuard(redirectTo);

  if (!accessToken) return <Navigate to={redirectTo} replace />;
  // Nếu có children => bọc trực tiếp element, nếu không thì dùng Outlet như cũ
  return children ? <>{children}</> : <Outlet />;
}
