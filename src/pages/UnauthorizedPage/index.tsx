import React, { useEffect, useState } from "react";
import { ShieldAlert, ArrowLeft, Home, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import endPoint from "@routes/router";

const AccessDeniedPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setIsVisible(true), []);

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate(endPoint.HOMEPAGE, { replace: true });

  return (
    <div className="h-[100svh] w-full bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 grid place-items-center relative overflow-hidden">
      {/* Animated Background Elements (giảm kích thước + ẩn bớt ở mobile) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-6 w-40 h-40 sm:w-56 sm:h-56 bg-teal-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-28 right-6 w-40 h-40 sm:w-56 sm:h-56 bg-cyan-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-40 h-40 sm:w-56 sm:h-56 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000" />

        {/* Shuttlecock Pattern (ẩn ở mobile) */}
        <div className="hidden sm:block absolute top-1/4 right-1/4 opacity-10">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="animate-spin-slow"
          >
            <path
              d="M60 20 L40 60 L60 100 L80 60 Z"
              fill="currentColor"
              className="text-teal-600"
            />
            <circle
              cx="60"
              cy="60"
              r="8"
              fill="currentColor"
              className="text-teal-800"
            />
          </svg>
        </div>
        <div className="hidden sm:block absolute bottom-1/4 left-1/4 opacity-10">
          <svg
            width="100"
            height="100"
            viewBox="0 0 120 120"
            className="animate-spin-slow animation-delay-3000"
          >
            <path
              d="M60 20 L40 60 L60 100 L80 60 Z"
              fill="currentColor"
              className="text-cyan-600"
            />
            <circle
              cx="60"
              cy="60"
              r="8"
              fill="currentColor"
              className="text-cyan-800"
            />
          </svg>
        </div>
      </div>

      {/* Card (gọn kích thước, responsive) */}
      <div
        className={`relative z-10 w-full max-w-[620px] px-4 sm:px-6 transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Top Bar */}
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600" />

          <div className="p-6 sm:p-8">
            {/* Animated Icon (thu nhỏ trên mobile) */}
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl animate-pulse-slow opacity-20 blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 sm:hover:scale-110 hover:rotate-2 transition-all duration-500 animate-float">
                <ShieldAlert
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white drop-shadow-lg"
                  strokeWidth={2.5}
                />
                <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
              </div>
            </div>

            {/* Title & Description (giảm padding/font ở mobile) */}
            <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold  ">
                Truy Cập Bị Từ Chối
              </h2>
              <div className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 bg-red-50 border border-red-200 rounded-full">
                <p className="text-xs sm:text-sm font-medium text-red-600">
                  403 - Access Denied
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-md mx-auto">
                Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản
                trị viên hoặc kiểm tra lại quyền truy cập của bạn.
              </p>
            </div>

            {/* Info Box (gọn lại) */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-teal-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                    Lưu ý quan trọng
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Để tiếp tục, hãy quay lại trang trước hoặc về trang chủ của
                    hệ thống.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons (xếp hàng dọc ở mobile) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGoBack}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Quay lại
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Home className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Về trang chủ</span>
              </button>
            </div>
          </div>

          {/* Decorative Bottom Pattern (rất mỏng, không chiếm chỗ) */}
          <div className="h-8 sm:h-10 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 relative overflow-hidden">
            {/* Copyright ở cuối màn hình */}
            <div className="absolute bottom-3 left-0 right-0 text-center text-[11px] sm:text-xs text-gray-500">
              © 2025 GetSport. Tất cả các quyền được bảo lưu
            </div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                </div>
          </div>
        </div>

        {/* Support + Copyright (nằm trong viewport, không gây scroll) */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Cần hỗ trợ?{" "}
            <button className="text-teal-600 hover:brightness-75 font-medium hover:underline ">
              Liên hệ hỗ trợ
            </button>
          </p>
        </div>
      </div>

      <style>{`
      
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(16px, -16px) scale(1.06); }
          50% { transform: translate(-16px, 16px) scale(0.94); }
          75% { transform: translate(12px, 12px) scale(1.03); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.04); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.9s ease-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default AccessDeniedPage;
