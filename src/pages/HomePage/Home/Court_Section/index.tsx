import { Star, MapPin } from "lucide-react";
import {
  courts,
  amenitiesList,
  type Court,
  type Amenity,
} from "../../CourtBooking/data";
import endPoint from "@routes/router";

const CourtSection = () => {
  const getAmenity = (key: string): Amenity | undefined =>
    amenitiesList.find((a) => a.key === key);

  const formatPrice = (price: number) => price.toLocaleString("vi-VN");

  const onBooking = (courtId: number) => {
    console.log("Booking court:", courtId);
  };

  return (
    <section className="pt-12 pb-8 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-teal-50 relative overflow-hidden">
      {/* dùng px mặc định chuẩn Tailwind (bỏ px-15 tuỳ biến) */}
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

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {courts.slice(0, 4).map((court: Court) => (
            <div
              key={court.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden
                         transform transition duration-500 ease-in-out hover:scale-[1.02]"
            >
              {/* Court Image */}
              <div className="relative overflow-hidden">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {court.isNewlyOpened && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                      Đang mở cửa
                    </span>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="font-medium text-sm">{court.rating}</span>
                  <span className="text-gray-500 text-xs">
                    ({court.reviewCount})
                  </span>
                </div>
              </div>

              {/* Court Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">
                  {court.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm line-clamp-1">{court.address}</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {court.amenities.slice(0, 4).map((amenityKey: string) => {
                    const amenity = getAmenity(amenityKey);
                    return (
                      amenity && (
                        <div
                          key={amenity.key}
                          className="flex items-center gap-1 text-gray-600 text-xs bg-gray-50 px-2 py-1 rounded-md"
                        >
                          {amenity.icon}
                          <span>{amenity.label}</span>
                        </div>
                      )
                    );
                  })}
                  {court.amenities.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{court.amenities.length - 4} nữa
                    </span>
                  )}
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-teal-600">
                    {formatPrice(court.price)}{" "}
                    <span className="text-xs text-gray-500">/giờ</span>
                  </div>
                  <button
                    onClick={() => onBooking(court.id)}
                    className="px-3 py-1 bg-gradient-to-br from-[#35b6b8] to-[#1e9ea1] text-white text-b font-medium rounded-lg
                               flex items-center justify-center gap-1
                               transition-transform duration-200 transform hover:scale-[1.02] hover:brightness-90"
                  >
                    Đặt Ngay
                  </button>
                </div>

                {/* Slots */}
                <div className="flex gap-2 mt-3 overflow-hidden whitespace-nowrap justify-center">
                  {court.availableSlots.length <= 6 ? (
                    court.availableSlots.map((slot, index) => (
                      <button
                        key={slot}
                        className={`px-1.5 py-1 text-xs rounded border flex-shrink-0 transition-colors duration-200 ${
                          index < 2
                            ? "bg-red-50 text-red-600 border-red-200"
                            : index < 4
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <>
                      {court.availableSlots.slice(0, 4).map((slot, index) => (
                        <button
                          key={slot}
                          className={`px-2 py-1 text-xs rounded border flex-shrink-0 transition-colors duration-200 ${
                            index === 0
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-orange-50 text-orange-600 border-orange-200"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                      <span className="px-1.5 py-1 text-xs text-gray-600 flex-shrink-0">
                        ...
                      </span>
                      <button
                        key={
                          court.availableSlots[court.availableSlots.length - 1]
                        }
                        className="px-2 py-1 text-xs rounded border bg-green-50 text-green-600 border-green-200 flex-shrink-0"
                      >
                        {court.availableSlots[court.availableSlots.length - 1]}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href={endPoint.COURTBOOKING}
            className="group inline-flex items-center gap-1 px-3 py-1.5 border-2 border-teal-200 text-teal-600 rounded-xl font-medium
                       hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
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
