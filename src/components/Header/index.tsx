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
} from "framer-motion";

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

  const PILL_SPRING = {
    type: "spring",
    stiffness: 140,
    damping: 24,
    mass: 1.05,
  };

  // Active: "/" chỉ khi pathname === "/"
  const activeIndex = useMemo(() => {
    const path = location.pathname;
    const idx = navItems.findIndex((n) => {
      if (!n.to) return false;
      if (n.to === "/") return path === "/";
      return path === n.to || path.startsWith(n.to + "/");
    });
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // indicator motion values (đo cả x,y,w,h để khớp tuyệt đối)
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

  // set vị trí ban đầu theo activeIndex
  useLayoutEffect(() => {
    const { tx, ty, tw, th } = measure(activeIndex);
    x.set(tx);
    y.set(ty);
    w.set(tw);
    h.set(th);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // chờ animate xong rồi mới navigate (để thấy pill chạy)
  const [pending, setPending] = useState<{ index: number; to: string } | null>(
    null
  );
  const displayIndex = pending?.index ?? activeIndex;

  // khi route đã đổi xong => clear pending
  useEffect(() => {
    if (pending && activeIndex === pending.index) setPending(null);
  }, [activeIndex, pending]);

  // resize => re-measure tức thì (không animate)
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

  // nếu route đổi do back/forward: nhảy thẳng (không animate)
  useLayoutEffect(() => {
    if (pending) return;
    const { tx, ty, tw, th } = measure(activeIndex);
    x.set(tx);
    y.set(ty);
    w.set(tw);
    h.set(th);
  }, [activeIndex, pending, x, y, w, h]);

  // options tối thiểu
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
    if (index === activeIndex) return; // đã ở đúng trang
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
      {/* Indicator bám đúng khung item (x,y,w,h) */}
      <motion.span
        className="
    absolute top-0 left-0  // quan trọng: neo gốc (0,0) của container
    rounded-lg bg-teal-50 ring-1 ring-[#23AEB1]/30 shadow-sm
    pointer-events-none
  "
        style={{ x, y, width: w, height: h }}
      />

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

            {/* Hover underline (nhẹ, chỉ khi chưa active) */}
            {!isActive && (
              <span
                className="absolute bottom-0 left-1/2 w-0 h-[1.5px] 
          bg-[#23AEB1] group-hover:w-full group-hover:left-0 
          transition-all duration-500 ease-out
          rounded-b-lg"
              />
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
}) => (
  <div
    className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
  >
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />

    <div
      className={`absolute right-0 top-0 h-full w-75 bg-white shadow-2xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Brand />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="p-3 space-y-2">
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
                `block ${isActive ? "text-[#23AEB1] bg-[#23AEB1]/10" : ""}`
              }
            >
              {content}
            </NavLink>
          ) : (
            <a
              key={index}
              href={item.href}
              onClick={onClose}
              className="block cursor-pointer"
            >
              {content}
            </a>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <Link
          to="/"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
               border-2 border-[#23AEB1] text-[#23AEB1] font-medium 
               transition-all duration-300 ease-in-out
               hover:bg-[#23AEB1]/10 hover:shadow-md hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" />
          Đăng ký
        </Link>

        <Link
          to="/"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
               bg-gradient-to-r from-[#23AEB1] via-[#20a4a6] to-[#1e9ea1] 
               text-white font-medium shadow-md
               transition-all duration-500 ease-in-out
               hover:shadow-xl hover:scale-[1.05] 
               hover:from-[#1e9ea1] hover:via-[#20a4a6] hover:to-[#23AEB1]"
        >
          <User className="w-4 h-4" />
          Đăng nhập
        </Link>
      </div>
    </div>
  </div>
);

/* =================== Header Wrapper =================== */
const HeaderComponent: React.FC<HeaderProps> = ({ variant = "site" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    if (variant === "site") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

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
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={endPoint.REGISTER}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#23AEB1] 
               text-[#23AEB1] text-sm font-medium 
               transition-all duration-300 ease-in-out
               hover:bg-[#23AEB1]/10 hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </Link>

            <Link
              to={endPoint.LOGIN}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl 
               bg-gradient-to-r from-[#23AEB1] to-[#1e9ea1] 
               text-white text-sm font-medium shadow-md 
               transition-all duration-300 ease-in-out
               hover:shadow-lg hover:scale-105 hover:from-[#1e9ea1] hover:to-[#23AEB1]"
            >
              <User className="w-4 h-4" />
              Đăng nhập
            </Link>
          </div>

          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
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
