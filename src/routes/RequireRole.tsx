// src/routes/RequireRole.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectAuth } from "@redux/features/auth/authSlice";
import endPoint from "@routes/router";

type Role = "admin" | "owner" | "customer" | string;
const norm = (v?: string) => (v ?? "").trim().toLowerCase();

// mở rộng: chấp nhận vài biến thể role phổ biến
const normalizeRole = (r?: string) => {
  const s = norm(r);
  if (s.startsWith("role_")) return s.slice(5);
  if (s === "administrator") return "admin";
  return s;
};

export default function RequireRole({
  allowed,
  redirectTo = endPoint.ACCESSDENIED,
  children,
}: {
  allowed: Role[];
  redirectTo?: string;
  children?: React.ReactNode;
}) {
  const { accessToken, user } = useSelector(selectAuth);
  const location = useLocation();

  if (!accessToken || !user) {
    return (
      <Navigate to={endPoint.HOMEPAGE} replace state={{ from: location }} />
    );
  }

  const allowSet = new Set(allowed.map((r) => norm(r)));
  const ok = allowSet.has(normalizeRole(user.role));

  if (!ok) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // children => bọc trực tiếp element; fallback Outlet cho kiểu nested cũ
  return children ? <>{children}</> : <Outlet />;
}
