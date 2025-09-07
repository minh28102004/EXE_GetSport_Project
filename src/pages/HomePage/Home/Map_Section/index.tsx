import React from "react";
import { Search, MapPin } from "lucide-react";
import { popularCourts } from "./data";
import type { Court } from "./data";

// Sub-component: Court status badge
const CourtStatusBadge = ({ status }: { status: Court["status"] }) => {
  const baseClasses =
    "px-2 py-1 rounded-full text-xs font-medium transition-colors";
  const statusClasses =
    status === "Trống"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

// Main component
const MapSection = () => {
  return (
    <section className="py-12 sm:py-18 bg-gradient-to-br from-[#f0fdfa] to-[#e6fffa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Bản Đồ Các Sân Cầu Lông
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các sân cầu lông gần bạn với bản đồ tương tác. Dễ dàng tìm
            kiếm và đặt sân phù hợp nhất.
          </p>
        </div>

        {/* Map card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm"
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none w-64"
                  />
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span>Sân trống</span>
                  <div className="w-4 h-4 bg-gray-400 rounded-full ml-4" />
                  <span>Đã đặt</span>
                </div>
              </div>

              {/* My location */}
              <button className="px-3 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Vị trí của tôi
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="relative h-96 sm:h-[28rem]">
            <iframe
              title="Bản đồ sân cầu lông"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502219778061!2d106.700423!3d10.772215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzIwLjAiTiAxMDbCsDQyJzAxLjUiRQ!5e0!3m2!1svi!2s!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-b-3xl"
            />

            {/* Overlay courts */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-xs">
              <h4 className="font-semibold text-gray-900 mb-3">
                Sân Phổ Biến Gần Đây
              </h4>
              <div className="space-y-2">
                {popularCourts.map((court) => (
                  <div
                    key={court.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-medium text-sm">{court.name}</div>
                      <div className="text-xs text-gray-500">
                        {court.distance}
                      </div>
                    </div>
                    <CourtStatusBadge status={court.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
