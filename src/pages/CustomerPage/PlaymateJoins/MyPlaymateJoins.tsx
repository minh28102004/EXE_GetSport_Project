import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash 
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import {
  useGetMyPlaymateJoinsQuery,
  useDeletePlaymateJoinMutation,
} from "@redux/api/playmateJoin/playmateJoinApi";
import { selectToken } from "@redux/features/auth/authSlice";
import type { PlaymateJoin, PlaymateJoinFilterParams } from "@redux/api/playmateJoin/type";
import dayjs from "dayjs";

const MyPlaymateJoins: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [filterParams, setFilterParams] = useState<PlaymateJoinFilterParams>({
    page: 1,
    pageSize: 10,
    sortBy: "joinedAt",
    sortOrder: "desc",
    startJoinedDate: undefined,
    endJoinedDate: undefined,
    search: "",
  });

  // API queries
  const { 
    data, 
    isLoading, 
    isFetching, 
    error, 
    refetch 
  } = useGetMyPlaymateJoinsQuery(filterParams, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [deleteJoin] = useDeletePlaymateJoinMutation();

  // Data extraction
  const joins = Array.isArray(data?.data)
    ? data.data
    : (data?.data as any)?.items || [];
  
  const totalPages = (data?.data as any)?.totalPages || 1;
  const totalCount = (data?.data as any)?.totalCount || 0;

  // Handle no token
  if (!token) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md mx-auto">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem các lượt tham gia tìm bạn chơi.</p>
          <button
            onClick={() => navigate("/auth?view=login&redirect=/customerlayout/playmate-joins")}
            className="px-6 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Users className="w-4 h-4" />
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  // Handle API error
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md mx-auto">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">
            {(error as any)?.data?.message || "Có lỗi xảy ra khi tải lượt tham gia. Vui lòng thử lại."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
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
      <div className="max-w-6xl mx-auto p-10 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-2xl mx-auto">
          <LoadingSpinner size="12" />
          <p className="text-center mt-4 text-gray-600">Đang tải lượt tham gia...</p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDateTime = (date: string | Date): string => 
    dayjs(date).format("DD/MM/YYYY HH:mm");

  const formatDate = (date: string | Date): string => 
    dayjs(date).format("DD/MM/YYYY");

  const formatTime = (time: string): string => 
    dayjs(time, "HH:mm:ss").format("HH:mm");

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilterParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilterParams((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  // Handle date range
  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    setFilterParams((prev) => ({
      ...prev,
      startJoinedDate: startDate || undefined,
      endJoinedDate: endDate || undefined,
      page: 1,
    }));
  };

  // Handle delete join
  const handleDeleteJoin = async (joinId: number, postTitle: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy tham gia bài đăng "${postTitle}"?`)) {
      return;
    }

    try {
      await deleteJoin(joinId).unwrap();
      toast.success("Hủy tham gia thành công!");
      refetch(); // Refresh data
    } catch (e: any) {
      console.error("Delete join error:", e);
      toast.error(e?.data?.message || "Hủy tham gia thất bại. Vui lòng thử lại.");
    }
  };

  // Handle view post
  const handleViewPost = (postId: number) => {
    navigate(`/playPost/${postId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 bg-gray-50 min-h-screen">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-1">
              <Users className="w-7 h-7 text-[#23AEB1]" />
              Lượt Tham Gia Của Tôi
            </h1>
            <p className="text-gray-600">
              Quản lý các lượt tham gia tìm bạn chơi của bạn ({totalCount} lượt)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sân, chủ sân..."
                value={filterParams.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#23AEB1] focus:border-transparent bg-white shadow-sm placeholder-gray-500"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              onClick={() => setFilterParams({ page: 1, pageSize: 10, sortBy: "joinedAt", sortOrder: "desc" })}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 whitespace-nowrap"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo ngày tham gia
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterParams.startJoinedDate || ""}
                  onChange={(e) => handleDateRangeChange(e.target.value, filterParams.endJoinedDate)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23AEB1] focus:border-transparent"
                />
                <span className="self-center text-gray-400">→</span>
                <input
                  type="date"
                  value={filterParams.endJoinedDate || ""}
                  onChange={(e) => handleDateRangeChange(filterParams.startJoinedDate, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23AEB1] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={`${filterParams.sortBy || "joinedAt"}-${filterParams.sortOrder || "desc"}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  setFilterParams(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23AEB1] focus:border-transparent"
              >
                <option value="joinedAt-desc">Mới nhất</option>
                <option value="joinedAt-asc">Cũ nhất</option>
                <option value="bookingDate-desc">Ngày đặt sân (mới)</option>
                <option value="bookingDate-asc">Ngày đặt sân (cũ)</option>
                <option value="slotStartTime-desc">Giờ bắt đầu (sớm)</option>
                <option value="slotStartTime-asc">Giờ bắt đầu (muộn)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {joins.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lượt tham gia</h3>
              <p className="mb-4">Bạn chưa tham gia bài đăng tìm bạn chơi nào.</p>
              <button
                onClick={() => navigate("/playPost")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Tìm Bạn Chơi
              </button>
            </div>
          ) : (
            <>
              {/* Joins List */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-gray-700">Bài đăng</th>
                      <th className="p-4 text-sm font-semibold text-gray-700">Sân</th>
                      <th className="p-4 text-sm font-semibold text-gray-700">Thời gian</th>
                      <th className="p-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                      <th className="p-4 text-sm font-semibold text-gray-700">Tham gia</th>
                      <th className="p-4 text-sm font-semibold text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joins.map((join: PlaymateJoin) => {
                      const statusClass = getStatusColor(join.postStatus);
                      const isConfirmed = join.postStatus === "Confirmed";
                      
                      return (
                        <tr
                          key={join.id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="max-w-xs">
                              <p className="font-semibold text-sm text-gray-900 truncate" title={join.postTitle}>
                                {join.postTitle}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Cần: {join.neededPlayers} người | Hiện: {join.currentPlayers}
                              </p>
                            </div>
                          </td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {join.courtImageUrls?.[0] && (
                                <img
                                  src={join.courtImageUrls[0]}
                                  alt="Sân"
                                  className="w-10 h-10 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-medium text-sm text-gray-900" title={join.courtName}>
                                  {join.courtName}
                                </p>
                                <p className="text-xs text-gray-500 truncate" title={join.courtLocation}>
                                  {join.courtLocation}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(join.bookingDate)}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatTime(join.slotStartTime)} - {formatTime(join.slotEndTime)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Kỹ năng: {join.postSkillLevel || "Không xác định"}
                              </p>
                            </div>
                          </td>
                          
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                              {join.postStatus || "Pending"}
                            </span>
                          </td>
                          
                          <td className="p-4 text-sm text-gray-900">
                            {formatDateTime(join.joinedAt)}
                          </td>
                          
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewPost(join.postId)}
                                className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-200 transition-all duration-200 flex items-center gap-1"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-3 h-3" />
                                Xem
                              </button>
                              
                              {isConfirmed && (
                                <button
                                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-all duration-200 flex items-center gap-1"
                                  title="Đã xác nhận"
                                  disabled
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Xác nhận
                                </button>
                              )}
                              
                              {!isConfirmed && (
                                <button
                                  onClick={() => handleDeleteJoin(join.id, join.postTitle)}
                                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-all duration-200 flex items-center gap-1"
                                  title="Hủy tham gia"
                                >
                                  <Trash className="w-3 h-3" />
                                  Hủy
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 p-4">
                  <button
                    onClick={() => handlePageChange(filterParams.page - 1)}
                    disabled={filterParams.page <= 1}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Trước
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages, filterParams.page - 2 + i));
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            filterParams.page === pageNum
                              ? "bg-[#23AEB1] text-white shadow-md"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(filterParams.page + 1)}
                    disabled={filterParams.page >= totalPages}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
                  >
                    Sau
                    <Calendar className="w-4 h-4" />
                  </button>
                  
                  <span className="text-sm text-gray-600 px-3">
                    Trang {filterParams.page} / {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Loading indicator */}
        {isFetching && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl px-4 py-2 border border-gray-100 flex items-center gap-2 z-50">
            <LoadingSpinner inline size="4" />
            <span className="text-sm text-gray-600">Đang cập nhật...</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyPlaymateJoins;