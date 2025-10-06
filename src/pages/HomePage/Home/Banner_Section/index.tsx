import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Sun,
  Search,
  Shield,
  CheckCircle,
  MapPin,
} from "lucide-react";
import endPoint from "@routes/router";
import { courtImageList, stats } from "./data";
import { useNavigate } from "react-router-dom";

/**
 * ✅ Goals
 * - Keep desktop layout exactly as-is
 * - Make mobile feel polished: spacing, alignment, safe-area, thumb targets
 * - Pause autoplay on hover & when user prefers reduced motion
 * - No entrance animations
 */
const BannerSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPRM] = useState(false);
  const autoplayMs = 5000;
  const navigate = useNavigate();

  // Coachmark state for mobile weather pill (hover/tap)
  const [showCoach, setShowCoach] = useState(false);
  const pillRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!pillRef.current) return;
      if (!pillRef.current.contains(e.target as Node)) setShowCoach(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCoach(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Weather data (mock)
  const weather = {
    temp: "28°C",
    humidity: "75%",
    location: "Hà Nội, Việt Nam",
    date: new Date().toLocaleDateString("vi-VN"),
  };

  // --- Autoplay with requestAnimationFrame (stutter-free & PRM aware) ---
  const rafId = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPRM(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (courtImageList.length <= 1) return; // nothing to autoplay

    const loop = (now: number) => {
      // Start baseline
      if (!startRef.current) startRef.current = now;

      // Pause when hover or PRM
      if (isHover || prefersReducedMotion) {
        startRef.current = now - (progress / 100) * autoplayMs;
      } else {
        const pct = Math.min(
          100,
          ((now - startRef.current) / autoplayMs) * 100
        );
        setProgress(pct);
        if (pct >= 100) {
          setCurrentIndex((p) => (p + 1) % courtImageList.length);
          setProgress(0);
          startRef.current = now;
        }
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      startRef.current = 0;
    };
  }, [isHover, prefersReducedMotion, autoplayMs]);

  const goTo = (i: number) => {
    setCurrentIndex((i + courtImageList.length) % courtImageList.length);
    setProgress(0);
    startRef.current = 0; // reset cycle so progress restarts smoothly
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  return (
    <section
      className={
        // Use 100svh to avoid browser URL bar jump on mobile
        "relative w-full min-h-[100svh] sm:min-h-[93vh] sm:h-[93vh] overflow-visible sm:overflow-hidden"
      }
    >
      {/* Background Image Slider */}
      <div
        className="absolute inset-0"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {courtImageList.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== currentIndex}
          >
            <img
              src={img}
              alt={`Sân ${i + 1}`}
              className="w-full h-full object-cover"
              decoding="async"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-start sm:items-center pt-[calc(theme(spacing.16)+env(safe-area-inset-top,0px))] pb-12 sm:pb-0 sm:pt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="max-w-4xl sm:max-w-3xl lg:max-w-4xl text-center sm:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-teal-50 to-teal-50 rounded-full text-teal-700 text-xs sm:text-sm font-medium mb-4 sm:mb-4 shadow-md">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 fill-current text-teal-500" />
              Nền tảng đặt sân #1 Việt Nam 🏆
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-4">
              Đặt Sân Cầu Lông Dễ Dàng,
              <span className="block mt-1.5 sm:mt-2 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Nhanh Chóng
              </span>
            </h1>

            {/* Description */}
            <p className="text-base xs:text-lg sm:text-xl text-gray-200 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto sm:mx-0">
              Hệ thống đặt sân hiện đại tích hợp AI giúp bạn tìm và đặt sân cầu
              lông một cách thuận tiện. Tiết kiệm thời gian và tận hưởng trải
              nghiệm chơi thể thao...
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <button
                type="button"
                className="group w-full sm:w-auto min-h-12 px-4 py-3 sm:px-6 sm:py-2.5 text-sm sm:text-lg bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-100 relative"
                onClick={() => navigate(endPoint.COURTBOOKING)}
              >
                <span className="relative z-10 flex items-center justify-center gap-1">
                  Đặt Sân Ngay{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <button
                type="button"
                className="group w-full sm:w-auto min-h-12 px-4 py-3 sm:px-4 sm:py-2.5 text-sm sm:text-lg bg-white text-teal-700 rounded-2xl font-bold hover:bg-teal-50 hover:scale-[1.03] active:scale-100 transition-all flex items-center justify-center"
                onClick={() => navigate(endPoint.ABOUT)}
              >
                <Search className="mr-2 w-5 h-5" /> Tìm hiểu thêm
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {stats.map((item, idx) => {
                const Icon = item.icon as React.ElementType;
                return (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-xs sm:text-sm text-gray-300">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {item.number}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges – Mobile inline */}
      <div className="sm:hidden mt-3 flex justify-center gap-3 text-xs text-white/90">
        <span className="inline-flex items-center gap-1">
          <Shield className="w-4 h-4 text-green-400" /> Bảo mật SSL
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-400" /> Thanh toán an toàn
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" /> 4.9/5
        </span>
      </div>

      {/* Weather – Desktop Card */}
      <div className="hidden sm:block absolute top-6 right-6 z-20">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100 min-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-800">
              Thời Tiết Hôm Nay
            </h3>
            <Sun className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex items-start justify-between">
            <div className="text-3xl font-semibold text-slate-800">
              {weather.temp}
            </div>
            <div className="flex flex-col items-end text-xs text-slate-600 gap-1 relative top-1.5">
              <div>
                Độ ẩm: <span className="font-medium">{weather.humidity}</span>
              </div>
              <div>{weather.date}</div>
            </div>
          </div>
          <div className="mt-1.5 text-sm text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-500" /> {weather.location}
          </div>
        </div>
      </div>

      {/* Weather – Mobile pill (compact, out of the way) */}
      <div className="sm:hidden absolute top-3 left-3 z-30">
        <div
          ref={pillRef}
          className="relative"
          onMouseEnter={() => setShowCoach(true)}
          onMouseLeave={() => setShowCoach(false)}
          onClick={(e) => {
            e.stopPropagation();
            setShowCoach((s) => !s);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowCoach((s) => !s);
            }
          }}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-expanded={showCoach}
          aria-label="Xem chi tiết thời tiết"
        >
          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[13px] shadow border border-white/60 flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-slate-800">{weather.temp}</span>
            <span className="text-slate-700">• {weather.humidity}</span>
          </div>

          {showCoach && (
            <div className="absolute left-0 mt-2 w-[260px] rounded-2xl bg-white shadow-xl border border-gray-200 p-3">
              <div className="absolute left-6 -top-2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200" />
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">
                  Thời tiết hôm nay
                </div>
                <Sun className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[13px] text-slate-700">
                <div>Địa điểm</div>
                <div className="text-right font-medium">{weather.location}</div>
                <div>Ngày</div>
                <div className="text-right">{weather.date}</div>
                <div>Nhiệt độ</div>
                <div className="text-right font-medium">{weather.temp}</div>
                <div>Độ ẩm</div>
                <div className="text-right">{weather.humidity}</div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Chạm ra ngoài để đóng
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges – Desktop */}
      <div className="hidden sm:flex absolute z-20 flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-200 left-20 bottom-6">
        <span className="inline-flex items-center gap-1">
          <Shield className="w-4 h-4 text-green-400" /> Bảo mật SSL
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-400" /> Thanh toán an toàn
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" /> 4.9/5 đánh
          giá
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-20 flex items-center gap-4">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {courtImageList.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/70 ${
                i === currentIndex
                  ? "w-8 bg-white shadow-lg"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="p-3 sm:p-3.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="p-3 sm:p-3.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-100"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Removed custom animations */}
    </section>
  );
};

export default BannerSection;
