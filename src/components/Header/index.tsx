import React, { memo, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  HelpCircle,
  Phone,
  ArrowLeft,
  Menu,
  X,
  User,
  UserPlus,
  ChevronDown,
  MapPin,
  Newspaper,
} from "lucide-react";
import endPoint from "@routes/router.js";

interface HeaderProps {
  variant?: "site" | "auth";
}

interface NavItem {
  label: string;
  href?: string;
  to?: string;
  icon: React.ComponentType<any>;
  hasDropdown?: boolean;
}

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

const navItems: NavItem[] = [
  { label: "Trang chủ", to: endPoint.HOMEPAGE, icon: Home },
  { label: "Giới thiệu", to: endPoint.ABOUT, icon: HelpCircle },
  { label: "Bài viết", to: endPoint.BLOGPOST, icon: Newspaper },
  { label: "Đặt sân", to: endPoint.BOOKING, icon: Calendar },
  { label: "Địa điểm sân", to: endPoint.LOCATIONS, icon: MapPin },
  { label: "Liên hệ", to: endPoint.CONTACT, icon: Phone },
];


const SiteNav: React.FC = () => (
  <nav className="hidden lg:flex items-center gap-1">
    {navItems.map((item, index) => {
      const content = (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-600 font-medium transition-all duration-200 hover:text-[#23AEB1]  hover:bg-[#23AEB1]/5 group">
          <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>{item.label}</span>
          {item.hasDropdown && (
            <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
          )}
        </div>
      );

      if (item.to) {
        return (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `${
                isActive
                  ? "text-[#23AEB1] bg-[#23AEB1]/10 font-semibold rounded-md"
                  : ""
              }`
            }
          >
            {content}
          </NavLink>
        );
      }

      return (
        <a key={index} href={item.href} className="cursor-pointer">
          {content}
        </a>
      );
    })}
  </nav>
);

const MobileNav: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => (
  <div
    className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Sidebar */}
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

          if (item.to) {
            return (
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
            );
          }

          return (
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
        {/* Nút Đăng ký */}
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

        {/* Nút Đăng nhập */}
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

const HeaderComponent: React.FC<HeaderProps> = ({ variant = "site" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

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
        <div className="w-full px-8 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Brand />

          {/* Desktop Navigation */}
          <div className="ml-18">
            <SiteNav />
          </div>
          <div className="hidden md:flex items-center gap-3">
            {/* Nút Đăng ký */}
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

            {/* Nút Đăng nhập */}
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
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="lg:hidden p-1.5 rounded-lg  hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};

const Header = memo(HeaderComponent);
export default Header;
