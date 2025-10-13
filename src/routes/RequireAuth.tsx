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

  useTokenGuard(redirectTo);

  if (!accessToken) return <Navigate to={redirectTo} replace />;
  return children ? <>{children}</> : <Outlet />;
}
