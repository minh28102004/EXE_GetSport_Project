import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Settings,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  Clock,
  Phone,
  HelpCircle,
  FileText,
  Globe,
  Smartphone,
  Fingerprint,
  Share2,
  Trash2,
  Download,
  Mail,
} from "lucide-react";
import { useImageZoom } from "@hooks/useImageZoom";
import endPoint from "@routes/router";

/* ------------ Load ảnh (Vite) ------------ */
const privacyImages = import.meta.glob("../../images/Privacy_Images/*.jpg", {
  eager: true,
  import: "default",
});
const securityImages = import.meta.glob("../../images/Security_Images/*.jpg", {
  eager: true,
  import: "default",
});

const mockPrivacyImages = Object.values(privacyImages).slice(0, 4) as string[];
const mockSecurityImages = Object.values(securityImages).slice(
  0,
  3
) as string[];

/* ------------ UI bits ------------ */
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
        ? "bg-[#1e9ea1]/10 text-[#1e9ea1] border-r-4 border-[#1e9ea1]"
        : "text-gray-600 hover:bg-gray-50 hover:text-[#1e9ea1]"
    }`}
  >
    <Icon
      className={`w-5 h-5 mr-3 ${
        isActive ? "text-[#1e9ea1]" : "text-gray-400"
      }`}
    />
    <span className="text-sm font-medium">{title}</span>
  </button>
);

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
      <div className="bg-[#1e9ea1]/10 p-1.5 rounded-lg mr-3.5">
        <Icon className="w-5 h-5 text-[#1e9ea1]" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    {subtitle && (
      <p className="text-gray-600 ml-12 text-sm md:text-base">{subtitle}</p>
    )}
  </div>
);

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
    <div className="bg-[#1e9ea1]/5 p-5 rounded-xl">
      {title && (
        <h4 className="text-base md:text-lg font-semibold text-[#1e9ea1] mb-3 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
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
                className="w-full h-40 md:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] md:text-xs font-medium text-gray-700">
                Hình {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureList = ({ items }: { items: string[] }) => (
  <div className="space-y-2.5">
    {items.map((item, index) => (
      <div key={index} className="flex items-start">
        <CheckCircle className="w-5 h-5 text-[#1e9ea1] mr-2.5 mt-0.5 flex-shrink-0" />
        <span className="text-gray-700 leading-relaxed text-sm md:text-base">
          {item}
        </span>
      </div>
    ))}
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  description,
  bgColor = "bg-[#1e9ea1]/5",
  iconColor = "text-[#1e9ea1]",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
}) => (
  <div className={`${bgColor} p-5 rounded-xl`}>
    <div className="flex items-start">
      <div className="bg-white p-1.5 rounded-lg mr-3.5 flex-shrink-0">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 mb-1.5">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

/* ------------ Page ------------ */
const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openZoom, ZoomOverlay } = useImageZoom();

  // FAB visibility (ẩn khi tới cuối layout)
  const [hideFab, setHideFab] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const sections = [
    { id: "intro", icon: Shield, title: "Giới thiệu" },
    { id: "data-collection", icon: Database, title: "Thu thập dữ liệu" },
    { id: "data-usage", icon: Settings, title: "Sử dụng thông tin" },
    { id: "data-sharing", icon: Share2, title: "Chia sẻ thông tin" },
    { id: "data-security", icon: Lock, title: "Bảo mật dữ liệu" },
    { id: "user-rights", icon: UserCheck, title: "Quyền người dùng" },
    { id: "cookies", icon: Globe, title: "Cookies & Tracking" },
    { id: "contact", icon: Mail, title: "Liên hệ" },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // cập nhật mục đang active
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

  // Ẩn hiện FAB khi chạm sentinel cuối layout
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
    <div className="bg-gradient-to-br from-gray-50 to-[#1e9ea1]/5 min-h-screen">
      {/* Header (compact) */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3.5">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-teal-50 text-base md:text-lg max-w-2xl mx-auto">
            Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn một cách
            tuyệt đối
          </p>
          <div className="flex items-center justify-center mt-3 text-teal-50 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span>Cập nhật lần cuối: 08/07/2025</span>
          </div>
        </div>
      </div>

      {/* Main container */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 xl:w-80 lg:sticky lg:top-18.5 lg:self-start">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Mobile menu button */}
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

              {/* Navigation items */}
              <div
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } lg:block p-4 space-y-1.5`}
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

            {/* Quick info card */}
            <div className="bg-white rounded-xl shadow-lg p-5 mt-5 hidden lg:block">
              <h4 className="font-semibold text-gray-800 mb-3">
                Cam kết của chúng tôi
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#1e9ea1] mr-2" />
                  <span>Không bán thông tin cá nhân</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#1e9ea1] mr-2" />
                  <span>Mã hóa dữ liệu 256-bit</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#1e9ea1] mr-2" />
                  <span>Tuân thủ GDPR & CCPA</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#1e9ea1] mr-2" />
                  <span>Kiểm soát dữ liệu của bạn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 lg:p-8 space-y-8">
                {/* Section 1 */}
                <section id="intro" className="scroll-mt-8">
                  <SectionTitle
                    icon={Shield}
                    title="Cam kết Bảo mật Thông tin"
                    subtitle="Quyền riêng tư của bạn là ưu tiên hàng đầu của chúng tôi"
                  />
                  <div className="max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-5 text-sm md:text-base">
                      Chúng tôi hiểu rằng thông tin cá nhân của bạn là tài sản
                      quý giá và cần được bảo vệ một cách tốt nhất. Chính sách
                      bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu
                      trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ đặt
                      sân cầu lông.
                    </p>
                    <div className="bg-gradient-to-r from-[#1e9ea1]/5 to-blue-50 border-l-4 border-[#1e9ea1] p-5 rounded-lg">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-[#1e9ea1] mr-3 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#1e9ea1] mb-1.5">
                            Nguyên tắc cốt lõi:
                          </p>
                          <p className="text-gray-700 text-sm md:text-base">
                            Minh bạch trong việc thu thập và sử dụng dữ liệu,
                            đảm bảo quyền kiểm soát thông tin của người dùng và
                            áp dụng các biện pháp bảo mật hàng đầu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="data-collection" className="scroll-mt-8">
                  <SectionTitle
                    icon={Database}
                    title="Thu thập Dữ liệu"
                    subtitle="Thông tin chúng tôi thu thập và cách thức thu thập"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      Chúng tôi chỉ thu thập những thông tin cần thiết để cung
                      cấp dịch vụ tốt nhất cho bạn. Dưới đây là các loại thông
                      tin được thu thập:
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                      <InfoCard
                        icon={UserCheck}
                        title="Thông tin cá nhân"
                        description="Họ tên, email, số điện thoại, địa chỉ - được cung cấp khi đăng ký tài khoản hoặc đặt sân"
                        bgColor="bg-[#1e9ea1]/5"
                      />
                      <InfoCard
                        icon={Smartphone}
                        title="Thông tin thiết bị"
                        description="Địa chỉ IP, loại trình duyệt, hệ điều hành, thông tin thiết bị di động"
                        bgColor="bg-blue-50"
                      />
                      <InfoCard
                        icon={Globe}
                        title="Dữ liệu sử dụng"
                        description="Thời gian truy cập, trang xem, tính năng sử dụng, lịch sử đặt sân"
                        bgColor="bg-green-50"
                      />
                      <InfoCard
                        icon={FileText}
                        title="Thông tin thanh toán"
                        description="Chi tiết giao dịch, phương thức thanh toán (không lưu trữ thông tin thẻ đầy đủ)"
                        bgColor="bg-orange-50"
                      />
                    </div>

                    <ImageGallery
                      images={mockPrivacyImages}
                      columns={4}
                      onImageClick={(src) => openZoom(src, mockPrivacyImages)}
                      title="Minh họa quá trình bảo mật thông tin"
                    />
                  </div>
                </section>

                {/* Section 3 */}
                <section id="data-usage" className="scroll-mt-8">
                  <SectionTitle
                    icon={Settings}
                    title="Sử dụng Thông tin"
                    subtitle="Mục đích và cách thức sử dụng dữ liệu của bạn"
                  />
                  <div className="space-y-5">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 text-[#1e9ea1] mr-2" />
                          Mục đích chính
                        </h4>
                        <FeatureList
                          items={[
                            "Xử lý và xác nhận đặt sân của bạn",
                            "Gửi thông báo về lịch đặt sân và thanh toán",
                            "Cung cấp hỗ trợ khách hàng chuyên nghiệp",
                            "Cải thiện chất lượng dịch vụ dựa trên phản hồi",
                            "Bảo mật tài khoản và phát hiện gian lận",
                          ]}
                        />
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                          Mục đích phụ (có thể từ chối)
                        </h4>
                        <FeatureList
                          items={[
                            "Gửi email marketing về ưu đãi và sự kiện",
                            "Phân tích hành vi người dùng để cải thiện trải nghiệm",
                            "Cá nhân hóa nội dung và đề xuất sân phù hợp",
                            "Khảo sát ý kiến và nghiên cứu thị trường",
                          ]}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-5 rounded-xl">
                      <div className="flex items-start">
                        <Fingerprint className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-1.5">
                            Kiểm soát quyền riêng tư
                          </h4>
                          <p className="text-yellow-700 leading-relaxed text-sm md:text-base">
                            Bạn có thể điều chỉnh cài đặt quyền riêng tư bất kỳ
                            lúc nào trong tài khoản của mình. Chúng tôi tôn
                            trọng lựa chọn của bạn và sẽ không sử dụng thông tin
                            cho các mục đích mà bạn không đồng ý.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="data-sharing" className="scroll-mt-8">
                  <SectionTitle
                    icon={Share2}
                    title="Chia sẻ Thông tin với Bên thứ ba"
                    subtitle="Khi nào và với ai chúng tôi chia sẻ dữ liệu của bạn"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      Chúng tôi có nguyên tắc không bán thông tin cá nhân của
                      bạn. Việc chia sẻ chỉ xảy ra trong những trường hợp cần
                      thiết sau:
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-[#1e9ea1]/5 p-5 rounded-xl">
                        <h4 className="font-semibold text-[#1e9ea1] mb-2.5 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Đối tác dịch vụ
                        </h4>
                        <FeatureList
                          items={[
                            "Nhà cung cấp sân cầu lông (chỉ thông tin cần thiết)",
                            "Nhà cung cấp dịch vụ thanh toán (đã được mã hóa)",
                            "Dịch vụ email và SMS (chỉ để gửi thông báo)",
                            "Dịch vụ phân tích web (dữ liệu ẩn danh)",
                          ]}
                        />
                      </div>

                      <div className="bg-red-50 p-5 rounded-xl">
                        <h4 className="font-semibold text-red-800 mb-2.5 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Trường hợp bắt buộc
                        </h4>
                        <FeatureList
                          items={[
                            "Yêu cầu từ cơ quan pháp luật có thẩm quyền",
                            "Bảo vệ quyền lợi và an toàn của người dùng",
                            "Phòng chống gian lận và hoạt động bất hợp pháp",
                            "Thực hiện các nghĩa vụ pháp lý",
                          ]}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#1e9ea1]/5 to-blue-50 border-l-4 border-[#1e9ea1] p-5 rounded-lg">
                      <div className="flex items-start">
                        <Lock className="w-5 h-5 text-[#1e9ea1] mr-3 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#1e9ea1] mb-1.5">
                            Cam kết bảo mật:
                          </p>
                          <p className="text-gray-700 text-sm md:text-base">
                            Tất cả đối tác của chúng tôi đều phải ký kết thỏa
                            thuận bảo mật nghiêm ngặt và chỉ được sử dụng thông
                            tin cho mục đích đã thỏa thuận.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="data-security" className="scroll-mt-8">
                  <SectionTitle
                    icon={Lock}
                    title="Bảo mật Dữ liệu"
                    subtitle="Các biện pháp kỹ thuật và tổ chức để bảo vệ thông tin của bạn"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      Chúng tôi áp dụng các công nghệ bảo mật hàng đầu và tuân
                      thủ các tiêu chuẩn bảo mật quốc tế để đảm bảo thông tin
                      của bạn được bảo vệ tối đa.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5">
                      <InfoCard
                        icon={Lock}
                        title="Mã hóa SSL/TLS"
                        description="Tất cả dữ liệu truyền tải được mã hóa 256-bit, đảm bảo an toàn tuyệt đối"
                      />
                      <InfoCard
                        icon={Shield}
                        title="Tường lửa bảo vệ"
                        description="Hệ thống tường lửa đa lớp và giám sát 24/7 chống lại các cuộc tấn công"
                      />
                      <InfoCard
                        icon={Fingerprint}
                        title="Xác thực 2 lớp"
                        description="Tùy chọn bảo mật bổ sung để tăng cường bảo vệ tài khoản của bạn"
                      />
                    </div>

                    <ImageGallery
                      images={mockSecurityImages}
                      columns={3}
                      onImageClick={(src) => openZoom(src, mockSecurityImages)}
                      title="Minh họa hệ thống bảo mật đa lớp"
                    />

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Các biện pháp bảo mật khác
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FeatureList
                          items={[
                            "Sao lưu dữ liệu định kỳ và tự động",
                            "Kiểm tra bảo mật thường xuyên",
                            "Đào tạo nhân viên về an ninh thông tin",
                          ]}
                        />
                        <FeatureList
                          items={[
                            "Giới hạn quyền truy cập theo vai trò",
                            "Giám sát hoạt động bất thường",
                            "Kế hoạch phục hồi sau thảm họa",
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="user-rights" className="scroll-mt-8">
                  <SectionTitle
                    icon={UserCheck}
                    title="Quyền của Người dùng"
                    subtitle="Kiểm soát hoàn toàn thông tin cá nhân của bạn"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      Bạn có quyền kiểm soát thông tin cá nhân của mình. Chúng
                      tôi cam kết hỗ trợ bạn thực hiện các quyền này một cách dễ
                      dàng và minh bạch.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InfoCard
                        icon={Eye}
                        title="Quyền truy cập"
                        description="Xem toàn bộ thông tin cá nhân mà chúng tôi đang lưu trữ"
                        bgColor="bg-blue-50"
                        iconColor="text-blue-600"
                      />
                      <InfoCard
                        icon={Settings}
                        title="Quyền sửa đổi"
                        description="Cập nhật và chỉnh sửa thông tin cá nhân bất kỳ lúc nào"
                        bgColor="bg-green-50"
                        iconColor="text-green-600"
                      />
                      <InfoCard
                        icon={Download}
                        title="Quyền xuất dữ liệu"
                        description="Tải xuống toàn bộ dữ liệu của bạn định dạng có thể đọc được"
                        bgColor="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                      <InfoCard
                        icon={Trash2}
                        title="Quyền xóa"
                        description="Yêu cầu xóa hoàn toàn tài khoản và dữ liệu liên quan"
                        bgColor="bg-red-50"
                        iconColor="text-red-600"
                      />
                    </div>

                    <div className="bg-[#1e9ea1]/5 border-l-4 border-[#1e9ea1] p-5 rounded-lg">
                      <h4 className="font-semibold text-[#1e9ea1] mb-2.5">
                        Cách thức thực hiện quyền của bạn:
                      </h4>
                      <div className="space-y-1.5 text-gray-700 text-sm md:text-base">
                        <div className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-[#1e9ea1] mr-2" />
                          <span>
                            Truy cập vào tài khoản → Cài đặt quyền riêng tư
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-[#1e9ea1] mr-2" />
                          <span>
                            Liên hệ bộ phận hỗ trợ qua email hoặc hotline
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-[#1e9ea1] mr-2" />
                          <span>Thời gian xử lý: tối đa 30 ngày làm việc</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="cookies" className="scroll-mt-8">
                  <SectionTitle
                    icon={Globe}
                    title="Cookies & Công nghệ Theo dõi"
                    subtitle="Cách chúng tôi sử dụng cookies và công nghệ tương tự"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      Chúng tôi sử dụng cookies và các công nghệ theo dõi khác
                      để cải thiện trải nghiệm của bạn, cung cấp nội dung phù
                      hợp và phân tích hiệu suất website.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5">
                      <InfoCard
                        icon={CheckCircle}
                        title="Cookies cần thiết"
                        description="Đảm bảo website hoạt động bình thường và bảo mật. Không thể tắt."
                        bgColor="bg-green-50"
                        iconColor="text-green-600"
                      />
                      <InfoCard
                        icon={Settings}
                        title="Cookies chức năng"
                        description="Lưu trữ tùy chọn của bạn như ngôn ngữ, thành phố yêu thích."
                        bgColor="bg-blue-50"
                        iconColor="text-blue-600"
                      />
                      <InfoCard
                        icon={AlertTriangle}
                        title="Cookies phân tích"
                        description="Google Analytics và công cụ tương tự để hiểu cách bạn sử dụng website."
                        bgColor="bg-orange-50"
                        iconColor="text-orange-600"
                      />
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2.5 flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Quản lý Cookies
                      </h4>
                      <p className="text-gray-600 mb-3 text-sm md:text-base">
                        Bạn có thể điều chỉnh cài đặt cookies trong trình duyệt
                        hoặc thông qua bảng điều khiển cookie trên website của
                        chúng tôi.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#1e9ea1]/10 text-[#1e9ea1] px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Chấp nhận tất cả
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Chỉ cần thiết
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Tùy chỉnh
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 8 */}
                <section id="contact" className="scroll-mt-8">
                  <SectionTitle
                    icon={Mail}
                    title="Liên hệ về Chính Sách Bảo mật"
                    subtitle="Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn"
                  />
                  <div className="space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      Nếu bạn có bất kỳ câu hỏi, lo ngại hay yêu cầu nào liên
                      quan đến quyền riêng tư và bảo mật dữ liệu, vui lòng liên
                      hệ với chúng tôi:
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                      <InfoCard
                        icon={Mail}
                        title="Email bảo mật"
                        description="GSPrivacy@gmail.com - Phản hồi trong vòng 24 giờ."
                        bgColor="bg-[#1e9ea1]/5"
                      />
                      <InfoCard
                        icon={Phone}
                        title="Hotline bảo mật"
                        description="1900-1234 — hỗ trợ 24/7 cho các vấn đề khẩn cấp."
                        bgColor="bg-blue-50"
                        iconColor="text-blue-600"
                      />
                    </div>

                    <div className="bg-gradient-to-r from-[#1e9ea1]/5 to-blue-50 border border-[#1e9ea1]/20 p-5 rounded-xl">
                      <h4 className="font-semibold text-[#1e9ea1] mb-2.5">
                        Báo cáo sự cố bảo mật
                      </h4>
                      <p className="text-gray-700 mb-3 text-sm md:text-base">
                        Nếu phát hiện bất kỳ sự cố bảo mật nào, vui lòng liên hệ
                        ngay với chúng tôi. Chúng tôi cam kết điều tra và xử lý
                        trong vòng 72 giờ.
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="bg-white px-3.5 py-2 rounded-lg text-sm font-medium text-[#1e9ea1] border border-[#1e9ea1]/20">
                          📧 GSSuport@gmail.com
                        </span>
                        <span className="bg-white px-3.5 py-2 rounded-lg text-sm font-medium text-[#1e9ea1] border border-[#1e9ea1]/20">
                          🔒 PGP Key có sẵn
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-[#1e9ea1] via-teal-500 to-[#1e9ea1] text-white p-6 -mx-6 lg:-mx-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full mb-3">
                      <Shield className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">
                      Cam kết Bảo vệ Quyền riêng tư
                    </h3>
                    <p className="text-white/95 mb-5 max-w-2xl mx-auto text-sm md:text-base">
                      Chúng tôi không ngừng cải thiện các biện pháp bảo mật để
                      đảm bảo thông tin của bạn luôn được bảo vệ tốt nhất.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={endPoint.CONTACT}
                        className="flex items-center justify-center gap-2 bg-white text-[#1e9ea1] px-6 md:px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200"
                      >
                        <Phone className="w-5 h-5" />
                        Liên hệ hỗ trợ
                      </a>
                      <a
                        href={endPoint.FAQS}
                        className="flex items-center justify-center gap-2 border-2 border-white text-white px-6 md:px-8 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-[#1e9ea1] transition-all duration-200"
                      >
                        <HelpCircle className="w-5 h-5" />
                        FAQ bảo mật
                      </a>
                    </div>
                  </div>
                </section>
              </div>
              {/* Last updated */}
              <div className="text-center text-gray-500 text-xs md:text-sm border-t border-gray-200 py-5">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Chính sách này có hiệu lực từ ngày 08/07/2025</span>
                </div>
                <p className="mb-3 mx-4">
                  Chúng tôi có thể cập nhật chính sách bảo mật để phản ánh thay
                  đổi trong dịch vụ và pháp luật. Mọi thay đổi quan trọng sẽ
                  được thông báo trước ít nhất 30 ngày.
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] md:text-xs">
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-[#1e9ea1]" />
                    Tuân thủ GDPR
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-[#1e9ea1]" />
                    Tuân thủ CCPA
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-[#1e9ea1]" />
                    ISO 27001 Certified
                  </span>
                </div>
              </div>
              {/* Sentinel để ẩn FAB khi tới đáy layout */}
              <div ref={endRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button — ẩn khi chạm sentinel cuối layout */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={[
          "fixed bottom-5 right-5 z-40 bg-teal-600/70 text-white p-3 rounded-full shadow-lg hover:brightness-75",
          "transition-all duration-200 transform hover:scale-110",
          hideFab
            ? "opacity-0 pointer-events-none translate-y-2"
            : "opacity-100",
        ].join(" ")}
        aria-label="Back to top"
      >
        <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
      </button>

      {/* Zoom overlay */}
      {ZoomOverlay}
    </div>
  );
};

export default PrivacyPolicyPage;
