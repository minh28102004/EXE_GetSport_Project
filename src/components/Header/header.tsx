// Header.tsx
import endPoint from "@routes/router.js";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  HelpCircle,
  Home,
  Menu,
  Newspaper,
  Phone,
  User,
  UserPlus,
  X,
  MessageCircleQuestion,
} from "lucide-react";
import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  animate,
  type MotionValue,
  AnimatePresence,
} from "framer-motion";
import { useSelector } from "react-redux";
import { selectAuth } from "@redux/features/auth/authSlice";
import UserMenu from "@components/Header/userMenu";

/* ======================= Types ======================= */
interface HeaderProps {
  variant?: "site" | "auth";
}
interface NavItem {
  label: string;
  href?: string;
  to?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  hasDropdown?: boolean;
}

/* ======================= Brand ======================= */
const Brand: React.FC = () => (
  <Link
    to={endPoint.HOMEPAGE}
    className="flex items-center gap-3 group transition-transform hover:scale-105"
  >
    <span
      className="text-4xl font-bold bg-gradient-to-r from-[#23AEB1] to-[#1e9ea1] bg-clip-text text-transparent"
      style={{ fontFamily: "Fredoka One" }}
    >
      Get Sport!
    </span>
  </Link>
);

/* ======================= Data ======================= */
const navItems: NavItem[] = [
  { label: "Trang chủ", to: endPoint.HOMEPAGE, icon: Home },
  { label: "Giới thiệu", to: endPoint.ABOUT, icon: HelpCircle },
  { label: "Bài viết", to: endPoint.BLOGPOST, icon: Newspaper },
  { label: "FAQs", to: endPoint.FAQS, icon: MessageCircleQuestion },
  { label: "Đặt sân", to: endPoint.COURTBOOKING, icon: Calendar },
  { label: "Liên hệ", to: endPoint.CONTACT, icon: Phone },
];

/* ======================= Utils ======================= */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange as any);
    };
  }, []);
  return reduced;
}

