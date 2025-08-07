import React, { useState } from "react";
import {
  ShieldCheck,
  UserCircle,
  CreditCard,
  Users,
  Building2,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { useImageZoom } from "@hooks/useImageZoom";

// Load ảnh bằng import.meta.glob (Vite only)
const paymentImages = import.meta.glob("../../images/Payment_Images/*.png", {
  eager: true,
  import: "default",
});
const courtImages = import.meta.glob(
  "../../images/BadmintonCourt_Images/*.jpg",
  {
    eager: true,
    import: "default",
  }
);

// Chuyển về mảng và đảm bảo kiểu string[]
const paymentImageList = Object.values(paymentImages).slice(0, 4) as string[];
const courtImageList = Object.values(courtImages).slice(0, 3) as string[];

// Tiêu đề từng mục
const SectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <h2 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
    <Icon className="w-6 h-6 mr-2 text-blue-500" />
    {title}
  </h2>
);

// Component hiển thị ảnh với hiệu ứng zoom, điều chỉnh số cột theo props
const ImageGallery = ({
  images,
  columns = 3,
  onImageClick,
}: {
  images: string[];
  columns?: 2 | 3 | 4;
  onImageClick?: (src: string) => void;
}) => {
  const columnClass =
    columns === 4
      ? "md:grid-cols-4"
      : columns === 3
      ? "md:grid-cols-3"
      : "md:grid-cols-2";

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${columnClass} gap-6 mt-6`}
    >
      {images.map((imgSrc, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden shadow-md group transition-all duration-300 group-hover:shadow-xl cursor-pointer"
          onClick={() => onImageClick?.(imgSrc)}
        >
          <img
            src={imgSrc}
            alt={`Hình minh họa ${index + 1}`}
            className="object-cover w-full h-48 transform group-hover:scale-105 transition duration-300 ease-in-out"
          />
          <p className="text-sm text-gray-500 text-center mt-2">
            Hình minh họa {index + 1}
          </p>
        </div>
      ))}
    </div>
  );
};

const TermsOfServicePage: React.FC = () => {
  // Zoom image
  const { openZoom, ZoomOverlay } = useImageZoom();

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-6 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Điều Khoản Dịch Vụ</h1>
        <p className="text-lg mt-2">Cập nhật lần cuối: 08/07/2025</p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 rounded-xl shadow-xl space-y-10">
          {/* 1. Giới thiệu */}
          <section>
            <SectionTitle
              icon={ShieldCheck}
              title="1. Giới thiệu & Chấp nhận Điều khoản"
            />
            <p>
              Khi bạn truy cập hoặc sử dụng nền tảng đặt sân cầu lông, bạn đồng
              ý tuân thủ các điều khoản dịch vụ dưới đây. Nếu không đồng ý, vui
              lòng không sử dụng dịch vụ.
            </p>
          </section>

          {/* 2. Tài khoản */}
          <section>
            <SectionTitle icon={UserCircle} title="2. Quy định về Tài khoản" />
            <ul className="list-disc list-inside space-y-2">
              <li>Thông tin tài khoản phải chính xác và cập nhật.</li>
              <li>Bạn có trách nhiệm bảo mật tài khoản và mật khẩu.</li>
              <li>Mọi hoạt động trên tài khoản sẽ do bạn chịu trách nhiệm.</li>
              <li>Chúng tôi có quyền khóa tài khoản nếu vi phạm điều khoản.</li>
            </ul>
          </section>

          {/* 3. Đặt sân & Thanh toán */}
          <section>
            <SectionTitle
              icon={CreditCard}
              title="3. Quy trình Đặt sân & Thanh toán"
            />
            <p>
              Người dùng có thể đặt sân trực tuyến và thanh toán qua các cổng hỗ
              trợ như ví điện tử, ngân hàng hoặc thẻ quốc tế.
            </p>
            <p className="mt-2">
              Sau khi thanh toán thành công, hệ thống sẽ gửi xác nhận qua email
              hoặc hiển thị trực tiếp trong giao diện người dùng.
            </p>
            <ImageGallery
              images={paymentImageList}
              columns={4}
              onImageClick={(src) => openZoom(src, paymentImageList)}
            />
          </section>

          {/* 4. Người dùng */}
          <section>
            <SectionTitle
              icon={Users}
              title="4. Quyền và Nghĩa vụ của Người dùng"
            />
            <ul className="list-disc list-inside space-y-2">
              <li>Tuân thủ nội quy và quy định của sân vận động.</li>
              <li>Sử dụng sân đúng mục đích, không phá hoại cơ sở vật chất.</li>
              <li>Không tự ý chuyển nhượng quyền đặt sân cho bên thứ ba.</li>
              <li>Thanh toán đầy đủ trước khi sử dụng sân.</li>
            </ul>
          </section>

          {/* 5. Nhà cung cấp sân */}
          <section>
            <SectionTitle
              icon={Building2}
              title="5. Quyền và Nghĩa vụ của Nhà cung cấp Sân"
            />
            <ul className="list-disc list-inside space-y-2">
              <li>Cung cấp sân đúng giờ, đúng trạng thái như cam kết.</li>
              <li>Bảo trì và đảm bảo an toàn khi người dùng sử dụng.</li>
              <li>Giải quyết sự cố phát sinh nhanh chóng, chuyên nghiệp.</li>
            </ul>
            <ImageGallery
              images={courtImageList}
              columns={3}
              onImageClick={(src) => openZoom(src, courtImageList)}
            />

            <p className="text-sm text-gray-500 text-center mt-2">
              Hình ảnh sân cầu lông đạt chuẩn
            </p>
          </section>

          {/* 6. Hủy sân */}
          <section>
            <SectionTitle icon={Ban} title="6. Chính sách Hủy sân" />
            <p>
              Người dùng có thể hủy sân theo quy định riêng của từng sân. Một số
              nhà cung cấp có thể áp dụng phí hủy nếu thông báo trễ hơn thời
              gian quy định.
            </p>
          </section>

          {/* 7. Miễn trừ trách nhiệm */}
          <section>
            <SectionTitle
              icon={AlertTriangle}
              title="7. Miễn trừ Trách nhiệm"
            />
            <p>
              Chúng tôi chỉ đóng vai trò trung gian giữa người dùng và nhà cung
              cấp sân. Mọi tranh chấp hoặc sự cố trong quá trình sử dụng sẽ được
              giải quyết giữa hai bên liên quan.
            </p>
          </section>
        </div>
      </div>
      {/* Zoom image */}
      {ZoomOverlay}
    </div>
  );
};

export default TermsOfServicePage;
