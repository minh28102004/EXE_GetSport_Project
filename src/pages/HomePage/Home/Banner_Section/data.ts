import type { LucideIcon } from "lucide-react";
import { Users, MapPin, Star, Phone, Shield } from "lucide-react";

export interface Stat {
  number: string;
  label: string;
  icon: LucideIcon; // << icon là component
  color: string;
}

export const stats: Stat[] = [
  {
    number: "50K+",
    label: "Người dùng tin tưởng",
    icon: Users,
    color: "text-blue-600",
  },
  {
    number: "200+",
    label: "Sân cầu lông",
    icon: MapPin,
    color: "text-green-600",
  },
  { number: "98%", label: "Hài lòng", icon: Star, color: "text-yellow-600" },
  { number: "24/7", label: "Hỗ trợ", icon: Phone, color: "text-purple-600" },
  {
    number: "30+",
    label: "Đối tác tin cậy",
    icon: Shield,
    color: "text-teal-600",
  },
];

// đi lên 3 cấp và nhận cả jpg/jpeg/png
const bannerImages = import.meta.glob<string>(
  "@images/Banner_Images/*.{jpg,jpeg,png}",
  { eager: true, import: "default" }
);

// Sắp xếp ổn định theo tên file rồi lấy URL
export const courtImageList = Object.entries(bannerImages)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

//   "https://images.unsplash.com/photo-1618548723848-1b339b8a7999?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhZG1pbnRvbiUyMGNvdXJ0fGVufDB8fDB8fHww",
//   "https://media.istockphoto.com/id/1310354398/photo/empty-badminton-court-sport-venue-without-people.webp?a=1&b=1&s=612x612&w=0&k=20&c=_kJ_Zrs207Dx34oko4QBPmY9aQZYc_eQlJNuJT6eGls=",
//   "https://plus.unsplash.com/premium_photo-1663039984787-b11d7240f592?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFkbWludG9uJTIwY291cnR8ZW58MHx8MHx8fDA%3D",
//   "https://images.unsplash.com/photo-1709587825099-f6f07e5337af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGJhZG1pbnRvbiUyMGNvdXJ0fGVufDB8fDB8fHww",
//   "https://images.unsplash.com/photo-1573078701606-41e41a8287f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA2fHxiYWRtaW50b24lMjBjb3VydHxlbnwwfHwwfHx8MA%3D%3D",
// ];
