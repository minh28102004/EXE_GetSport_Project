// src/data/aboutData.ts
import {
  Users,
  MapPin,
  Clock,
  Star,
  Target,
  Heart,
  Trophy,
  Smartphone,
  Calendar,
  Zap,
  Shield,
  CreditCard,
  Bell,
  Globe,
  HeartHandshake,
  Award
} from "lucide-react";

export const bannerImages = [
  "https://media.istockphoto.com/id/654106838/photo/man-playing-badminton.webp?a=1&b=1&s=612x612&w=0&k=20&c=iLNK-2hWvj4BmM4hlaQcQ1Emo8VrREHZ8fFINwzEh40=",
  "https://images.unsplash.com/photo-1659081463572-4c5903a309e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9nZXRoZXIlMjBiYWRtaW50b258ZW58MHx8MHx8fDA%3D",
  "https://media.istockphoto.com/id/2121085620/photo/badminton-sport.webp?a=1&b=1&s=612x612&w=0&k=20&c=zRZUr-AtaVuYamONcfPLzCvBojnCe4HTPL2TnbXCgOo=",
"https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9nZXRoZXJ8ZW58MHx8MHx8fDA%3D",
"https://plus.unsplash.com/premium_photo-1663050844860-548dbfcc79a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNwb3J0fGVufDB8fDB8fHww"];

export const stats = [
  {
    icon: Users,
    label: "Người dùng hoạt động",
    value: "50,000+",
    color: "text-teal-600",
  },
  {
    icon: MapPin,
    label: "Sân cầu lông",
    value: "1,200+",
    color: "text-blue-600",
  },
  {
    icon: Clock,
    label: "Giờ đặt sân",
    value: "500,000+",
    color: "text-emerald-600",
  },
  {
    icon: Star,
    label: "Đánh giá 5 sao",
    value: "4.9/5",
    color: "text-amber-600",
  },
];

export const features = [
  {
    icon: Target,
    title: "Tầm nhìn",
    description:
      "Trở thành nền tảng hàng đầu kết nối cộng đồng cầu lông Việt Nam, tạo ra một hệ sinh thái thể thao toàn diện và hiện đại.",
  },
  {
    icon: Heart,
    title: "Sứ mệnh",
    description:
      "Đem đến trải nghiệm đặt sân dễ dàng, thuận tiện và tạo cơ hội kết nối cho những người yêu thích môn cầu lông.",
  },
  {
    icon: Trophy,
    title: "Giá trị",
    description:
      "Đặt khách hàng làm trung tâm, không ngừng đổi mới và cam kết mang lại chất lượng dịch vụ tốt nhất.",
  },
];

export const appFeatures = [
  {
    icon: Smartphone,
    title: "Đặt sân nhanh chóng",
    description:
      "Chỉ với 3 bước đơn giản: Chọn sân → Chọn giờ → Thanh toán. Hoàn tất trong vòng 30 giây!",
    image: "📱",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Tìm đối thủ & đồng đội",
    description:
      "Hệ thống AI thông minh giúp kết nối với những người chơi cùng trình độ và sở thích.",
    image: "🤝",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Calendar,
    title: "Quản lý lịch thi đấu",
    description:
      "Theo dõi lịch chơi, nhận thông báo và đồng bộ với Google Calendar một cách dễ dàng.",
    image: "📅",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Giải đấu & sự kiện",
    description:
      "Tham gia các giải đấu hấp dẫn, sự kiện cộng đồng và nhận phần thưởng giá trị.",
    image: "🏆",
    color: "from-yellow-500 to-orange-500",
  },
];

