import React, { useMemo } from "react";
import { Star, MapPin } from "lucide-react";
import { useGetCourtsQuery } from "@redux/api/court/courtApi";
import { amenitiesList, type Amenity } from "../../CourtBooking/data";
import { type Court, type Paged } from "@redux/api/court/type";
import endPoint from "@routes/router";

const CourtSection: React.FC = () => {
  const listParams = useMemo(
    () => ({
      status: "Approved",
      sortBy: "priority",
      sortOrder: "desc",
      page: 1,
      pageSize: 4,
    }),
    []
  );

  const { data: courtData, isLoading, isError } = useGetCourtsQuery(listParams);
  const courtsFromApi: Court[] = useMemo(() => {
    console.log("Court data:", courtData); // Debugging
    return courtData?.data
      ? Array.isArray(courtData.data)
        ? courtData.data
        : (courtData.data.items || [])
      : [];
  }, [courtData]);

  const getAmenity = (key: string): Amenity | undefined =>
    amenitiesList.find((a) => a.key === key);

  const formatPrice = (price: number) => price.toLocaleString("vi-VN");

  const onBooking = (courtId: number) => {
    console.log("Booking court:", courtId);
    window.location.href = `Court/detail/${courtId}`;
  };

  return (
    <section className="pt-12 pb-8 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-teal-50 relative overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-2 leading-tight">
            Sân Cầu Lông Nổi Bật
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá những sân cầu lông chất lượng cao, được đánh giá tốt nhất
            bởi cộng đồng người chơi.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center text-gray-600">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-[#1e9ea1]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              ></path>
            </svg>
            <p className="mt-2">Đang tải sân...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center text-red-500">
            Lỗi khi tải danh sách sân. Vui lòng thử lại.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && courtsFromApi.length === 0 && (
          <div className="text-center text-gray-600">
            Không tìm thấy sân nào.
          </div>
        )}

        {/* Cards Container */}
        {!isLoading && !isError && courtsFromApi.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {courtsFromApi.slice(0, 4).map((court: Court) => (
              <div
                key={court.id}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transform transition duration-500 ease-in-out hover:scale-[1.02]"
              >
                {/* Court Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={court.imageUrls[0] || "https://via.placeholder.com/300x200"}
                    alt={court.name || `Sân cầu lông ${court.id}`}
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {court.isActive && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                        Đang mở cửa
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="font-medium text-sm">{court.averageRating}</span>
                    <span className="text-gray-500 text-xs">({court.totalFeedbacks})</span>
                  </div>
                </div>

                {/* Court Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">
                    {court.name || `Sân cầu lông ${court.id}`}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm line-clamp-1">{court.location || "Không xác định"}</span>
                  </div>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold text-teal-600">
                      {formatPrice(court.pricePerHour)}{" "}
                      <span className="text-xs text-gray-500">/giờ</span>
                    </div>
                    <button
                      onClick={() => onBooking(court.id)}
                      className="px-3 py-1 bg-gradient-to-br from-[#35b6b8] to-[#1e9ea1] text-white text-b font-medium rounded-lg flex items-center justify-center gap-1 transition-transform duration-200 transform hover:scale-[1.02] hover:brightness-90"
                    >
                      Đặt Ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href={endPoint.COURTBOOKING}
            className="group inline-flex items-center gap-1 px-3 py-1.5 border-2 border-teal-200 text-teal-600 rounded-xl font-medium hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            Xem Thêm Sân Cầu Lông
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CourtSection;