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
      <div className="w-full px-10 py-8 pt-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Cột 1 */}
        <div>
          <h3 className="text-2xl font-extrabold text-white">
            Get <span className="text-[#23AEB1]">Sport!</span>
          </h3>
          <p className="mt-4 text-md text-gray-400 leading-relaxed">
            Hệ thống đặt sân cầu lông hiện đại, tiện lợi và dễ sử dụng nhất Việt
            Nam.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-[#23AEB1]/20 transition"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2 */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Liên Kết Nhanh
          </h4>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-3 gap-x-6">
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
          <h4 className="text-lg font-semibold text-white mb-4">Dịch Vụ</h4>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-3 gap-x-6">
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
          <h4 className="text-lg font-semibold text-white mb-4">
            Tải Ứng Dụng
          </h4>
          <p className="text-md text-gray-400 mb-4">
            Tải ứng dụng để có trải nghiệm tốt nhất khi đặt sân cầu lông.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="flex items-center justify-center gap-2 bg-[#23AEB1] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <SiAppstore size={22} />
              <span className="text-base">
                Tải về trên <span className="font-bold text-lg">App Store</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-2 bg-[#23AEB1] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <SiGoogleplay size={22} />
              <span className="text-base">
                Tải về trên{" "}
                <span className="font-bold text-lg">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full px-9 py-3 flex flex-col md:flex-row items-center justify-between border-t border-white/10 text-sm text-gray-300">
        {/* Trademark */}
        <p className="text-center flex-1 ml-20">
          © 2025 GetSport. Tất cả quyền được bảo lưu.
        </p>

        {/* Các icon thanh toán */}
        <div className="flex items-center gap-5 md:ml-auto mt-3 md:mt-0">
          <SiVisa className="w-6 h-6 hover:text-white cursor-pointer" />
          <SiPaypal className="w-6 h-6 hover:text-white cursor-pointer" />
          <CreditCard className="w-6 h-6 hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
