import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, DollarSign, Tag, XCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import {
  useGetMyCourtBookingsQuery,
  useDeleteCourtBookingMutation,
} from "@redux/api/booking/courtBookingApi";
import { selectToken } from "@redux/features/auth/authSlice";
import { getUserIdFromToken } from "@/utils/jwt";
import type { CourtBooking, CourtBookingFilterParams } from "@redux/api/booking/type";
import dayjs from "dayjs";

const BookingHistory: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const userId = getUserIdFromToken(token);

  const [filterParams, setFilterParams] = useState<CourtBookingFilterParams>({
    page: 1,
    pageSize: 10,
    sortBy: "bookingDate",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching, error, refetch } = useGetMyCourtBookingsQuery(
    filterParams,
    {
      skip: !userId || !token,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [deleteCourtBooking] = useDeleteCourtBookingMutation();

  const bookings = Array.isArray(data?.data)
    ? data.data
    : (data?.data as any)?.items || [];

  const totalPages = (data?.data as any)?.totalPages || 1;

  // Track which booking is being canceled
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  // Debugging logs
  useEffect(() => {
    console.log("BookingHistory Debug:", { token, userId, data, error, bookings, cancelingId });
  }, [token, userId, data, error, bookings, cancelingId]);

  // Handle no token or userId
  if (!token || !userId) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-500 text-lg">Vui lòng đăng nhập để xem lịch sử đặt sân.</p>
          <button
            onClick={() => (window.location.href = "/auth?view=login&redirect=/booking-history")}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  // Handle API error
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-500 text-lg">
            {(error as any)?.data?.message || "Lỗi khi tải lịch sử đặt sân. Vui lòng thử lại."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <LoadingSpinner size="12" />
          <p className="text-center mt-2 text-gray-500">Đang tải lịch sử đặt sân…</p>
        </div>
      </div>
    );
  }

  // Format price
  const formatPrice = (amount: number): string =>
    new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  // Format date and time
  const formatDate = (date: Date): string => dayjs(date).format("DD/MM/YYYY");
  const formatTime = (date: Date): string => dayjs(date).format("HH:mm");

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đặt sân này?")) return;

    setCancelingId(bookingId);
    try {
      await deleteCourtBooking(bookingId).unwrap();
      toast.success("Hủy đặt sân thành công!");
    } catch (e: any) {
      console.error("Cancel booking error:", e);
      toast.error(e?.data?.message || "Hủy đặt sân thất bại. Vui lòng thử lại.");
    } finally {
      setCancelingId(null);
    }
  };

  // Handle view detail
  const handleViewDetail = (bookingId: number) => {
    navigate(`/booking-detail/${bookingId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#23AEB1]" />
          Lịch Sử Đặt Sân
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            Bạn chưa có lịch sử đặt sân.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Booking List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-sm font-semibold text-gray-700">Sân</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Ngày Đặt</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Khung Giờ</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Số Tiền</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Mã Giảm Giá</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Trạng Thái</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: CourtBooking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {booking.courtLocation || "—"}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(booking.bookingDate)}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          {booking.discountedAmount
                            ? `${formatPrice(booking.discountedAmount)} (Giảm ${booking.discountPercent}%)`
                            : formatPrice(booking.amount)}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          {booking.voucherCode || "—"}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex gap-2">
                          {booking.status === "PENDING" && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isDeleting && cancelingId === booking.id}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-all duration-200 flex items-center gap-1 disabled:opacity-70"
                            >
                              {isDeleting && cancelingId === booking.id ? (
                                <LoadingSpinner inline size="4" color="red" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              Hủy
                            </button>
                          )}
                          <button
                            onClick={() => handleViewDetail(booking.id)}
                            className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-200 transition-all duration-200 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Chi Tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filterParams.page === page
                        ? "bg-[#23AEB1] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isFetching && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
            <LoadingSpinner inline size="4" />
            <span className="text-sm text-gray-600">Đang đồng bộ dữ liệu…</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookingHistory;