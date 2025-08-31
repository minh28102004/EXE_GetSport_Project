import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Award,
  Phone,
  Mail,
  Shield,
  Zap,
} from "lucide-react";
import { courtImageList, packages, stats } from "./data";

const BannerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [current, setCurrent] = useState(0);
  const [currentPackage, setCurrentPackage] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [translateZ, setTranslateZ] = useState<number>(0);
  

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % courtImageList.length);
  };

  const nextPackage = () => {
    setCurrentPackage((prev) => (prev + 1) % 3);
  };

  const prevPackage = () => {
    setCurrentPackage((prev) => (prev - 1 + 3) % 3);
  };

  // Auto slide sau 5 giây
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto slide packages
  useEffect(() => {
    const interval = setInterval(nextPackage, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        const n = packages.length;
        setTranslateZ(width / (2 * Math.tan(Math.PI / n)));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [packages.length]);

  return (
    <div className="">
      {/* Hero Background Banner - Improved */}
      <div className="absolute inset-0 h-screen">
        <div className="relative h-screen w-full">
          {/* Background image with better quality */}
          <div className="absolute w-full h-full">
            <img
              src={courtImageList[current]}
              alt={`Badminton Court ${current + 1}`}
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform"
              style={{
                filter: "brightness(1.1) contrast(1.1) saturate(1.2)",
                imageRendering: "crisp-edges",
              }}
            />
          </div>

          {/* Enhanced overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/85 to-teal-50/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent"></div>

          {/* Improved indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            {courtImageList.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative transition-all duration-300 ${
                  i === current ? "w-12 h-4" : "w-4 h-4 hover:w-6"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/50"
                      : "bg-white/60 hover:bg-white/80 shadow-md"
                  }`}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative mt-19 sm:pb-18 pb-0 z-10">
        <div className=" mx-auto  sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.70fr_1.30fr] gap-4 items-center">
            {/* Clean White Content Card */}
            <div
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-12 opacity-0"
              }`}
            >
              {/* Clean White Card Design */}
              <div className="relative mx-auto w-full max-w-[90vw] sm:max-w-4xl">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-10 transform -rotate-1 hover:rotate-0 transition-transform duration-500 border border-gray-100">
                  {/* Premium badge */}
                  <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-100 to-teal-50 rounded-full text-teal-700 text-sm sm:text-base font-medium mb-6 sm:mb-8 shadow-md">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current text-teal-500" />
                    Ứng dụng đặt sân #1 Việt Nam 🏆
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                    Đặt Sân Cầu Lông
                    <span className="block text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                      Chỉ Trong 30 Giây
                    </span>
                  </h1>

                  {/* Clean description */}
                  <div className="flex flex-wrap items-baseline">
                    <span className="text-lg sm:text-2xl text-gray-600 leading-relaxed font-medium">
                      Hệ thống đặt sân thông minh với{" "}
                      <span className="text-teal-600 font-semibold">
                        AI tiên tiến
                      </span>
                      , giúp bạn tìm và đặt sân cầu lông phù hợp nhất...
                    </span>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 ml-auto sm:pb-2 sm:pt-1 py-3">
                      <span className="inline-flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-600" /> Bảo mật
                        SSL
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" /> Thanh
                        toán an toàn
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />{" "}
                        4.9/5 đánh giá
                      </span>
                    </div>
                  </div>

                  {/* Clean CTA Buttons */}
                  <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <button className="group w-1/2 sm:w-auto px-2 py-2 sm:px-6 sm:py-3 text-xs sm:text-lg bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl font-bold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/25 relative">
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        Đặt Sân Ngay
                        <ArrowRight className="w-4 sm:w-6 h-4 sm:h-6 transform group-hover:translate-x-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button className="group w-1/2 sm:w-auto px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-lg border-2 border-teal-200 text-teal-700 rounded-xl sm:rounded-2xl font-bold hover:bg-teal-50 transition-all duration-300 flex items-center justify-center hover:border-teal-300">
                      <Search className="mr-1 sm:mr-3 w-4 sm:w-6 h-4 sm:h-6" />
                      Tìm hiểu thêm
                    </button>
                  </div>

                  {/* Clean Quick Stats */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className={`text-center transform transition-all duration-700 ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                        style={{ transitionDelay: `${index * 200 + 600}ms` }}
                      >
                        <stat.icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto text-teal-600 mb-1 sm:mb-2`}
                        />
                        <div className="text-lg sm:text-2xl font-bold text-gray-900">
                          {stat.number}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Premium Packages Slider */}
            <div
              className={`relative transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-12 opacity-0"
              }`}
            >
              {/* Enhanced Section Header */}
              <div className="text-center relative z-20 sm:mt-[-17px] mt-[110px] mb-5">
                {/* Badge */}
                <div
                  className="inline-flex items-center px-6 sm:py-1 py-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 
                  rounded-full border border-violet-300/50 shadow-md backdrop-blur-md"
                >
                  <Award className="w-5 h-5 mr-2 text-violet-600 animate-pulse" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 font-semibold  tracking-wide">
                    PREMIUM PACKAGE
                  </span>
                </div>
              </div>

              {/* 3D Triangle Container - FIXED ALIGNMENT */}
              <div className="relative w-full flex justify-center">
                <div
                  className=" w-84 sm:w-96 h-[550px]"
                  style={{
                    perspective: "2000px",
                    perspectiveOrigin: "center center",
                  }}
                >
                  {/* Rotating Triangle Container */}
                  <div
                    ref={cardRef}
                    className="relative w-full h-full"
                    style={{
                      transform: `rotateY(${
                        -currentPackage * (360 / packages.length)
                      }deg)`,
                      transformStyle: "preserve-3d",
                      transition: "transform 1s cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    {packages.map((pkg, index) => {
                      const angle = index * 120;
                      const isActive = index === currentPackage;

                      return (
                        <div
                          key={pkg.id}
                          className={`absolute w-full h-full transition-all duration-700 ${
                            isActive
                              ? "z-40 opacity-100 scale-90"
                              : "z-10 opacity-30 scale-80"
                          }`}
                          style={{
                            transform: `rotateY(${angle}deg) translateZ(250px)`,
                            transformStyle: "preserve-3d",
                          }}
                        >
                          {/* Premium Badge */}
                          {pkg.badge && (
                            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-50">
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-6 py-2 rounded-full font-bold shadow-lg">
                                {pkg.badge}
                              </div>
                            </div>
                          )}
                          {/* Enhanced Premium Card */}
                          <div
                            className={`relative w-full h-full rounded-3xl overflow-hidden transition-all duration-700 scale-95 ${
                              isActive
                                ? "sm:opacity-100  shadow-2xl"
                                : "sm:opacity-90  shadow-xl"
                            }`}
                            style={{
                              background: pkg.gradient
                                ? "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)"
                                : pkg.isVip
                                ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)"
                                : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
                              boxShadow: isActive
                                ? `0 25px 60px -12px ${
                                    pkg.gradient
                                      ? "rgba(6, 182, 212, 0.4)"
                                      : pkg.isVip
                                      ? "rgba(245, 158, 11, 0.4)"
                                      : "rgba(0, 0, 0, 0.25)"
                                  }`
                                : "0 15px 40px -10px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            {/* Glassmorphism Overlay */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20" />

                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div
                                className={`absolute inset-0 ${
                                  pkg.gradient
                                    ? "bg-gradient-to-br from-cyan-300 via-teal-400 to-blue-400"
                                    : pkg.isVip
                                    ? "bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-400"
                                    : "bg-gradient-to-br from-slate-300 via-gray-300 to-zinc-400"
                                } animate-pulse`}
                                style={{ animationDuration: "4s" }}
                              />
                            </div>

                            {/* Card Content */}
                            <div className="relative z-10 p-8 h-full flex flex-col">
                              {/* VIP Crown Icon */}
                              {pkg.isVip && (
                                <div className="absolute -top-4 -right-4">
                                  <div className="relative">
                                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-2xl shadow-xl rotate-12 hover:rotate-0 transition-transform duration-300">
                                      <Award className="w-6 h-6 text-amber-900" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-2xl animate-pulse opacity-50" />
                                  </div>
                                </div>
                              )}

                              {/* Header Section */}
                              <div className="text-center mb-3">
                                <h3
                                  className={`text-xl md:text-2xl font-bold mb-1 ${
                                    pkg.gradient
                                      ? "text-white drop-shadow-lg"
                                      : pkg.isVip
                                      ? "text-amber-900"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {pkg.name}
                                </h3>
                                <p
                                  className={`text-sm md:text-base font-medium ${
                                    pkg.gradient
                                      ? "text-cyan-100"
                                      : pkg.isVip
                                      ? "text-amber-700"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {pkg.subtitle}
                                </p>
                              </div>

                              {/* Premium Price Display */}
                              <div className="text-center mb-6 relative">
                                <div
                                  className={`text-3xl md:text-4xl font-extrabold mb-2 ${
                                    pkg.gradient
                                      ? "text-white drop-shadow-xl"
                                      : pkg.isVip
                                      ? "text-amber-900"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {pkg.price}
                                </div>

                                <div className="relative">
                                  <span
                                    className={`text-sm md:text-base line-through ${
                                      pkg.gradient
                                        ? "text-cyan-200"
                                        : pkg.isVip
                                        ? "text-amber-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {pkg.originalPrice}
                                  </span>

                                  <div
                                    className={`inline-block ml-2 px-3 py-1 rounded-xl text-xs md:text-sm font-bold shadow-md ${
                                      pkg.gradient
                                        ? "bg-white/20 text-white backdrop-blur-sm border border-white/30"
                                        : pkg.isVip
                                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                                        : "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                                    }`}
                                  >
                                    🔥 -{pkg.discount}
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Features List */}
                              <div className="space-y-2 mb-4 flex-grow">
                                {pkg.features.map((feature, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                                      pkg.gradient
                                        ? "bg-white/10 backdrop-blur-sm border border-white/20"
                                        : pkg.isVip
                                        ? "bg-amber-50/80 border border-amber-200/50"
                                        : "bg-white/80 border border-gray-200/50 shadow-sm"
                                    }`}
                                  >
                                    <div
                                      className={`p-1 rounded-lg mr-4 ${
                                        pkg.gradient
                                          ? "bg-white/20"
                                          : pkg.isVip
                                          ? "bg-amber-200"
                                          : "bg-green-100"
                                      }`}
                                    >
                                      <CheckCircle
                                        className={`w-5 h-5 ${
                                          pkg.gradient
                                            ? "text-white"
                                            : pkg.isVip
                                            ? "text-amber-700"
                                            : "text-green-600"
                                        }`}
                                      />
                                    </div>
                                    <span
                                      className={`font-medium ${
                                        pkg.gradient
                                          ? "text-white"
                                          : pkg.isVip
                                          ? "text-amber-900"
                                          : "text-gray-800"
                                      }`}
                                    >
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Enhanced CTA Button */}
                              <button
                                className={`group relative w-full py-2.5 rounded-xl font-semibold text-base overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                                  pkg.gradient
                                    ? "bg-white text-teal-700 hover:bg-cyan-50"
                                    : pkg.isVip
                                    ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700"
                                    : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
                                }`}
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  Chọn Gói Này
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              </button>
                            </div>
                          </div>
                          {isActive && (
                            <>
                              <button
                                onClick={prevPackage}
                                className={`absolute -left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300
        ${
          pkg.gradient
            ? "bg-white/20 backdrop-blur-sm"
            : pkg.isVip
            ? "bg-amber-100/30 backdrop-blur-sm"
            : "bg-gray-200/30 backdrop-blur-sm"
        } hover:scale-110 hover:brightness-110 z-50 border ${
                                  pkg.gradient
                                    ? "border-white/40"
                                    : pkg.isVip
                                    ? "border-amber-300/50"
                                    : "border-gray-300/50"
                                }`}
                              >
                                <ChevronLeft
                                  className={`w-5 h-5 ${
                                    pkg.gradient
                                      ? "text-white"
                                      : pkg.isVip
                                      ? "text-amber-900"
                                      : "text-gray-700"
                                  }`}
                                />
                              </button>

                              <button
                                onClick={nextPackage}
                                className={`absolute -right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300
        ${
          pkg.gradient
            ? "bg-white/20 backdrop-blur-sm"
            : pkg.isVip
            ? "bg-amber-100/30 backdrop-blur-sm"
            : "bg-gray-200/30 backdrop-blur-sm"
        } hover:scale-110 hover:brightness-110 z-50 border ${
                                  pkg.gradient
                                    ? "border-white/40"
                                    : pkg.isVip
                                    ? "border-amber-300/50"
                                    : "border-gray-300/50"
                                }`}
                              >
                                <ChevronRight
                                  className={`w-5 h-5 ${
                                    pkg.gradient
                                      ? "text-white"
                                      : pkg.isVip
                                      ? "text-amber-900"
                                      : "text-gray-700"
                                  }`}
                                />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-teal-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/50 to-teal-200/50 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </section>
    </div>
  );
};

export default BannerSection;
