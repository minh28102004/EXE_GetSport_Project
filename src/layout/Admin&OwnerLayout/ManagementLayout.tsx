import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import {
  Home,
  Grid,
  Calendar,
  Users,
  Star,
  MessageSquare,
  Settings,
} from "lucide-react";

const ManagementLayout: React.FC<{ user?: any; role?: "admin" | "owner" }> = ({
  user,
  role,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Check mobile / desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Desktop luôn mở, mobile mặc định đóng
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Đóng sidebar khi click ra ngoài (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Menu items theo role
  const menuItems =
    role === "admin"
      ? [
          {
            name: "Tổng quan",
            path: "/layoutAdmin/Dashboard",
            icon: <Home size={24} />,
          },
          {
            name: "Quản lý sân",
            path: "/layoutAdmin/CourtManagement",
            icon: <Grid size={24} />,
          },
          {
            name: "Quản lý blog",
            path: "/layoutAdmin/BlogManagement",
            icon: <Grid size={24} />,
          },
          {
            name: "Quản lý gói",
            path: "/layoutAdmin/PackageManagement",
            icon: <Grid size={24} />,
          },
          {
            name: "Quản lý đơn đặt sân",
            path: "/layoutAdmin/BookingManagement",
            icon: <Calendar size={24} />,
          },
            {
            name: "Quản lý đơn đặt sân",
            path: "/layoutAdmin/CourtBookingManagement",
            icon: <Calendar size={24} />,
          },
            {
            name: "Quản lý slot sân",
            path: "/layoutAdmin/CourtSlotManagement",
            icon: <Calendar size={24} />,
          },
            {
            name: "Quản lý feedback",
            path: "/layoutAdmin/FeedbackManagement",
            icon: <Calendar size={24} />,
          },
            {
            name: "Quản lý playmate post",
            path: "/layoutAdmin/PlaymatePostManagement",
            icon: <Calendar size={24} />,
          },
           {
            name: "Quản lý playmate join",
            path: "/layoutAdmin/PlaymateJoinManagement",
            icon: <Calendar size={24} />,
          },
          {
            name: "Báo cáo đặt sân",
            path: "/layoutAdmin/BookingReport",
            icon: <Calendar size={24} />,
          },
          {
            name: "Quản lý người dùng",
            path: "/layoutAdmin/UserManagement",
            icon: <Users size={24} />,
          },
        ]
      : [
          {
            name: "Tổng quan",
            path: "/layoutOwner/Dashboard",
            icon: <Home size={24} />,
          },
          {
            name: "Quản lý sân",
            path: "/layoutOwner/CourtManagement",
            icon: <Grid size={24} />,
          },
          {
            name: "Đơn đặt sân",
            path: "/layoutOwner/BookingManagement",
            icon: <Calendar size={24} />,
          },
          {
            name: "Phản hồi khách hàng",
            path: "/layoutOwner/Feedback",
            icon: <Star size={24} />,
          },
           {
            name: "Gói dịch vụ",
            path: "/layoutOwner/ownerpackages",
            icon: <Star size={24} />,
          },
          {
            name: "Gói của tôi",
            path: "/layoutOwner/my-subscriptions",
            icon: <MessageSquare size={24} />,
          },
          {
            name: "Cài đặt",
            path: "/layoutOwner/Settings",
            icon: <Settings size={24} />,
          },
        ];

  return (
    <div className="flex h-screen bg-gray-50 text-black transition-colors duration-300 relative">
      {/* Overlay khi mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        sidebarRef={sidebarRef}
        menuItems={menuItems}
        locationPath={location.pathname}
        navigateTo={navigate}
        user={user}
        onOpenProfile={() => alert("Open profile modal")}
        onCloseMobile={() => setSidebarOpen(false)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} // truyền xuống
      />

      {/* Nội dung chính */}
      <main className="flex-1 p-3 overflow-auto relative z-0">
        {/* Header mobile */}
        {isMobile && (
          <Header
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        <Outlet context={{ userId: user?.userName }} />
      </main>
    </div>
  );
};

export default ManagementLayout;
