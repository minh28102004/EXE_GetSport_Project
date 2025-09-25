import React, { useState, useRef } from "react";
import { Search, Calendar, ChevronDown } from "lucide-react";
import { useClickOutside } from "@hooks/useClickOutSide";
import CalendarModal from "./calendarModal";
import { formatDateShort } from "@utils/dateFormat";
import dayjs from "dayjs";
import { courts, amenitiesList, areas } from "./data";
import CourtCard from "./CourtCard";
import Pagination from "@components/Pagination";
import MapView from "./GoogleMap/modernMapInterFace";

// ========================== Main Component ==========================
const BadmintonBooking: React.FC = () => {
  // Calendar
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [openCalendarModal, setOpenCalendarModal] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().add(i, "day");
    return {
      day: d.format("dd").toUpperCase(),
      date: d.format("DD"),
      label: i === 0 ? "Hôm nay" : i === 1 ? "Ngày mai" : d.format("ddd"),
      fullDate: d.format("YYYY-MM-DD"),
    };
  });

  // Sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showAmenitiesAll, setShowAmenitiesAll] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [showNewOnly, setShowNewOnly] = useState(true);
  const [isList, setIsList] = useState(true);
  const [selectedArea, setSelectedArea] = useState(areas[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Price Range
  const [priceRange, setPriceRange] = useState(500000);
  const [isDragging, setIsDragging] = useState(false);
  const min = 50000;
  const max = 500000;
  const step = 1000;
  const markers = [50000, 200000, 350000, 500000];

  useClickOutside(dropdownRef, () => setOpen(false));

  const handleBooking = (courtId: number) => {
    alert(`Đặt sân ${courts.find((c) => c.id === courtId)?.name}`);
  };

  const toggleAmenity = (amenity: string): void => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // ========================== Pagination ==========================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // số sân mỗi trang

  const totalPages = Math.ceil(courts.length / pageSize);
  const paginatedCourts = courts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-slate-100/60">
      <div className="mx-auto px-25 pt-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            <div className="p-4 bg-white shadow-sm w-full max-w-md mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">
                Khoảng Giá (VNĐ/giờ)
              </h3>

              <div className="relative h-8">
                {/* Track */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 -translate-y-1/2 ">
                  <div
                    className="h-1.5 bg-teal-500/90 rounded"
                    style={{
                      width: `${((priceRange - min) / (max - min)) * 100}%`,
                    }}
                  ></div>

                  {/* Markers */}
                  {markers.map((val) => (
                    <div
                      key={val}
                      className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-gray-400"
                      style={{
                        left: `${((val - min) / (max - min)) * 100}%`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Slider input */}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-auto custom-thumb"
                />

                {/* Tooltip */}
                {isDragging && (
                  <div
                    className="absolute -top-3.5 w-14 text-center text-xs font-semibold text-white bg-teal-500 rounded shadow-md pointer-events-none"
                    style={{
                      left: `calc(${
                        ((priceRange - min) / (max - min)) * 100
                      }% - 28px)`,
                    }}
                  >
                    {priceRange.toLocaleString()}₫
                  </div>
                )}
              </div>

              {/* Labels under markers */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {markers.map((val) => (
                  <span key={val}>{val.toLocaleString()}₫</span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-semibold text-gray-800/90 mb-3">
                Tiện Ích
                {selectedAmenities.length > 0 && (
                  <>
                    {" "}
                    ({selectedAmenities.length}/{amenitiesList.length})
                  </>
                )}
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-3">
                {(showAmenitiesAll ? amenitiesList : amenitiesList.slice(0, 6)) // Chỉ hiện 6 cái đầu
                  .map((amenity) => (
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
                      {amenity.icon}
                      <span className="text-gray-700">{amenity.label}</span>
                    </label>
                  ))}
              </div>

              {/* Nút Xem thêm / Thu gọn */}
              {amenitiesList.length > 6 && (
                <button
                  onClick={() => setShowAmenitiesAll(!showAmenitiesAll)}
                  className="mt-2 text-[#1e9ea1] text-sm font-medium hover:underline"
                >
                  {showAmenitiesAll ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </div>
            {/* Rating */}
            <div>
              <h3 className="font-semibold text-gray-800/90 mb-3">
                Xếp Hạng {rating > 0 ? `(${rating}/5)` : ""}
              </h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(rating === star ? 0 : star)}
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
                  <span className="text-sm text-gray-700">Sân đang mở cửa</span>
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
      hover:border-[#1bb4b7] hover:text-[#1e9ea1] hover:shadow-md
      transform transition-transform duration-200 hover:scale-[1.03]"
              >
                Đặt Lại
              </button>

              {/* Nút Áp Dụng */}
              <button
                className="flex-1 bg-gradient-to-r from-[#2ebabc] to-[#21a5a9] hover:brightness-90 text-white py-2.5 rounded-lg
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
          {/* Date Selector */}
          <div
            className={`bg-white rounded-lg shadow-sm p-6   ${
              isList ? "mb-6" : "mb-0"
            }`}
          >
            <div
              className={`flex items-center justify-between ${
                isList ? "mb-4" : "mb-0"
              }`}
            >
              <h2 className="text-3xl font-semibold text-gray-900">
                {isList ? "Danh Sách Sân Cầu Lông" : "Bản Đồ Sân Cầu Lông"}
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

            {/* Calendar Buttons */}
            {isList && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1e9ea1]" />
                  Chọn ngày
                </p>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {dates.map((date) => (
                    <button
                      key={date.date}
                      onClick={() => setSelectedDate(date.fullDate)}
                      className={`flex flex-col items-center min-w-[72px] py-3 px-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
                        selectedDate === date.fullDate
                          ? "bg-gradient-to-r from-[#25b1b3] to-[#1a9498] text-white border-transparent scale-105"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#1e9ea1] hover:text-[#1e9ea1]"
                      }`}
                    >
                      <span className="text-xs font-medium">{date.day}</span>
                      <span className="text-xl font-bold">{date.date}</span>
                      <span className="text-xs">{date.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setOpenCalendarModal(true)}
                    className="flex flex-col items-center justify-center min-w-[72px] py-3 px-4 rounded-xl border border-gray-300 text-gray-600 transition-all duration-200 hover:border-[#1e9ea1] hover:text-[#1e9ea1] hover:shadow-md"
                  >
                    <Calendar className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium">Khác</span>
                  </button>
                  <CalendarModal
                    open={openCalendarModal}
                    onClose={() => setOpenCalendarModal(false)}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setOpenCalendarModal(false);
                    }}
                  />
                </div>

                {selectedDate && (
                  <p className="mt-3 text-medium text-gray-700">
                    <span className="font-medium text-[#1e9ea1]">
                      Ngày đã chọn:
                    </span>{" "}
                    {formatDateShort(selectedDate)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* List view court or Map */}
          {isList ? (
            <>
              {/* Courts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {paginatedCourts.map((court) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    onBooking={handleBooking}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={courts.length}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className=" mt-2">
              {" "}
              {/* h-4/5 = 80vh */}
              <MapView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadmintonBooking;