export const testimonials = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "Kỹ sư phần mềm",
    content:
      "Get Sport đã thay đổi hoàn toàn cách tôi chơi cầu lông. Từ việc phải gọi điện đặt sân đến giờ chỉ cần 1 cú chạm!",
    rating: 5,
    avatar: "👨‍💻",
  },
  {
    name: "Lê Thị Hoa",
    role: "Giáo viên",
    content:
      "Tính năng tìm đối thủ thật tuyệt vời! Tôi đã kết bạn với nhiều người cùng đam mê và trình độ tương đương.",
    rating: 5,
    avatar: "👩‍🏫",
  },
  {
    name: "Trần Văn Đức",
    role: "Doanh nhân",
    content:
      "Quản lý lịch thi đấu rất tiện lợi. Tôi có thể sắp xếp thời gian chơi hiệu quả hơn nhiều!",
    rating: 5,
    avatar: "👨‍💼",
  },
];

export const timeline = [
  {
    year: "2020",
    title: "Khởi đầu",
    desc: "Ý tưởng ra đời từ nhu cầu thực tế của cộng đồng cầu lông",
    icon: "🚀",
    highlight: "Nghiên cứu thị trường",
  },
  {
    year: "2021",
    title: "Phát triển",
    desc: "Xây dựng nền tảng và kết nối 100 sân đầu tiên",
    icon: "💻",
    highlight: "MVP ra mắt",
  },
  {
    year: "2022",
    title: "Mở rộng",
    desc: "Vươn ra 20+ tỉnh thành với 500+ sân cầu lông",
    icon: "🌍",
    highlight: "Series A funding",
  },
  {
    year: "2023",
    title: "Đổi mới",
    desc: "Ra mắt tính năng AI matching và hệ thống đánh giá thông minh",
    icon: "🤖",
    highlight: "AI Integration",
  },
  {
    year: "2024",
    title: "Dẫn đầu",
    desc: "Trở thành nền tảng #1 về đặt sân cầu lông tại Việt Nam",
    icon: "👑",
    highlight: "Market Leader",
  },
];

export const benefits = [
  {
    icon: Zap,
    title: "Nhanh chóng",
    desc: "Chỉ với vài thao tác đơn giản, bạn có thể đặt sân cầu lông mọi lúc, mọi nơi. Hệ thống hiển thị đầy đủ thông tin về giá, khung giờ trống và các tiện ích sẵn có của sân.",
    highlight: "Tiết kiệm tối đa thời gian",
  },
  {
    icon: Shield,
    title: "Bảo mật",
    desc: "Thanh toán an toàn tuyệt đối với công nghệ bảo mật hiện đại, chuẩn SSL. Tất cả giao dịch đều được mã hóa và bảo vệ nghiêm ngặt, mang đến sự yên tâm cho người dùng.",
    highlight: "Chuẩn SSL & bảo mật cao",
  },
  {
    icon: Clock,
    title: "24/7",
    desc: "Đội ngũ hỗ trợ khách hàng hoạt động 24/7, sẵn sàng giải đáp mọi thắc mắc và xử lý sự cố ngay lập tức, đảm bảo trải nghiệm của bạn luôn suôn sẻ.",
    highlight: "Luôn có mặt khi bạn cần",
  },
  {
    icon: CreditCard,
    title: "Đa dạng",
    desc: "Tích hợp nhiều hình thức thanh toán tiện lợi: ví điện tử, thẻ ngân hàng, COD… phù hợp với nhu cầu và thói quen của mọi người dùng.",
    highlight: "Ví điện tử, thẻ, COD",
  },
  {
    icon: Bell,
    title: "Thông báo",
    desc: "Hệ thống nhắc nhở thông minh giúp bạn không bỏ lỡ bất kỳ trận đấu nào. Tự động gửi thông báo về lịch đặt sân, lịch thi đấu hoặc sự kiện thể thao quan trọng.",
    highlight: "Không lo trễ hẹn",
  },
  {
    icon: Globe,
    title: "Toàn quốc",
    desc: "Mạng lưới sân cầu lông phủ sóng khắp 63 tỉnh thành, dễ dàng kết nối cộng đồng yêu thể thao ở mọi nơi bạn đến, dù là thành phố lớn hay thị trấn nhỏ.",
    highlight: "Kết nối mọi nơi bạn đến",
  },
];

