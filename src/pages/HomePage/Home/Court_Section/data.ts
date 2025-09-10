export type FeatureType =
  | "Điều hòa"
  | "Bãi đỗ xe"
  | "WiFi"
  | "Căn tin"
  | "Phòng tắm"
  | "Phòng thay đồ"
  | "Cửa hàng";

export interface FeaturedCourt {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: string;
  openHours: string;
  image: string;
features: FeatureType[]; 
  status: "Đang mở cửa" | "Đã đóng cửa"; // chỉ 2 trạng thái
  totalCourts: number;
  availableCourts: number;
  isVerified: boolean;
  specialOffer?: string; // có thể có hoặc không
}

export const featuredCourts: FeaturedCourt[] = [
    {
      id: 1,
      name: "Sân Cầu Lông Thành Công",
      location: "Quận Đống Đa, Hà Nội",
      rating: 4.8,
      reviews: 256,
      priceRange: "150.000đ/giờ",
      openHours: "06:00 - 22:00",
      image:
        "https://media.istockphoto.com/id/968826044/vi/anh/b%C3%A0n-tay-h%E1%BB%8Dc-sinh-c%E1%BA%A7m-b%C3%BAt-vi%E1%BA%BFt-l%C3%A0m-b%C3%A0i-ki%E1%BB%83m-tra.jpg?s=612x612&w=0&k=20&c=bCfjElpYNs5BETAQxD1QkzoMwHh5l1aL5KxXWaVkHFU=",
      features: ["Điều hòa", "Bãi đỗ xe", "WiFi", "Căn tin", "Phòng tắm"],
      status: "Đang mở cửa",
      totalCourts: 8,
      availableCourts: 3,
      isVerified: true,
      specialOffer: "Giảm 20% booking online",
    },
    {
      id: 2,
      name: "Sân Cầu Lông Olympia",
      location: "Quận Cầu Giấy, Hà Nội",
      rating: 4.9,
      reviews: 189,
      priceRange: "250.000đ/giờ",
      openHours: "05:30 - 22:30",
      image:
        "https://qvbadminton.com/wp-content/uploads/2024/07/san-cau-long-quoc-viet-badminton-9.jpg",
      features: ["Điều hòa", "Bãi đỗ xe", "WiFi", "Căn tin", "Phòng thay đồ"],
      status: "Đang mở cửa",
      totalCourts: 12,
      availableCourts: 7,
      isVerified: true,
      specialOffer: "Tặng nước miễn phí",
    },
    {
      id: 3,
      name: "Sân Cầu Lông Victory",
      location: "Quận Hai Bà Trưng, Hà Nội",
      rating: 4.7,
      reviews: 143,
      priceRange: "180.000đ/giờ",
      openHours: "06:00 - 23:00",
      image:
        "https://static.fbshop.vn/wp-content/media-old/uploads/2019/03/tham-cau-long-tinsue-bsc-750.png",
      features: ["Điều hòa", "Bãi đỗ xe", "WiFi", "Phòng tắm"],
      status: "Đang mở cửa",
      totalCourts: 6,
      availableCourts: 2,
      isVerified: true,
      specialOffer: "Combo 3 giờ giảm 15%",
    },
    {
      id: 4,
      name: "Arena Sports Complex",
      location: "Quận Ba Đình, Hà Nội",
      rating: 4.6,
      reviews: 298,
      priceRange: "220.000đ/giờ",
      openHours: "05:00 - 23:30",
      image:
        "https://sanbaokim.com/upload/baiviet/thamsancaulongkhongthethieuchocacnhathidau01-4710.png",
      features: [
        "Điều hòa",
        "Bãi đỗ xe",
        "WiFi",
        "Căn tin",
        "Phòng thay đồ",
        "Cửa hàng",
      ],
      status: "Đang mở cửa",
      totalCourts: 15,
      availableCourts: 9,
      isVerified: true,
      specialOffer: "Happy Hour: 14h-17h giảm 30%",
    },
    {
      id: 5,
      name: "Golden Badminton Club",
      location: "Quận Thanh Xuân, Hà Nội",
      rating: 4.5,
      reviews: 167,
      priceRange: "190.000đ/giờ",
      openHours: "06:30 - 22:00",
      image:
        "https://qvbadminton.com/wp-content/uploads/2024/07/san-cau-long-quoc-viet-badminton-12.jpg",
      features: ["Điều hòa", "Bãi đỗ xe", "WiFi", "Phòng tắm"],
      status: "Đang mở cửa",
      totalCourts: 10,
      availableCourts: 4,
      isVerified: true,
      specialOffer: "Thành viên VIP giảm 25%",
    },
  ];