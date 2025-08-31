import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Award,
  Phone,
  Mail,
  Shield,
  Zap,
} from "lucide-react";

const HighLightSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Search,
      title: "Tìm Kiếm Thông Minh",
      desc: "AI tìm sân phù hợp với vị trí và thời gian của bạn",
    },
    {
      icon: Calendar,
      title: "Đặt Lịch Real-time",
      desc: "Cập nhật tình trạng sân theo thời gian thực",
    },
    {
      icon: CheckCircle,
      title: "Xác Nhận Tức Thì",
      desc: "Nhận thông báo xác nhận ngay lập tức",
    },
    {
      icon: Award,
      title: "Chất Lượng Đảm Bảo",
      desc: "Hệ thống đánh giá và xếp hạng minh bạch",
    },
  ];

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Trải nghiệm đặt sân hiện đại với công nghệ AI và giao diện thân
              thiện
            </p>

            {/* Image Gallery Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                "https://images.unsplash.com/photo-1593787461539-5be8a5fdfb82?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              ].map((src, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl aspect-square hover:scale-105 transition-transform duration-500"
                >
                  <img
                    src={src}
                    alt={`Sân cầu lông ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-sm font-semibold">
                      Sân VIP {index + 1}
                    </div>
                    <div className="text-xs text-teal-200">Chất lượng cao</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index
                    ? "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-300"
                    : "bg-white"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-teal-500 text-white"
                      : "bg-teal-100 text-teal-600"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HighLightSection;
