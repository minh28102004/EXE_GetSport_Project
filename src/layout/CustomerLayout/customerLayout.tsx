import React from "react";
import { Outlet } from "react-router-dom";
import { User, Calendar, FileText, Star, Play } from "lucide-react";
import type { NavItem } from "./Sidebar";
import SidebarLayout from "./Sidebar";
import endPoint from "@routes/router";

/** join path an toàn: ghép base + child, xử lý thừa/thiếu "/" */
const join = (base: string, rel: string) =>
  `${base.replace(/\/$/, "")}/${rel.replace(/^\//, "")}`;

export default function CustomerLayout() {
  // Tạo sẵn các path tuyệt đối /customerlayout/<child>
  const PROFILE  = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_PROFILE);
  const HISTORY  = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_HISTORY);
  const POSTS    = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_POSTS);
  const REVIEWS  = join(endPoint.CUSTOMER_BASE, endPoint.CUSTOMER_REVIEWS);
  const PLAYJOIN  = join("", "/playjoin/my");

  const items: NavItem[] = [
    { id: "profile", label: "Hồ sơ người dùng", icon: User,     to: PROFILE },
    { id: "history", label: "Lịch sử đặt sân",  icon: Calendar, to: HISTORY },
    { id: "posts",   label: "Bài viết đã đăng", icon: FileText, to: POSTS },
    { id: "reviews", label: "Đánh giá của tôi", icon: Star,     to: REVIEWS },
    { id: "playjoin", label: "Yêu cầu chơi", icon: Play,     to: PLAYJOIN }
  ];

  return (
    <SidebarLayout items={items}>
      <Outlet />
    </SidebarLayout>
  );
}