export const mainBenefits = [
  {
    icon: Clock,
    title: 'Đặt Sân 24/7',
    desc: 'Đặt sân mọi lúc, mọi nơi',
    details: 'Hệ thống hoạt động liên tục, cho phép bạn đặt sân bất cứ lúc nào trong ngày. Không bao giờ bỏ lỡ cơ hội chơi thể thao yêu thích.',
    color: 'from-teal-600 to-cyan-500',
    stats: '24/7'
  },
  {
    icon: MapPin,
    title: 'Vị Trí Thuận Tiện',
    desc: 'Hơn 1000+ sân trên toàn quốc',
    details: 'Mạng lưới sân rộng khắp với vị trí thuận tiện, gần khu dân cư, văn phòng và trường học. Luôn có sân gần bạn nhất.',
    color: 'from-teal-600 to-cyan-500',
    stats: '1000+'
  },
  {
    icon: CreditCard,
    title: 'Thanh Toán Linh Hoạt',
    desc: 'Nhiều phương thức thanh toán',
    details: 'Hỗ trợ đa dạng phương thức: thẻ tín dụng, ví điện tử, chuyển khoản ngân hàng. An toàn, nhanh chóng và tiện lợi.',
    color: 'from-cyan-600 to-teal-500',
    stats: '100%'
  },
  {
    icon: Shield,
    title: 'Bảo Mật Tuyệt Đối',
    desc: 'Thông tin được bảo vệ an toàn',
    details: 'Áp dụng công nghệ mã hóa SSL 256-bit và tiêu chuẩn bảo mật quốc tế. Thông tin cá nhân và thanh toán được bảo vệ tối đa.',
    color: 'from-teal-500 to-cyan-600',
    stats: 'SSL'
  },
  {
    icon: Users,
    title: 'Cộng Đồng Sôi Động',
    desc: 'Kết nối với người chơi cùng sở thích',
    details: 'Tham gia cộng đồng hơn 100K người yêu thể thao. Bạn có thể dễ dàng tìm bạn chơi phù hợp, cùng tham gia giải đấu hấp dẫn và chia sẻ đam mê mọi lúc, mọi nơi.',
    color: 'from-cyan-500 to-teal-600',
    stats: '100K+'
  },
  {
    icon: Star,
    title: 'Chất Lượng Đảm Bảo',
    desc: 'Sân chất lượng cao, dịch vụ 5 sao',
    details: 'Tất cả sân đều được kiểm duyệt chất lượng. Trang thiết bị hiện đại, sạch sẽ và dịch vụ chăm sóc khách hàng tận tình.',
    color: 'from-teal-500 to-cyan-600',
    stats: '5⭐'
  }
];


  export const additionalFeatures = [
    {
      icon: Smartphone,
      title: 'Ứng Dụng Thông Minh',
      desc: 'AI gợi ý sân phù hợp với sở thích của bạn'
    },
    {
      icon: HeartHandshake,
      title: 'Chăm Sóc Khách Hàng',
      desc: 'Đội ngũ hỗ trợ 24/7, giải quyết mọi thắc mắc'
    },
    {
      icon: Zap,
      title: 'Đặt Sân Tức Thì',
      desc: 'Chỉ 3 bước đơn giản, hoàn thành trong 30 giây'
    },
    {
      icon: Award,
      title: 'Ưu Đãi Độc Quyền',
      desc: 'Chương trình khuyến mãi cho thành viên'
    }
  ];

export const achievements = [
  { number: "2024", title: "Giải thưởng Startup của năm", icon: "🏅" },
  { number: "4.8", title: "Đánh giá trên App Store", icon: "⭐" },
  { number: "99%", title: "Độ hài lòng khách hàng", icon: "😊" },
  { number: "#1", title: "App thể thao phổ biến nhất", icon: "🚀" },
];
