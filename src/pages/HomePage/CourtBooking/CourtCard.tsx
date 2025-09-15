import { MapPin, Star } from "lucide-react";
import { amenitiesList } from "./data";
import type { Amenity, Court } from "./data";

interface CourtCardProps {
  court: Court;
  onBooking: (id: number) => void;
}

// ========================== Utils ==========================
const formatPrice = (price: number): string =>
  new Intl.NumberFormat("vi-VN").format(price);

const CourtCard: React.FC<CourtCardProps> = ({ court, onBooking }) => {
  // Map amenities key sang object {label, icon}
  const getAmenity = (key: string): Amenity | undefined =>
    amenitiesList.find((item) => item.key === key);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-700 border border-gray-100">
      {/* Court Image */}
      <div className="relative overflow-hidden">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-40 object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {court.isNewlyOpened && (
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg">
              Đang mở cửa
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="font-medium text-sm">{court.rating}</span>
          <span className="text-gray-500 text-xs">({court.reviewCount})</span>
        </div>
      </div>

      {/* Court Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">
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
                  className="flex items-center gap-1 text-gray-600 text-xs bg-gray-50 px-2 py-1 rounded-md "
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
          <div className="text-lg font-semibold text-teal-600">
            {formatPrice(court.price)}{" "}
            <span className="text-xs text-gray-500">/giờ</span>
          </div>
          <button
            onClick={() => onBooking(court.id)}
            className="px-3 py-1 bg-gradient-to-br from-[#35b6b8] to-[#1e9ea1] text-white font-medium rounded-lg 
             flex items-center justify-center gap-1 
             transition-transform duration-200 transform hover:scale-[1.02] hover:brightness-90"
          >
            Đặt Ngay
          </button>
        </div>

        {/* Slots */}
        <div className="flex gap-1 mt-3 overflow-hidden whitespace-nowrap justify-center">
          {court.availableSlots.length <= 6 ? (
            // Nếu ≤ 6 slot, hiển thị tất cả
            court.availableSlots.map((slot, index) => (
              <button
                key={slot}
                className={`px-2 py-1 text-xs rounded border flex-shrink-0 transition-colors duration-200 ${
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
            // Nếu > 6 slot → hiển thị 2 đầu + ... + slot cuối
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
                key={court.availableSlots[court.availableSlots.length - 1]}
                className="px-2 py-1 text-xs rounded border bg-green-50 text-green-600 border-green-200 flex-shrink-0"
              >
                {court.availableSlots[court.availableSlots.length - 1]}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
