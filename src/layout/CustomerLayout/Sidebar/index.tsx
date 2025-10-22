// layout/CustomerLayout/Sidebar.tsx
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, ArrowLeft, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition, TargetAndTransition, Variants } from "framer-motion";
import useIsLg from "@hooks/useIsLg";
import endPoint from "@/routes/router";
import { useDispatch } from "react-redux";
import { logout } from "@redux/features/auth/authSlice";
import LoadingSpinner from "@components/Loading_Spinner"; // ⬅️ dùng spinner bạn đưa

/* ================= Types ================= */
export type TabId = "profile" | "history" | "posts" | "reviews" | "playjoin";
export type NavItem = {
  id: TabId;
  label: string;
  icon: LucideIcon;
  to: string;
};

/* ================= Constants ================= */
const WIDTH_EXPANDED = 280;
const WIDTH_COLLAPSED = 80;

/* Motion helpers */
const spring: Transition = { type: "spring", stiffness: 260, damping: 30 };
const springFast: Transition = { type: "spring", stiffness: 320, damping: 32 };

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.02 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0 },
};

/* ================= Menu Item ================= */
type MenuItemButtonProps = {
  item: NavItem;
  showLabel: boolean;
  collapsedDesktop: boolean;
  onAfterClick?: () => void;
};

