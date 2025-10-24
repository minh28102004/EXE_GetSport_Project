import React, { memo } from "react";
import { SiGoogleplay, SiAppstore, SiVisa, SiPaypal } from "react-icons/si";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  CreditCard,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#2E2B2B] text-gray-300">
      {/* Top section */}
      <div className="w-full px-4 sm:px-10 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Cột 1 */}
        <div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white leading-[1.15]  overflow-visible"
            style={{ fontFamily: '"Fredoka One", sans-serif' }}
          >
            Get <span className="text-[#23AEB1]">Sport!</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
            Hệ thống đặt sân cầu lông hiện đại, tiện lợi và dễ sử dụng nhất Việt
            Nam.
          </p>
          <div className="mt-4 flex items-center gap-2 sm:gap-3">
            {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-[#23AEB1]/20 transition"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2 */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Liên Kết Nhanh
          </h4>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-2 sm:gap-y-3 gap-x-4 sm:gap-x-6 text-sm sm:text-base">
            {[
              "Trang Chủ",
              "Đặt Sân",
              "Giới Thiệu",
              "Liên Hệ",
              "Điều Khoản Sử Dụng",
              "Chính Sách Bảo Mật",
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="relative inline-flex items-center text-gray-400 hover:text-[#23AEB1] transition-colors
                             after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 
                             after:bg-[#23AEB1] after:transition-all after:duration-300
                             hover:after:w-full"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Dịch Vụ
          </h4>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-2 sm:gap-y-3 gap-x-4 sm:gap-x-6 text-sm sm:text-base">
            {[
              "Đặt Sân Cầu Lông",
              "Thuê HLV Cá Nhân",
              "Tổ Chức Giải Đấu",
              "Mua Sắm Dụng Cụ",
              "Tìm Đối Thủ",
              "Câu Lạc Bộ",
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="relative inline-flex items-center text-gray-400 hover:text-[#23AEB1] transition-colors
                             after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 
                             after:bg-[#23AEB1] after:transition-all after:duration-300
                             hover:after:w-full"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-3">
            Tải Ứng Dụng
          </h4>
          <p className="text-sm sm:text-base text-gray-400 mb-3">
            Tải ứng dụng để có trải nghiệm tốt nhất khi đặt sân cầu lông.
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <a
              href="#"
              className="flex items-center justify-center gap-2 bg-[#23AEB1] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:opacity-90"
            >
              <SiAppstore size={20} className="sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">
                Tải về trên <span className="font-bold">App Store</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-2 bg-[#23AEB1] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:opacity-90"
            >
              <SiGoogleplay size={20} className="sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">
                Tải về trên <span className="font-bold">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full px-4 sm:px-10 py-3 flex flex-col md:flex-row items-center justify-between border-t border-white/10 text-xs sm:text-sm text-gray-300">
        <p className="text-center md:text-left">
          © 2025 GetSport. Tất cả quyền được bảo lưu.
        </p>
        <div className="flex items-center gap-3 sm:gap-4 md:ml-auto mt-2 md:mt-0">
          <SiVisa className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white cursor-pointer" />
          <SiPaypal className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white cursor-pointer" />
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
