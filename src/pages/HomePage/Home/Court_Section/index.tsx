import React, { useState, type JSX } from "react";
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Users,
  Wifi,
  Car,
  Zap,
  Coffee,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { featuredCourts } from "./data";
import type { FeaturedCourt, FeatureType } from "./data";

const CourtSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const featureIcons: Record<FeatureType, JSX.Element> = {
    "Điều hòa": <Zap className="w-4 h-4" />,
    "Bãi đỗ xe": <Car className="w-4 h-4" />,
    WiFi: <Wifi className="w-4 h-4" />,
    "Căn tin": <Coffee className="w-4 h-4" />,
    "Phòng tắm": <Users className="w-4 h-4" />,
    "Phòng thay đồ": <Users className="w-4 h-4" />,
    "Cửa hàng": <Coffee className="w-4 h-4" />,
  };

  const handleBooking = (featuredCourt: FeaturedCourt) => {
    alert(`Đặt sân ${featuredCourt.name}`);
  };

  return (
    <section className="py-12 sm:py-18 bg-gradient-to-br from-slate-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-15 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Sân Cầu Lông Nổi Bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá những sân cầu lông chất lượng cao, được đánh giá tốt nhất
            bởi cộng đồng người chơi.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {featuredCourts.slice(0, 4).map((court) => (
            <div
              key={court.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100"
              onMouseEnter={() => setHoveredCard(court.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={court.image}
                  alt={court.name}
                  className={`w-full h-40 object-cover transition-all duration-700 ${
                    hoveredCard === court.id ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <div className="px-2 py-1 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg">
                    Đang mở cửa
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all duration-300 hover:scale-110">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all duration-300 hover:scale-110">
                    <Share2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Special Offer */}
                {court.specialOffer && (
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-xl text-sm font-medium shadow-lg">
                      🎉 {court.specialOffer}
                    </div>
                  </div>
                )}

                {/* Verified Badge */}
                {court.isVerified && (
                  <div className="absolute bottom-4 right-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">
                  {court.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{court.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {court.rating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({court.reviews})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {court.availableCourts}/{court.totalCourts} sân trống
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {court.features.slice(0, 4).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600"
                    >
                      {featureIcons[feature]}
                      <span>{feature}</span>
                    </div>
                  ))}
                  {court.features.length > 4 && (
                    <div className="px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
                      +{court.features.length - 4}
                    </div>
                  )}
                </div>

                {/* Price & Hours */}
                <div className="space-y-2">
                  {/* Giờ mở cửa */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{court.openHours}</span>
                  </div>

                  {/* Giá + Nút đặt ngay */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-teal-600">
                      {court.priceRange}
                    </div>
                    <button
                      onClick={() => handleBooking(court)}
                      className="px-3 py-1.5 bg-gradient-to-br from-[#35b6b8] to-[#1e9ea1] text-white font-medium rounded-lg hover:brightness-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-1 group"
                    >
                      Đặt Sân Ngay
                      
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/blogPost"
            className="group inline-flex items-center gap-1 px-3 py-2 border-2 border-teal-200 text-teal-600 rounded-xl font-medium 
               hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            Xem Thêm Sân Cầu Lông
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourtSection;
