import React from "react";
import { Outlet } from "react-router-dom";
import { User, Calendar, FileText, Star, Play } from "lucide-react";
import type { NavItem } from "./Sidebar";
import SidebarLayout from "./Sidebar";
import endPoint from "@routes/router";

const join = (base: string, rel: string) =>
  `${base.replace(/\/$/, "")}/${rel.replace(/^\//, "")}`;

export default function CustomerLayout() {
  const [userRole, setUserRole] = React.useState<string>("Customer");

  React.useEffect(() => {
    const storedAuth = sessionStorage.getItem("auth_profile");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setUserRole(parsedAuth.user?.role || "Customer");
      } catch (error) {
        console.error("Failed to parse auth_profile from session storage:", error);
        setUserRole("Customer");
      }
    }
  }, []);

  const PROFILE = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_PROFILE);
  const HISTORY = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_HISTORY);
  const POSTS = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_POSTS);
  const REVIEWS = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_REVIEWS);
  const PLAYJOIN = join("", "/playjoin/my");

  const allItems: NavItem[] = [
    { id: "profile", label: "Hồ sơ người dùng", icon: User, to: PROFILE },
    { id: "history", label: "Lịch sử đặt sân", icon: Calendar, to: HISTORY },
    { id: "posts", label: "Bài viết đã đăng", icon: FileText, to: POSTS },
    { id: "reviews", label: "Đánh giá của tôi", icon: Star, to: REVIEWS },
    { id: "playjoin", label: "Yêu cầu chơi", icon: Play, to: PLAYJOIN },
    { id: "notifications", label: "Thông báo", icon: User, to: "/notifications" },
    { id: "playPost", label: "Tìm bạn chơi", icon: User, to: "/playPost/my" },
  ];

  const items = userRole === "Customer"
    ? allItems
    : allItems.filter((item) => (item.id === "profile" || item.id === "notifications"));

  return (
    <SidebarLayout items={items}>
      <Outlet />
    </SidebarLayout>
  );
}