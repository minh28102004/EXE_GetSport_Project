import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Calendar,
  LogOut,
  FileText,
  MessageSquare,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { selectAuth } from "@redux/features/auth/authSlice";
import { clearToken, clearProfile } from "@utils/authStorage";
import endPoint from "@routes/router";
import AvatarUserImage from "@components/Avatar_User_Image";
import { motion, AnimatePresence } from "framer-motion";

type Placement = "down" | "up";

interface UserMenuProps {
  placement?: Placement;
  className?: string;
  showNameOnMobile?: boolean;
}

const roleInfo = (role?: string) => {
  const r = (role ?? "").trim().toLowerCase();
  switch (r) {
    case "admin":
    case "administrator":
    case "sysadmin":
      return { label: "Quản trị viên", gradient: "from-rose-500 to-red-600" };
    case "owner":
    case "manager":
    case "staff":
      return { label: "Chủ sân", gradient: "from-amber-500 to-orange-600" };
    case "customer":
    case "user":
      return { label: "Khách hàng", gradient: "from-teal-500 to-emerald-500" };
    default:
      return { label: "Người dùng", gradient: "from-teal-500 to-emerald-500" };
  }
};

const UserMenu: React.FC<UserMenuProps> = ({
  placement = "down",
  className = "",
  showNameOnMobile = false,
}) => {
  const { user, accessToken } = useSelector(selectAuth);
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !popRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!accessToken) setOpen(false);
  }, [accessToken]);

  if (!user) return null;

  // Đăng xuất: đóng dropdown, show loading 1s, rồi clear storage + refresh
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setOpen(false);
    setIsLoggingOut(true);
    try {
      await sleep(1000);
      clearToken();
      clearProfile();
      localStorage.removeItem("persist:root");
    } finally {
      window.location.replace(endPoint.HOMEPAGE);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Hồ sơ cá nhân",
      to: "/profile",
      color: "text-gray-700",
      hoverColor: "hover:bg-blue-50 hover:text-blue-700",
      iconBg: "group-hover:bg-blue-100",
    },
    {
      icon: Calendar,
      label: "Lịch sử đặt sân",
      to: "/booking-history",
      color: "text-gray-700",
      hoverColor: "hover:bg-blue-50 hover:text-blue-700",
      iconBg: "group-hover:bg-blue-100",
    },
    {
      icon: FileText,
      label: "Bài viết đã đăng",
      to: "/my-posts",
      color: "text-gray-700",
      hoverColor: "hover:bg-blue-50 hover:text-blue-700",
      iconBg: "group-hover:bg-blue-100",
    },
    {
      icon: MessageSquare,
      label: "Đánh giá của tôi",
      to: "/my-reviews",
      color: "text-gray-700",
      hoverColor: "hover:bg-blue-50 hover:text-blue-700",
      iconBg: "group-hover:bg-blue-100",
    },
  ];

  const { label: roleLabel, gradient } = roleInfo(user.role);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        ref={btnRef}
        onClick={() => !isLoggingOut && setOpen((o) => !o)}
        className={`group relative flex items-center gap-2.5 rounded-full bg-white px-3 py-1.5 overflow-hidden transition-all duration-300
    ${isLoggingOut ? "cursor-wait opacity-90" : "hover:shadow-md"}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-busy={isLoggingOut}
        disabled={isLoggingOut}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-transparent
               opacity-0 group-hover:opacity-100 transition-opacity duration-300
               [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#14b8a6,#10b981,#22c55e)_border-box]"
        />{" "}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-emerald-500/50
               group-hover:ring-transparent transition"
        />
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <AvatarUserImage
              name={user.fullname}
              size={36}
              ringClassName="ring-2 ring-white"
            />

            {!isLoggingOut && (
              <span className="absolute -bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            )}

            {isLoggingOut && (
              <span
                className="pointer-events-none absolute inset-[-3px] rounded-full border-2 border-transparent border-t-blue-500 animate-spin"
                aria-hidden="true"
              />
            )}

            {!isLoggingOut && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={
                  open ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
                }
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-400" />
              </motion.div>
            )}
          </div>

          <span
            className={`${
              showNameOnMobile ? "" : "hidden md:block"
            } text-[15px] font-medium max-w-[180px] truncate ${
              isLoggingOut ? "text-blue-500" : "text-gray-700"
            }`}
          >
            {isLoggingOut ? "Đang đăng xuất…" : user.fullname}
          </span>

          {!isLoggingOut && (
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </motion.div>
          )}
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && !isLoggingOut && (
          <>
            {placement === "down" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                style={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              />
            )}

            <motion.div
              ref={popRef}
              role="menu"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: placement === "up" ? 10 : -10,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: placement === "up" ? 10 : -10,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              className={`absolute right-0 ${
                placement === "up" ? "bottom-full mb-3" : "mt-3"
              } w-[248px] rounded-2xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden`}
            >
              {/* Header */}
              <div className="relative px-6 py-3 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative">
                  <p className="text-base font-semibold text-gray-900 mb-0.5">
                    {user.fullname}
                  </p>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {user.email}
                  </p>
                  <motion.span
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${gradient} text-white text-[10px] font-medium px-2 py-0.5 shadow-sm uppercase tracking-wide`}
                    title={user.role}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {roleLabel}
                  </motion.span>
                </div>
              </div>

              {/* Items */}
              <nav className="py-1.5 px-2">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 * idx,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <Link
                      to={item.to}
                      className={`group flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${item.color} ${item.hoverColor}`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 ${item.iconBg} transition-colors duration-200`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                      <motion.div
                        initial={{ x: -5, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="ml-auto"
                      >
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mx-4 border-t border-gray-100" />

              {/* Logout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-2 py-1.5"
              >
                <motion.button
                  onClick={handleLogout}
                  initial="rest"
                  whileHover="hover"
                  className="group w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50 group-hover:bg-red-100 transition-colors duration-200">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Đăng xuất</span>
                  <motion.div
                    className="ml-auto"
                    variants={{
                      rest: { x: 0, opacity: 0.7 },
                      hover: { x: 6, opacity: 1 },
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
