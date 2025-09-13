import React, { useState, useRef } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Wifi,
  Car,
  Users,
  ShoppingBag,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useClickOutside } from "@hooks/useClickOutSide";

interface Area {
  value: string;
  label: string;
}

const areas: Area[] = [
  { value: "all", label: "Tất cả khu vực" },
  { value: "ba-dinh", label: "Ba Đình" },
  { value: "dong-da", label: "Đống Đa" },
  { value: "ha-dong", label: "Hà Đông" },
];

import { courts } from "./data";

const BadmintonBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("04");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "wifi",
  ]);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(true);
  const [showNewOnly, setShowNewOnly] = useState<boolean>(true);
  const [isList, setIsList] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedArea, setSelectedArea] = useState<Area>(areas[0]);
  const [open, setOpen] = useState(false);
  useClickOutside(dropdownRef, () => setOpen(false));

  const dates = [
    { day: "T6", date: "04", label: "Hôm nay" },
    { day: "T7", date: "05", label: "Ngày mai" },
    { day: "CN", date: "06", label: "Th 7" },
    { day: "T2", date: "07", label: "Th 7" },
    { day: "T3", date: "08", label: "Th 7" },
    { day: "T4", date: "09", label: "Th 7" },
    { day: "T5", date: "10", label: "Th 7" },
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleBooking = (courtId: number): void => {
    alert(`Đặt sân ${courts.find((c) => c.id === courtId)?.name}`);
  };

  const toggleAmenity = (amenity: string): void => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60">
      <div className=" mx-auto px-25 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Search */}
              <div>
                <h2 className="font-semibold text-xl text-gray-800/90 mb-3">
                  Tìm kiếm sân
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-[50%] text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tên sân hoặc địa chỉ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm hover:border-teal-500/80 focus:ring-1 focus:outline-none focus:border-teal-500/60 focus:ring-[#1e9ea1] transition-all duration-200 leading-none"
                  />
                </div>
              </div>

              {/* Area */}
              <div className="relative w-full" ref={dropdownRef}>
                <h2 className="font-semibold text-gray-800/90 mb-3">Khu Vực</h2>
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm hover:border-teal-500/80 focus:ring-1 focus:outline-none focus:ring-[#1e9ea1] transition-all"
                >
                  <span>{selectedArea.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ease-in-out ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 origin-top ${
                    open
                      ? "scale-y-100 opacity-100"
                      : "scale-y-0 opacity-0 pointer-events-none"
                  }`}
                >
                  {areas.map((area) => (
                    <div
                      key={area.value}
                      onClick={() => {
                        setSelectedArea(area);
                        setOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                        selectedArea.value === area.value
                          ? "bg-[#1e9ea1]/20 text-[#1e9ea1] font-medium"
                          : "text-gray-800"
                      }`}
                    >
                      {area.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-800/90 mb-3">
                  Khoảng Giá (VNĐ/giờ)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>50.000đ</span>
                    <span>200.000đ</span>
                    <span>500.000đ</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="10000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-gray-800/90 mb-3">
                  Tiện Ích
                </h3>
                <div className="space-y-2.5">
                  {[
                    {
                      key: "wifi",
                      label: "Wifi miễn phí",
                      icon: <Wifi className="w-4 h-4" />,
                    },
                    {
                      key: "parking",
                      label: "Phòng thay đồ",
                      icon: <Users className="w-4 h-4" />,
                    },
                    {
                      key: "shower",
                      label: "Cảng thi",
                      icon: <Car className="w-4 h-4" />,
                    },
                    {
                      key: "equipment",
                      label: "Bãi đỗ xe",
                      icon: <Car className="w-4 h-4" />,
                    },
                    {
                      key: "rental",
                      label: "Cho thuê vợt",
                      icon: <ShoppingBag className="w-4 h-4" />,
                    },
                  ].map((amenity) => (
                    <label
                      key={amenity.key}
                      className="flex items-center space-x-2 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.key)}
                        onChange={() => toggleAmenity(amenity.key)}
                        className="w-4 h-4 text-[#1e9ea1] border-gray-300 rounded focus:ring-[#1e9ea1]"
                      />
                      <span className="text-gray-700">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-gray-800/90 mb-3">
                  Xếp Hạng
                </h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-6 h-6 transform transition-all duration-200
            ${
              star <= (hoverRating || rating)
                ? "text-yellow-400 scale-110"
                : "text-gray-300"
            }
            hover:scale-125 hover:text-yellow-400`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">trở lên</span>
                </div>
              </div>

              {/* Special Options */}
              <div>
                <h3 className="font-semibold text-gray-800/90 mb-3">
                  Chỉ Hiển Thị
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">
                      Sân đang mở cửa
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showAvailableOnly}
                        onChange={(e) => setShowAvailableOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                          showAvailableOnly ? "bg-[#1e9ea1]" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            showAvailableOnly
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          } translate-y-0.5`}
                        ></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">
                      Có khung giờ trống
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showNewOnly}
                        onChange={(e) => setShowNewOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                          showNewOnly ? "bg-[#1e9ea1]" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            showNewOnly ? "translate-x-5" : "translate-x-0.5"
                          } translate-y-0.5`}
                        ></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                {/* Nút Đặt Lại */}
                <button
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm
      hover:border-[#1e9ea1] hover:text-[#1e9ea1] hover:shadow-md
      transform transition-transform duration-200 hover:scale-[1.03]"
                >
                  Đặt Lại
                </button>

                {/* Nút Áp Dụng */}
                <button
                  className="flex-1 bg-gradient-to-r from-[#1e9ea1] to-[#178a8d] text-white py-2.5 rounded-lg
      font-medium text-sm shadow-sm hover:shadow-md
      transform transition-transform duration-200 hover:scale-[1.03]"
                >
                  Áp Dụng
                </button>
              </div>

              {/* AI Button */}
              <button className="w-full bg-[#1e9ea1] text-white py-2.5 rounded-lg hover:brightness-90 font-medium">
                Sử Dụng AI Get Sport!
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Date Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Danh Sách Sân Cầu Lông
                </h2>

                {/* Title + Toggle Buttons */}
                <div className="flex items-center justify-center">
                  <div
                    className="relative flex w-44 bg-gray-100 rounded-full px-1 py-2.5 cursor-pointer select-none shadow-inner"
                    onClick={() => setIsList(!isList)}
                  >
                    {/* Nút trượt */}
                    <div
                      className={`absolute top-1 left-1 h-8 w-[calc(50%-0.2rem)] rounded-full shadow-md bg-[#1e9ea1] transition-all duration-300 ease-in-out ${
                        isList ? "translate-x-0" : "translate-x-full"
                      }`}
                    />

                    {/* Text */}
                    <div className="flex w-full z-10 text-sm font-semibold">
                      <span
                        className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
                          isList ? "text-white" : "text-gray-600"
                        }`}
                      >
                        Danh sách
                      </span>
                      <span
                        className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
                          !isList ? "text-white" : "text-gray-600"
                        }`}
                      >
                        Bản đồ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1e9ea1]" />
                    Chọn ngày
                  </p>

                  <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                    {dates.map((date) => (
                      <button
                        key={date.date}
                        onClick={() => setSelectedDate(date.date)}
                        className={`flex flex-col items-center min-w-[72px] py-3 px-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
                          selectedDate === date.date
                            ? "bg-gradient-to-r from-[#1e9ea1] to-[#178a8d] text-white border-transparent scale-105"
                            : "bg-white text-gray-600 border-gray-300 hover:border-[#1e9ea1] hover:text-[#1e9ea1]"
                        }`}
                      >
                        <span className="text-xs font-medium">{date.day}</span>
                        <span className="text-xl font-bold">{date.date}</span>
                        <span className="text-xs">{date.label}</span>
                      </button>
                    ))}

                    {/* Khác */}
                    <button className="flex flex-col items-center justify-center min-w-[72px] py-3 px-4 rounded-xl border border-gray-300 text-gray-600 transition-all duration-200 hover:border-[#1e9ea1] hover:text-[#1e9ea1] hover:shadow-md">
                      <Calendar className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium">Khác</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Courts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  {/* Court Image */}
                  <div className="relative">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {court.isNewlyOpened && (
                      <div className="absolute top-3 left-3 bg-[#1e9ea1] text-white px-2 py-1 rounded text-xs font-medium">
                        Đang mở cửa
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{court.rating}</span>
                      <span className="text-gray-500">
                        ({court.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Court Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#1e9ea1] transition-colors">
                      {court.name}
                    </h3>

                    <div className="flex items-start gap-1 text-gray-600 mb-3">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="text-xs leading-tight">
                        {court.address}
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        <span>Wifi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Phòng thay đồ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>Cảng thi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span>Bãi đỗ xe</span>
                      </div>
                    </div>

                    {/* Price and Book */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-[#1e9ea1]">
                          {formatPrice(court.price)}
                        </span>
                        <span className="text-xs text-gray-500">/giờ</span>
                      </div>
                      <button
                        onClick={() => handleBooking(court.id)}
                        className="bg-[#1e9ea1] text-white px-4 py-2 rounded-lg hover:bg-[#178a8d] transition-all duration-200 text-sm font-medium"
                      >
                        Đặt Ngay
                      </button>
                    </div>

                    {/* Time Slots */}
                    <div className="flex flex-wrap gap-1">
                      {court.availableSlots.slice(0, 7).map((slot, index) => (
                        <button
                          key={slot}
                          className={`px-2 py-1 text-xs rounded border transition-colors duration-200 ${
                            index < 2
                              ? "bg-red-50 text-red-600 border-red-200"
                              : index < 4
                              ? "bg-orange-50 text-orange-600 border-orange-200"
                              : index < 6
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-[#1e9ea1] text-white border-[#1e9ea1]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadmintonBooking;
