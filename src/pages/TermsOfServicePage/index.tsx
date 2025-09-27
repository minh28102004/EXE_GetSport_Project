import React, { useState, useEffect, useRef } from "react";
import { FiPhone, FiHelpCircle } from "react-icons/fi";
import {
  ShieldCheck,
  UserCircle,
  CreditCard,
  Users,
  Building2,
  Ban,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  Clock,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { useImageZoom } from "@hooks/useImageZoom";
import endPoint from "@routes/router";

// Load ảnh (Vite)
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
const mockPaymentImages = Object.values(paymentImages).slice(0, 4) as string[];
const mockCourtImages = Object.values(courtImages).slice(0, 3) as string[];

// Nav item
const NavItem = ({
  icon: Icon,
  title,
  isActive,
  onClick,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3.5 py-2.5 rounded-lg transition-all duration-200 text-left ${
      isActive
        ? "bg-teal-50 text-teal-700 border-r-4 border-teal-500"
        : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
    }`}
  >
    <Icon
      className={`w-5 h-5 mr-3 ${isActive ? "text-teal-600" : "text-gray-400"}`}
    />
    <span className="text-sm font-medium">{title}</span>
  </button>
);

// Section title
const SectionTitle = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-5">
    <div className="flex items-center mb-1.5">
      <div className="bg-teal-100 p-1.5 rounded-lg mr-3">
        <Icon className="w-5 h-5 text-teal-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {subtitle && <p className="text-gray-600 ml-12 text-sm">{subtitle}</p>}
  </div>
);

// Image gallery (ảnh thấp hơn để gọn trang)
const ImageGallery = ({
  images,
  columns = 3,
  onImageClick,
  title,
}: {
  images: string[];
  columns?: 2 | 3 | 4;
  onImageClick?: (src: string) => void;
  title?: string;
}) => {
  const columnClass =
    columns === 4
      ? "lg:grid-cols-4 md:grid-cols-3"
      : columns === 3
      ? "lg:grid-cols-3 md:grid-cols-2"
      : "md:grid-cols-2";

  return (
    <div className="bg-teal-50 p-5 rounded-xl">
      {title && (
        <h4 className="text-base font-semibold text-teal-800 mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          {title}
        </h4>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnClass} gap-3.5`}>
        {images.map((imgSrc, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            onClick={() => onImageClick?.(imgSrc)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <img
                src={imgSrc}
                alt={`Hình minh họa ${index + 1}`}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[11px] font-medium text-gray-700">
                Hình {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Feature list (item compacter)
const FeatureList = ({ items }: { items: string[] }) => (
  <div className="space-y-2.5">
    {items.map((item, index) => (
      <div key={index} className="flex items-start">
        <CheckCircle className="w-4.5 h-4.5 text-teal-500 mr-2.5 mt-0.5 flex-shrink-0" />
        <span className="text-gray-700 leading-relaxed text-[15px]">
          {item}
        </span>
      </div>
    ))}
  </div>
);

const TermsOfServicePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openZoom, ZoomOverlay } = useImageZoom();

  // sentinel để ẩn nút khi tới cuối layout
  const endRef = useRef<HTMLDivElement | null>(null);
  const [hideFab, setHideFab] = useState(false);

  const sections = [
    { id: "intro", icon: ShieldCheck, title: "Giới thiệu" },
    { id: "account", icon: UserCircle, title: "Tài khoản" },
    { id: "booking", icon: CreditCard, title: "Đặt sân & Thanh toán" },
    { id: "user-rights", icon: Users, title: "Quyền người dùng" },
    { id: "provider-rights", icon: Building2, title: "Nhà cung cấp sân" },
    { id: "cancellation", icon: Ban, title: "Chính sách hủy" },
    { id: "disclaimer", icon: AlertTriangle, title: "Miễn trừ trách nhiệm" },
    // 🔹 Thêm mục Liên hệ vào sidebar
    { id: "contact", icon: Mail, title: "Liên hệ" },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ẩn hiện FAB theo sentinel cuối layout
  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHideFab(entry.isIntersecting),
      { root: null, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-teal-50 min-h-screen">
      {/* Header (gọn) */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-6 text-center max-w-6xl">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2.5">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-gray-50 text-base md:text-lg max-w-2xl mx-auto">
            Nền tảng đặt sân cầu lông hàng đầu - Minh bạch, tin cậy và chuyên
            nghiệp
          </p>
          <div className="flex items-center justify-center mt-3 text-gray-50 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span>Cập nhật lần cuối: 08/07/2025</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 lg:sticky lg:top-18.5 lg:self-start">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <span className="font-semibold text-gray-800">Mục lục</span>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } lg:block p-4 space-y-2`}
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 hidden lg:block">
                  Mục lục
                </h3>
                {sections.map((section) => (
                  <NavItem
                    key={section.id}
                    id={section.id}
                    icon={section.icon}
                    title={section.title}
                    isActive={activeSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                  />
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="bg-white rounded-xl shadow-lg p-5 mt-5 hidden lg:block">
              <h4 className="font-semibold text-gray-800 mb-3">
                Thông tin hữu ích
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                  <span>Bảo mật thông tin tuyệt đối</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                  <span>Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                  <span>Chính sách hoàn tiền rõ ràng</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 lg:p-8 space-y-10">
                {/* Giới thiệu */}
                <section id="intro" className="scroll-mt-16">
                  <SectionTitle
                    icon={ShieldCheck}
                    title="Giới thiệu & Chấp nhận Điều khoản"
                    subtitle="Cam kết minh bạch và tin cậy trong mọi dịch vụ"
                  />
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-5">
                      Chào mừng bạn đến với nền tảng đặt sân cầu lông hàng đầu!
                      Khi bạn truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn
                      đồng ý tuân thủ các điều khoản và điều kiện được quy định
                      dưới đây.
                    </p>
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 p-5 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-teal-600 mr-3 mt-0.5" />
                        <div>
                          <p className="font-semibold text-teal-800 mb-1.5">
                            Lưu ý quan trọng:
                          </p>
                          <p className="text-teal-700 text-[15px]">
                            Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui
                            lòng không sử dụng dịch vụ. Việc tiếp tục sử dụng
                            đồng nghĩa với việc bạn chấp nhận toàn bộ các quy
                            định.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Tài khoản */}
                <section id="account" className="scroll-mt-16">
                  <SectionTitle
                    icon={UserCircle}
                    title="Quy định về Tài khoản"
                    subtitle="Bảo mật và quản lý tài khoản hiệu quả"
                  />
                  <FeatureList
                    items={[
                      "Thông tin tài khoản phải chính xác, đầy đủ và được cập nhật thường xuyên",
                      "Bạn có trách nhiệm bảo mật tài khoản và mật khẩu của mình",
                      "Mọi hoạt động diễn ra trên tài khoản sẽ do bạn chịu trách nhiệm hoàn toàn",
                      "Chúng tôi có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện vi phạm",
                      "Không được chia sẻ tài khoản cho người khác hoặc tạo nhiều tài khoản ảo",
                      "Thông báo ngay cho chúng tôi nếu phát hiện tài khoản bị sử dụng trái phép",
                    ]}
                  />
                </section>

                {/* Đặt sân & Thanh toán */}
                <section id="booking" className="scroll-mt-16">
                  <SectionTitle
                    icon={CreditCard}
                    title="Quy trình Đặt sân & Thanh toán"
                    subtitle="Đơn giản, nhanh chóng và bảo mật tuyệt đối"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed">
                      Hệ thống đặt sân trực tuyến của chúng tôi được thiết kế để
                      mang lại trải nghiệm tốt nhất cho người dùng với quy trình
                      đơn giản và các phương thức thanh toán đa dạng.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl">
                        <h4 className="font-semibold text-teal-800 mb-2.5 flex items-center">
                          <CreditCard className="w-4.5 h-4.5 mr-2" />
                          Phương thức thanh toán
                        </h4>
                        <FeatureList
                          items={[
                            "Ví điện tử (Momo, ZaloPay, VNPay)",
                            "Thẻ ngân hàng (ATM, Visa, Mastercard)",
                            "Chuyển khoản trực tuyến",
                            "Thanh toán tại sân (một số địa điểm)",
                          ]}
                        />
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl">
                        <h4 className="font-semibold text-green-800 mb-2.5 flex items-center">
                          <CheckCircle className="w-4.5 h-4.5 mr-2" />
                          Quy trình xác nhận
                        </h4>
                        <FeatureList
                          items={[
                            "Xác nhận tức thì sau khi thanh toán",
                            "Email xác nhận chi tiết",
                            "SMS thông báo (nếu đăng ký)",
                            "Lịch sử đặt sân trong tài khoản",
                          ]}
                        />
                      </div>
                    </div>

                    <ImageGallery
                      images={mockPaymentImages}
                      columns={4}
                      onImageClick={(src) => openZoom(src, mockPaymentImages)}
                      title="Hình ảnh minh họa các phương thức thanh toán"
                    />
                  </div>
                </section>

                {/* Quyền người dùng */}
                <section id="user-rights" className="scroll-mt-16">
                  <SectionTitle
                    icon={Users}
                    title="Quyền và Nghĩa vụ của Người dùng"
                    subtitle="Quy định rõ ràng để đảm bảo trải nghiệm tốt nhất"
                  />
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Quyền lợi của bạn
                      </h4>
                      <FeatureList
                        items={[
                          "Sử dụng sân đúng thời gian đã đặt",
                          "Được hỗ trợ kỹ thuật 24/7",
                          "Hoàn tiền theo chính sách nếu sân có vấn đề",
                          "Được thông báo trước nếu có thay đổi",
                        ]}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                        Nghĩa vụ cần tuân thủ
                      </h4>
                      <FeatureList
                        items={[
                          "Tuân thủ nội quy và quy định của từng sân vận động",
                          "Sử dụng sân đúng mục đích, bảo vệ trang thiết bị",
                          "Không tự ý chuyển nhượng quyền đặt sân",
                          "Thanh toán đầy đủ và đúng thời hạn",
                        ]}
                      />
                    </div>
                  </div>
                </section>

                {/* Nhà cung cấp sân */}
                <section id="provider-rights" className="scroll-mt-16">
                  <SectionTitle
                    icon={Building2}
                    title="Quyền và Nghĩa vụ của Nhà cung cấp Sân"
                    subtitle="Cam kết chất lượng từ các đối tác của chúng tôi"
                  />
                  <div className="space-y-5">
                    <FeatureList
                      items={[
                        "Cung cấp sân đúng giờ, đúng chất lượng như cam kết",
                        "Bảo trì và đảm bảo an toàn cho người sử dụng",
                        "Giải quyết mọi sự cố một cách nhanh chóng và chuyên nghiệp",
                        "Thông báo trước nếu có thay đổi lịch trình hoặc bảo trì",
                        "Cung cấp đầy đủ tiện ích như mô tả trong thông tin sân",
                      ]}
                    />
                    <ImageGallery
                      images={mockCourtImages}
                      columns={3}
                      onImageClick={(src) => openZoom(src, mockCourtImages)}
                      title="Tiêu chuẩn sân cầu lông chất lượng cao"
                    />
                  </div>
                </section>

                {/* Chính sách hủy */}
                <section id="cancellation" className="scroll-mt-16">
                  <SectionTitle
                    icon={Ban}
                    title="Chính sách Hủy sân"
                    subtitle="Linh hoạt và công bằng cho mọi tình huống"
                  />
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-5 rounded-lg">
                    <p className="text-gray-700 leading-relaxed mb-3.5">
                      Chính sách hủy sân có thể khác nhau tùy theo từng nhà cung
                      cấp và loại sân. Chúng tôi luôn cố gắng cân bằng quyền lợi
                      giữa người dùng và nhà cung cấp sân.
                    </p>
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">
                        Quy định chung:
                      </h5>
                      <FeatureList
                        items={[
                          "Hủy trước 24h: Không tính phí",
                          "Hủy trước 12h: Phí 20% giá trị đặt sân",
                          "Hủy trước 2h: Phí 50% giá trị đặt sân",
                          "Hủy trong vòng 2h: Không hoàn tiền",
                        ]}
                      />
                    </div>
                  </div>
                </section>

                {/* Miễn trừ trách nhiệm */}
                <section id="disclaimer" className="scroll-mt-16">
                  <SectionTitle
                    icon={AlertTriangle}
                    title="Miễn trừ Trách nhiệm"
                    subtitle="Vai trò và trách nhiệm của nền tảng"
                  />
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-5 rounded-xl">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-1.5">
                            Vai trò của nền tảng
                          </h4>
                          <p className="text-yellow-700 leading-relaxed text-[15px]">
                            Chúng tôi đóng vai trò là nền tảng trung gian kết
                            nối người dùng và nhà cung cấp sân. Mọi tranh chấp
                            hoặc sự cố trong quá trình sử dụng sân sẽ được hỗ
                            trợ giải quyết giữa các bên liên quan một cách công
                            bằng và minh bạch.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-teal-50 p-5 rounded-xl">
                        <h5 className="font-semibold text-teal-800 mb-2">
                          Chúng tôi cam kết:
                        </h5>
                        <FeatureList
                          items={[
                            "Kết nối đáng tin cậy",
                            "Hỗ trợ giải quyết tranh chấp",
                            "Bảo mật thông tin thanh toán",
                            "Cung cấp thông tin minh bạch",
                          ]}
                        />
                      </div>
                      <div className="bg-gray-50 p-5 rounded-xl">
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Trách nhiệm của các bên:
                        </h5>
                        <FeatureList
                          items={[
                            "Nhà cung cấp: Chất lượng sân, dịch vụ",
                            "Người dùng: Tuân thủ quy định sử dụng",
                            "Nền tảng: Kết nối và hỗ trợ",
                            "Tất cả: Hợp tác giải quyết vấn đề",
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 🔹 Liên hệ về Điều khoản Dịch vụ */}
                <section id="contact" className="scroll-mt-16">
                  <SectionTitle
                    icon={Mail}
                    title="Liên hệ về Điều khoản Dịch vụ"
                    subtitle="Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc liên quan đến điều khoản"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed">
                      Nếu bạn có câu hỏi, phản hồi hoặc muốn báo cáo vi phạm
                      liên quan đến Điều khoản Dịch vụ, vui lòng liên hệ:
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-teal-50 p-5 rounded-xl">
                        <h4 className="font-semibold text-teal-800 mb-2 flex items-center">
                          <Mail className="w-5 h-5 mr-2" />
                          Email điều khoản
                        </h4>
                        <p className="text-gray-700 text-sm">
                          GSTerms@gmail.com — phản hồi trong 24 giờ làm việc.
                        </p>
                      </div>

                      <div className="bg-blue-50 p-5 rounded-xl">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <Phone className="w-5 h-5 mr-2" />
                          Hotline điều khoản
                        </h4>
                        <p className="text-gray-700 text-sm">
                          1900-1234 — hỗ trợ 24/7 cho các vấn đề khẩn cấp.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 p-5 rounded-xl">
                      <h5 className="font-semibold text-teal-800 mb-2">
                        Báo cáo vi phạm điều khoản
                      </h5>
                      <p className="text-gray-700 mb-3 text-sm">
                        Nếu phát hiện hành vi lạm dụng hoặc vi phạm điều khoản,
                        hãy gửi chi tiết kèm bằng chứng cho chúng tôi để xử lý
                        trong vòng 72 giờ.
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="bg-white px-3.5 py-2 rounded-lg text-sm font-medium text-teal-700 border border-teal-200">
                          📧 GSTerms@gmail.com
                        </span>
                        <span className="bg-white px-3.5 py-2 rounded-lg text-sm font-medium text-teal-700 border border-teal-200">
                          🔒 PGP Key có sẵn
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* CTA hỗ trợ */}
                <section className="bg-gradient-to-br from-[#1e9ea1] via-teal-500 to-[#1e9ea1] text-white p-6 -mx-6 lg:-mx-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-white/20 rounded-full mb-3">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Cần hỗ trợ thêm?</h3>
                    <p className="text-teal-100 mb-5 max-w-2xl mx-auto text-sm md:test-base">
                      Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay
                      nếu có thắc mắc về điều khoản hoặc cần thêm thông tin chi
                      tiết.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={endPoint.CONTACT}
                        className="flex items-center justify-center gap-2 bg-white text-teal-600 px-7 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200"
                      >
                        <FiPhone className="w-5 h-5" />
                        Liên hệ hỗ trợ
                      </a>
                      <a
                        href={endPoint.FAQS}
                        className="flex items-center justify-center gap-2 border-2 border-white text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all duration-200"
                      >
                        <FiHelpCircle className="w-5 h-5" />
                        FAQ thường gặp
                      </a>
                    </div>
                  </div>
                </section>
              </div>

              {/* Last updated */}
              <div className="text-center text-gray-500 text-xs md:text-sm border-t border-gray-200 py-5">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Điều khoản dịch vụ có hiệu lực từ ngày 08/07/2025</span>
                </div>
                <p className="mb-3 mx-4">
                  Chúng tôi có thể cập nhật điều khoản dịch vụ để phản ánh thay
                  đổi trong hoạt động và pháp luật. Mọi thay đổi quan trọng sẽ
                  được thông báo trước ít nhất 30 ngày.
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] md:text-xs">
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-[#1e9ea1]" />
                    Công khai & minh bạch
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-[#1e9ea1]" />
                    Bảo vệ quyền lợi người dùng
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-[#1e9ea1]" />
                    Tuân thủ pháp luật
                  </span>
                </div>
              </div>

              {/* Sentinel cuối layout (để ẩn FAB) */}
              <div ref={endRef} />
            </div>
          </main>
        </div>
      </div>

      {/* Back to top button — ẩn khi chạm sentinel cuối layout */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={[
          "fixed bottom-5 right-5 z-40 bg-teal-600/70 text-white p-3 rounded-full shadow-lg hover:bg-teal-700",
          "transition-all duration-200 transform hover:scale-110",
          hideFab
            ? "opacity-0 pointer-events-none translate-y-2"
            : "opacity-100",
        ].join(" ")}
        aria-label="Back to top"
      >
        <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
      </button>

      {ZoomOverlay}
    </div>
  );
};

export default TermsOfServicePage;