/* =================== Desktop SiteNav =================== */
const SiteNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReduced = usePrefersReducedMotion();

  const activeIndex = useMemo(() => {
    const path = location.pathname;
    const idx = navItems.findIndex((n) => {
      if (!n.to) return false;
      if (n.to === "/") return path === "/";
      return path === n.to || path.startsWith(n.to + "/");
    });
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const x: MotionValue<number> = useMotionValue(0);
  const y: MotionValue<number> = useMotionValue(0);
  const w: MotionValue<number> = useMotionValue(0);
  const h: MotionValue<number> = useMotionValue(0);

  const measure = (index: number) => {
    const el = itemRefs.current[index];
    const wrap = containerRef.current;
    if (!el || !wrap) return { tx: 0, ty: 0, tw: 0, th: 0 };

    const a = el.getBoundingClientRect();
    const b = wrap.getBoundingClientRect();

    const tx = Math.round(a.left - b.left);
    const ty = Math.round(a.top - b.top);
    const tw = Math.round(a.width);
    const th = Math.round(a.height);

    return { tx, ty, tw, th };
  };

  useLayoutEffect(() => {
    const { tx, ty, tw, th } = measure(activeIndex);
    x.set(tx);
    y.set(ty);
    w.set(tw);
    h.set(th);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pending, setPending] = useState<{ index: number; to: string } | null>(
    null
  );
  const displayIndex = pending?.index ?? activeIndex;

  useEffect(() => {
    if (pending && activeIndex === pending.index) setPending(null);
  }, [activeIndex, pending]);

  useEffect(() => {
    const onResize = () => {
      const { tx, ty, tw, th } = measure(displayIndex);
      x.set(tx);
      y.set(ty);
      w.set(tw);
      h.set(th);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [displayIndex, x, y, w, h]);

  useLayoutEffect(() => {
    if (pending) return;
    const { tx, ty, tw, th } = measure(activeIndex);
    x.set(tx);
    y.set(ty);
    w.set(tw);
    h.set(th);
  }, [activeIndex, pending, x, y, w, h]);

  type AnimateOpt =
    | { duration?: number }
    | { type: "spring"; stiffness?: number; damping?: number; mass?: number };

  const animateTo = (index: number, onDone?: () => void) => {
    const { tx, ty, tw, th } = measure(index);
    const opt: AnimateOpt = prefersReduced
      ? { duration: 0 }
      : { type: "spring", stiffness: 140, damping: 24, mass: 1.05 };

    const a1 = animate(x, tx, opt);
    const a2 = animate(y, ty, opt);
    const a3 = animate(w, tw, opt);
    const a4 = animate(h, th, opt);

    Promise.all([a1.finished, a2.finished, a3.finished, a4.finished]).then(() =>
      onDone?.()
    );
  };

  const onItemClick = (e: React.MouseEvent, index: number, to?: string) => {
    if (!to) return;
    if (index === activeIndex) return;
    e.preventDefault();

    if (prefersReduced) {
      navigate(to);
      return;
    }
    setPending({ index, to });
    animateTo(index, () => navigate(to));
  };

  return (
    <div
      ref={containerRef}
      className="
        hidden lg:flex items-center gap-1 relative
        rounded-xl bg-white shadow-md ring-1 ring-slate-200
        backdrop-blur-xl p-1
      "
      style={{ isolation: "isolate" }}
    >
      {/* Indicator */}
      <motion.span
        className="absolute top-0 left-0 rounded-lg pointer-events-none overflow-hidden"
        style={{ x, y, width: w, height: h }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#23AEB1]/10 via-[#1e9ea1]/10 to-[#23AEB1]/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#23AEB1]/5 to-[#1e9ea1]/5 backdrop-blur-sm" />
        <div className="absolute inset-0 ring-1 ring-[#23AEB1]/20 rounded-lg" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.span>

      {navItems.map((item, i) => {
        const isActive = i === activeIndex;

        const inner = (
          <div
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`
              relative group
              flex items-center gap-1.5
              px-3.5 py-[7px] rounded-lg text-[14px] overflow-hidden
              transition-colors
              ${
                isActive
                  ? "text-[#077377]"
                  : "text-gray-700 hover:text-[#23AEB1] hover:bg-[#23AEB1]/5"
              }
            `}
            onClick={(e) => onItemClick(e, i, item.to)}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <item.icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? "scale-110 text-[#12878b]"
                    : "group-hover:scale-110"
                }`}
              />
              <span className={isActive ? "font-medium" : "font-normal"}>
                {item.label}
              </span>
              {item.hasDropdown && (
                <ChevronDown className="w-4 h-4 opacity-70" />
              )}
            </span>

            {!isActive && (
              <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#23AEB1] group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out rounded-b-lg" />
            )}
          </div>
        );

        return item.to ? (
          <NavLink key={i} to={item.to} className="rounded-lg">
            {inner}
          </NavLink>
        ) : (
          <a key={i} href={item.href} className="rounded-lg">
            {inner}
          </a>
        );
      })}
    </div>
  );
};

/* =================== Mobile Nav =================== */
const MobileNav: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { accessToken } = useSelector(selectAuth);

  // Khoá scroll nền khi mở
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC để đóng
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Panel */}
          <motion.aside
            key="panel"
            className="fixed right-0 top-0 h-full w-[60vw] max-w-[360px] z-[60] bg-white shadow-2xl flex flex-col md:hidden"
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Brand />
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="p-2 rounded-md hover:bg-slate-100"
                onClick={onClose}
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* List */}
            <nav className="p-3 space-y-1 overflow-y-auto">
              {navItems.map((item, index) => {
                const content = (
                  <div className="flex items-center gap-3 p-3 rounded-lg text-gray-700 font-medium transition-all duration-200 hover:text-[#23AEB1] hover:bg-[#23AEB1]/5 group">
                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 ml-auto transition-transform group-hover:rotate-180" />
                    )}
                  </div>
                );
                return item.to ? (
                  <NavLink
                    key={index}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block rounded-lg ${
                        isActive ? "text-[#23AEB1] bg-[#23AEB1]/10" : ""
                      }`
                    }
                  >
                    {content}
                  </NavLink>
                ) : (
                  <a
                    key={index}
                    href={item.href}
                    onClick={onClose}
                    className="block cursor-pointer rounded-lg"
                  >
                    {content}
                  </a>
                );
              })}
            </nav>

            {/* Footer / UserMenu */}

            {!accessToken ? (
              <div className="mt-auto p-4 border-t border-gray-100 space-y-3">
                <Link
                  to={endPoint.REGISTER}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#23AEB1] text-[#23AEB1] font-medium transition-all duration-300 hover:bg-[#23AEB1]/10 hover:shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
                <Link
                  to={endPoint.LOGIN}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#23AEB1] via-[#20a4a6] to-[#1e9ea1] text-white font-medium shadow-md transition-all duration-500 hover:shadow-xl"
                >
                  <User className="w-4 h-4" />
                  Đăng nhập
                </Link>
              </div>
            ) : (
              // Ở mobile: UserMenu ở footer, dropdown mở LÊN và HIỂN THỊ TÊN
              <div className="mt-auto px-0 border-t border-gray-100 ">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative pl-2.5 pr-1.5 py-3 gap-3"
                >
                  <UserMenu placement="up" showNameOnMobile />
                </motion.div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

/* =================== Header Wrapper =================== */
const HeaderComponent: React.FC<HeaderProps> = ({ variant = "site" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { accessToken } = useSelector(selectAuth);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    if (variant === "site") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  // Tự đóng menu khi vượt md (fix case tắt F12)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches =
        "matches" in e ? e.matches : (e as MediaQueryList).matches;
      if (matches) setIsMobileNavOpen(false);
    };
    onChange(mq);
    if (mq.addEventListener) mq.addEventListener("change", onChange as any);
    else mq.addListener(onChange as any);
    return () => {
      if (mq.removeEventListener)
        mq.removeEventListener("change", onChange as any);
      else mq.removeListener(onChange as any);
    };
  }, []);

  // Đóng menu khi đổi route (back/forward)
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  if (variant === "auth") {
    return (
      <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1
              className="text-xl font-bold text-[#23AEB1]"
              style={{ fontFamily: "Fredoka One" }}
            >
              Get Sport!
            </h1>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-[#23AEB1] hover:bg-[#23AEB1]/5 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Quay lại</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100"
        }`}
      >
        <div className="w-full px-8 py-2 flex items-center justify-between">
          <Brand />
          <div className="ml-18">
            <SiteNav />
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {accessToken ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to={endPoint.REGISTER}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#23AEB1] text-[#23AEB1] text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#23AEB1]/10 hover:scale-105"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
                <Link
                  to={endPoint.LOGIN}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#23AEB1] to-[#1e9ea1] text-white text-sm font-medium shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:from-[#1e9ea1] hover:to-[#23AEB1]"
                >
                  <User className="w-4 h-4" />
                  Đăng nhập
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};

const Header = memo(HeaderComponent);
export default Header;
