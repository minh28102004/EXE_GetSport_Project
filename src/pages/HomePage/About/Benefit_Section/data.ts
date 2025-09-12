import {
  Users,
  MapPin,
  Clock,
  Star,
  Shield,
  CreditCard,
  Gift,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Benefit {
  icon: LucideIcon;
  title: string;
  details: string;
  color: string;
  stats: string;
}

export const mainBenefits: Benefit[] = [
  {
    icon: Clock,
    title: "Đặt Sân 24/7",
    details:
      "Hệ thống vận hành liên tục, cho phép bạn đặt sân vào bất kỳ thời điểm nào trong ngày. Không bỏ lỡ cơ hội tận hưởng thể thao yêu thích.",
    color: "from-teal-600 to-cyan-500",
    stats: "24/7",
  },
  {
    icon: MapPin,
    title: "Vị Trí Thuận Tiện",
    details:
      "Mạng lưới sân rộng khắp, gần khu dân cư, văn phòng và trường học. Luôn có sân gần bạn để tham gia chơi thể thao bất cứ lúc nào.",
    color: "from-teal-600 to-cyan-500",
    stats: "1000+",
  },
  {
    icon: CreditCard,
    title: "Thanh Toán Linh Hoạt",
    details:
      "Hỗ trợ đa dạng hình thức: thẻ tín dụng, ví điện tử và chuyển khoản ngân hàng. Giao dịch an toàn, nhanh chóng, mang lại trải nghiệm tiện lợi.",
    color: "from-cyan-600 to-teal-500",
    stats: "100%",
  },
  {
    icon: Shield,
    title: "Bảo Mật Tuyệt Đối",
    details:
      "Ứng dụng công nghệ mã hóa SSL 256-bit cùng tiêu chuẩn bảo mật quốc tế. Mọi dữ liệu cá nhân và thanh toán luôn được giữ kín tuyệt đối.",
    color: "from-teal-500 to-cyan-600",
    stats: "SSL",
  },
  {
    icon: Users,
    title: "Cộng Đồng Sôi Động",
    details:
      "Gia nhập cộng đồng hơn 100K người yêu thể thao. Tìm bạn chơi phù hợp, tham gia giải đấu và chia sẻ niềm đam mê sôi nổi mỗi ngày.",
    color: "from-cyan-500 to-teal-600",
    stats: "100K+",
  },
  {
    icon: Star,
    title: "Chất Lượng Đảm Bảo",
    details:
      "Tất cả sân đều được kiểm duyệt kỹ lưỡng với trang thiết bị hiện đại, không gian sạch sẽ và đội ngũ hỗ trợ tận tâm, chuyên nghiệp.",
    color: "from-teal-500 to-cyan-600",
    stats: "5⭐",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ Nhanh",
    details:
      "Đội ngũ chăm sóc khách hàng phản hồi tức thì qua hotline và chat trực tuyến. Luôn sẵn sàng hỗ trợ tận tình mọi lúc bạn cần.",
    color: "from-teal-600 to-cyan-600",
    stats: "24/7",
  },
  {
    icon: Gift,
    title: "Ưu Đãi Thành Viên",
    details:
      "Thành viên thân thiết nhận ưu đãi đặc biệt: giảm giá đặt sân, nhận voucher khuyến mãi và cơ hội tham gia nhiều sự kiện độc quyền.",
    color: "from-cyan-600 to-teal-500",
    stats: "VIP",
  },
  // {
  //   icon: Trophy,
  //   title: "Giải Đấu Thú Vị",
  //   details:
  //     "Thường xuyên tổ chức các giải đấu thể thao quy mô lớn nhỏ, mang đến cơ hội tranh tài, kết nối và khẳng định kỹ năng của bạn.",
  //   color: "from-yellow-500 to-orange-500",
  //   stats: "🔥",
  // },
  // {
  //   icon: Dumbbell,
  //   title: "Huấn Luyện Chuyên Nghiệp",
  //   details:
  //     "Hợp tác cùng các huấn luyện viên giàu kinh nghiệm, hỗ trợ bạn nâng cao kỹ năng và cải thiện phong độ trong thời gian ngắn.",
  //   color: "from-purple-500 to-indigo-500",
  //   stats: "Pro",
  // },
  // {
  //   icon: Smartphone,
  //   title: "Ứng Dụng Thông Minh",
  //   details:
  //     "Trải nghiệm đặt sân dễ dàng qua ứng dụng di động hiện đại. Quản lý lịch chơi, thanh toán và nhận thông báo chỉ với một chạm.",
  //   color: "from-pink-500 to-rose-500",
  //   stats: "App",
  // },
  // {
  //   icon: CalendarCheck,
  //   title: "Lịch Trình Linh Hoạt",
  //   details:
  //     "Chủ động đặt sân theo giờ phù hợp. Hệ thống tự động nhắc nhở và hỗ trợ thay đổi lịch trình nhanh chóng khi có nhu cầu.",
  //   color: "from-green-500 to-emerald-500",
  //   stats: "✔",
  // },
];