const MenuItemButton: React.FC<MenuItemButtonProps> = React.memo(
  ({ item, showLabel, collapsedDesktop, onAfterClick }) => {
    const Icon = item.icon;
    const Row = ({ isActive }: { isActive: boolean }) => {
      const rowHover = !isActive
        ? "hover:bg-[#E6F7F8] hover:text-[#23AEB1]"
        : "";
      const tileHover = !isActive
        ? "group-hover:bg-white group-hover:text-[#23AEB1]"
        : "";
      return (
        <div
          className={`group relative w-full overflow-hidden flex items-center ${
            collapsedDesktop ? "justify-center px-2" : "gap-3 px-3"
          } py-2 rounded-xl transition-colors duration-200 ${
            isActive
              ? collapsedDesktop
                ? "text-[#1B8E90]"
                : "bg-gradient-to-r from-[#23AEB1]/15 to-[#1B8E90]/5 text-[#1B8E90] font-semibold"
              : `text-gray-600 ${rowHover}`
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <span
            className={`relative w-[42px] h-[42px] grid place-items-center rounded-xl shrink-0 transition-colors ${
              isActive
                ? "bg-[#1B8E90]/70 text-white"
                : "bg-gray-100 text-gray-700"
            } ${tileHover}`}
          >
            <Icon
              className="w-[22px] h-[22px]"
              strokeWidth={isActive ? 2.5 : 2}
            />
          </span>

          <motion.span
            className="whitespace-nowrap"
            initial={false}
            animate={{
              opacity: showLabel ? 1 : 0,
              width: showLabel ? "auto" : 0,
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {item.label}
          </motion.span>
        </div>
      );
    };

    return (
      <NavLink to={item.to} end className="block" onClick={onAfterClick}>
        {({ isActive }) =>
          collapsedDesktop ? (
            <Tooltip title={item.label} placement="right" arrow>
              <div>
                <Row isActive={isActive} />
              </div>
            </Tooltip>
          ) : (
            <Row isActive={isActive} />
          )
        }
      </NavLink>
    );
  }
);
MenuItemButton.displayName = "MenuItemButton";

/* ================= Footer actions ================= */
type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  collapsedDesktop: boolean;
  danger?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  collapsedDesktop,
  danger = false,
  loading = false,
  loadingLabel,
}) => {
  const content = (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`group w-full flex items-center ${
        collapsedDesktop ? "justify-center px-2" : "gap-3 px-3"
      } py-1.5 rounded-xl transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-600 hover:bg-[#E6F7F8] hover:text-[#23AEB1]"
      } ${loading ? "cursor-wait opacity-70" : ""}`}
      aria-busy={loading}
    >
      <span
        className={`flex-none w-[42px] h-[42px] grid place-items-center rounded-xl shadow-sm transition-colors ${
          danger
            ? "bg-red-50 text-red-600 group-hover:bg-white group-hover:text-red-600"
            : "bg-gray-100 text-gray-600 group-hover:bg-white group-hover:text-[#23AEB1]"
        }`}
      >
        {loading ? (
          // dùng spinner của bạn — inline + chỉnh size & màu
          <LoadingSpinner
            inline
            size="5"
            color={danger ? "red" : "gray"}
            className="border-2"
          />
        ) : (
          <Icon className="w-[22px] h-[22px]" />
        )}
      </span>

      {!collapsedDesktop && (
        <span
          className={`whitespace-nowrap truncate ${
            danger ? "group-hover:text-red-700" : ""
          }`}
        >
          {loading ? loadingLabel ?? "Đang xử lý…" : label}
        </span>
      )}
    </button>
  );

  return collapsedDesktop ? (
    <Tooltip
      title={loading ? loadingLabel ?? "Đang xử lý…" : label}
      placement="right"
      arrow
    >
      <div>{content}</div>
    </Tooltip>
  ) : (
    content
  );
};

/* ================= Layout ================= */
type SidebarLayoutProps = {
  items: NavItem[];
  initialCollapsed?: boolean;
  brand?: React.ReactNode;
  children?: React.ReactNode;
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  items,
  initialCollapsed = false,
  brand,
  children,
}) => {
  const isLg = useIsLg();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(
    !initialCollapsed
  );
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  // trạng thái logout loading
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await sleep(900);
      dispatch(logout());
      navigate(endPoint.HOMEPAGE, { replace: true });
    } finally {
      // điều hướng rồi nên không cần set lại state
    }
  };

  React.useEffect(() => {
    if (!isLg) setMobileOpen(false);
  }, [location.pathname, isLg]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!isLg) document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isLg]);

  const showLabel = (isLg && sidebarOpen) || !isLg;
  const collapsedDesktop = isLg && !sidebarOpen;

  const asideAnim: TargetAndTransition = isLg
    ? {
        width: sidebarOpen ? WIDTH_EXPANDED : WIDTH_COLLAPSED,
        x: 0,
        transition: spring,
      }
    : {
        width: WIDTH_EXPANDED,
        x: mobileOpen ? 0 : -WIDTH_EXPANDED,
        transition: springFast,
      };

  const mainAnim: TargetAndTransition = {
    marginLeft: isLg ? (sidebarOpen ? WIDTH_EXPANDED : WIDTH_COLLAPSED) : 0,
    transition: spring,
  };

  return (
    <div
      className="min-h-screen bg-[#F7FAFC] font-sans"
      aria-busy={isLoggingOut}
    >
      {/* FAB menu (mobile) */}
      <motion.div
        className="lg:hidden fixed top-4 left-4 z-50"
        animate={{
          opacity: mobileOpen ? 0 : 1,
          pointerEvents: mobileOpen ? "none" : "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2.5 bg-white rounded-xl shadow-lg text-slate-500 hover:brightness-90 hover:text-slate-600"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Backdrop mobile */}
      <AnimatePresence>
        {!isLg && mobileOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        aria-label="Thanh điều hướng"
        className="fixed top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-xl z-50"
        style={{ width: WIDTH_EXPANDED }}
        animate={asideAnim}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-4 border-b border-gray-100 relative">
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap"
              initial={false}
              animate={{
                opacity: collapsedDesktop ? 0 : 1,
                x: collapsedDesktop ? -8 : 0,
                scale: collapsedDesktop ? 0.98 : 1,
              }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              {brand ?? (
                <span
                  className="text-4xl font-bold text-[#23AEB1] leading-relaxed"
                  style={{ fontFamily: "Fredoka One" }}
                >
                  Get Sport!
                </span>
              )}
            </motion.div>

            {/* Toggle (desktop) */}
            {isLg && (
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className={`absolute top-1/2 -translate-y-1/2 p-2.5 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 ${
                  collapsedDesktop ? "left-1/2 -translate-x-1/2" : "right-2"
                }`}
                aria-label={sidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
                aria-expanded={sidebarOpen}
              >
                <ChevronRight
                  className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
                    sidebarOpen ? "rotate-180" : "ml-0.5"
                  }`}
                />
              </button>
            )}

            {/* Close (mobile) */}
            {!isLg && (
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute text-gray-600 hover:text-gray-700 right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng"
              >
                <X className="w-5.5 h-5.5" />
              </motion.button>
            )}
          </div>

          {/* Nav */}
          <motion.nav
            className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overscroll-contain"
            role="navigation"
            aria-label="Main navigation"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {items.map((it) => (
              <motion.div key={it.id} variants={itemVariants}>
                <MenuItemButton
                  item={it}
                  showLabel={showLabel}
                  collapsedDesktop={collapsedDesktop}
                  onAfterClick={() => {
                    if (!isLg) setMobileOpen(false);
                  }}
                />
              </motion.div>
            ))}
          </motion.nav>

          {/* Footer actions */}
          <div className="px-3 pb-3 pt-2 mt-auto space-y-2 border-t border-gray-100">
            <ActionButton
              icon={ArrowLeft}
              label="Quay lại trang chủ"
              onClick={() => navigate(endPoint.HOMEPAGE)}
              collapsedDesktop={collapsedDesktop}
            />
            <ActionButton
              icon={LogOut}
              label="Đăng xuất"
              loading={isLoggingOut} // dùng spinner của bạn
              loadingLabel="Đang đăng xuất…"
              onClick={handleLogout}
              collapsedDesktop={collapsedDesktop}
              danger
            />
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main initial={false} animate={mainAnim}>
        {children}
      </motion.main>
    </div>
  );
};

export default SidebarLayout;
