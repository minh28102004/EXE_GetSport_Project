export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  role: string;
  avatar: string;
  datePosted: string;
  timePosted: string;
  isVerified: boolean;
  likes: number;
  location: string;
  experienceYears?: number;
  imageUrl?: string;
}

export const reviews: Review[] = [
    {
      id: 1,
      rating: 5,
      comment:
       `"Hệ thống đặt sân rất dễ sử dụng và tiện lợi. Tôi có thể đặt sân bất cứ lúc nào và nhận được xác nhận ngay lập tức. Đây là cách tuyệt vời để quản lý thời gian chơi cầu lông của tôi."`,
      author: "Nguyễn Thành",
      role: "Người chơi thường xuyên",
      avatar: "NT",
      datePosted: "2024-08-15",
      timePosted: "14:30",
      isVerified: true,
      likes: 24,
      location: "TP.HCM",
      experienceYears: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=400",
    },
    {
      id: 2,
      rating: 4.5,
      comment:
        `"Tính năng xem lịch sân theo thời gian thực giúp tôi dễ dàng tìm được khung giờ trống. Giao diện trực quan và thân thiện với người sử dụng. Tôi đặc biệt thích tính năng nhắc nhở tự động."`,
      author: "Trần Hương",
      role: "CLB Cầu lông HCM",
      avatar: "TH",
      datePosted: "2024-08-22",
      timePosted: "09:15",
      isVerified: true,
      likes: 31,
      location: "TP.HCM",
      experienceYears: 8,
    },
    {
      id: 3,
      rating: 5,
      comment:
       `"Tôi tổ chức giải đấu cầu lông hàng tháng và hệ thống này giúp tôi quản lý việc đặt sân rất hiệu quả. Khả năng xem trước tình trạng sân và đặt trước nhiều ngày là điểm cộng lớn."`,
      author: "Lê Minh",
      role: "Huấn luyện viên",
      avatar: "LM",
      datePosted: "2024-08-28",
      timePosted: "16:45",
      isVerified: true,
      likes: 18,
      location: "Hà Nội",
      experienceYears: 12,
    },
  ]