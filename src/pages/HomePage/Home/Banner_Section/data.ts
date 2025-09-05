import type { LucideIcon } from "lucide-react";
import { Users, MapPin, Star, Phone, Shield } from "lucide-react";

export interface Stat {
  number: string;
  label: string;
  icon: LucideIcon;   // << icon là component
  color: string;
}

export const stats: Stat[] = [
  { number: "50K+", label: "Người dùng tin tưởng", icon: Users,  color: "text-blue-600" },
  { number: "200+", label: "Sân cầu lông",         icon: MapPin, color: "text-green-600" },
  { number: "98%",  label: "Hài lòng",             icon: Star,   color: "text-yellow-600" },
  { number: "24/7", label: "Hỗ trợ",               icon: Phone,  color: "text-purple-600" },
  { number: "30+",  label: "Đối tác tin cậy",      icon: Shield, color: "text-teal-600" },
];

export const courtImageList = [
  "https://images.unsplash.com/photo-1618548723848-1b339b8a7999?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhZG1pbnRvbiUyMGNvdXJ0fGVufDB8fDB8fHww",
  "https://media.istockphoto.com/id/1310354398/photo/empty-badminton-court-sport-venue-without-people.webp?a=1&b=1&s=612x612&w=0&k=20&c=_kJ_Zrs207Dx34oko4QBPmY9aQZYc_eQlJNuJT6eGls=",
  "https://plus.unsplash.com/premium_photo-1663039984787-b11d7240f592?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFkbWludG9uJTIwY291cnR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1709587825099-f6f07e5337af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGJhZG1pbnRvbiUyMGNvdXJ0fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1573078701606-41e41a8287f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA2fHxiYWRtaW50b24lMjBjb3VydHxlbnwwfHwwfHx8MA%3D%3D",
];

export const packages = [
  {
    id: "basic",
    name: "Gói Basic",
    subtitle: "Dành cho người mới",
    price: "299k",
    originalPrice: "399k",
    discount: "25%",
    color: "bg-white",
    textColor: "text-gray-900",
    features: [
      "10 lượt đặt sân/tháng",
      "Hỗ trợ 24/7",
      "Tìm kiếm cơ bản",
      "Đặt sân thường",
    ],
    badge: null,
    gradient: false,
  },
  {
    id: "premium",
    name: "Gói Premium",
    subtitle: "Lựa chọn tốt nhất",
    price: "599k",
    originalPrice: "899k",
    discount: "33%",
    color: "bg-gradient-to-r from-teal-600 to-teal-500",
    textColor: "text-white",
    features: [
      "25 lượt đặt sân/tháng",
      "Ưu tiên đặt sân VIP",
      "Miễn phí hủy booking",
      "Tư vấn chuyên nghiệp",
    ],
    badge: "PHỔ BIẾN NHẤT",
    gradient: true,
  },
  {
    id: "vip",
    name: "Gói VIP",
    subtitle: "Dành cho pro player",
    price: "999k",
    originalPrice: "1,499k",
    discount: "40%",
    color: "bg-white",
    textColor: "text-gray-900",
    features: [
      "Không giới hạn đặt sân",
      "Tư vấn huấn luyện cá nhân",
      "Quản lý lịch thi đấu",
      "Ưu tiên cao nhất",
    ],
    badge: "ƯU ĐÃI NHẤT",
    gradient: false,
    isVip: true,
  },
];


