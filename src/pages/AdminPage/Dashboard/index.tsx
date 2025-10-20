import React, { useState } from "react";
import {
  FiGrid,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiUsers,
  FiPackage,
  FiFileText,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  useGetAdminDashboardQuery,
  useGetAdminTopCourtsQuery,
  useGetAdminRecentBookingsQuery,
  useGetAdminRecentFeedbacksQuery,
} from "@redux/api/dashboard/dashboardApi";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-10-16",
  });

  const { data: dashboardData, error: dashboardError, isLoading: isDashboardLoading } = useGetAdminDashboardQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: topCourtsData, error: topCourtsError, isLoading: isTopCourtsLoading } = useGetAdminTopCourtsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    topN: 5,
  });

  const { data: recentBookingsData, error: recentBookingsError, isLoading: isRecentBookingsLoading } =
    useGetAdminRecentBookingsQuery({ limit: 5 });

  const { data: recentFeedbacksData, error: recentFeedbacksError, isLoading: isRecentFeedbacksLoading } =
    useGetAdminRecentFeedbacksQuery({ limit: 5 });

  const handleFilterChange = (range: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (range === "today") {
      setDateRange({ startDate: today, endDate: today });
    } else if (range === "7days") {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      setDateRange({ startDate: start.toISOString().split("T")[0], endDate: today });
    } else if (range === "30days") {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      setDateRange({ startDate: start.toISOString().split("T")[0], endDate: today });
    }
  };

  if (isDashboardLoading || isTopCourtsLoading || isRecentBookingsLoading || isRecentFeedbacksLoading) {
    return <div className="flex justify-center items-center h-screen">Đang tải dữ liệu...</div>;
  }

  if (dashboardError || topCourtsError || recentBookingsError || recentFeedbacksError) {
    return <div className="text-red-600">Lỗi khi tải dữ liệu.</div>;
  }

  const dashboard = dashboardData?.data;
  const topCourts = topCourtsData?.data ?? [];
  const recentBookings = recentBookingsData?.data ?? [];
  const recentFeedbacks = recentFeedbacksData?.data ?? [];

  const usersByRoleData = Object.entries(dashboard?.usersByRole || {}).map(([role, count]) => ({
    name: role,
    value: count,
  }));
  const courtsByStatusData = Object.entries(dashboard?.courtsByStatus || {}).map(([status, count]) => ({
    name: status,
    value: count,
  }));
  const bookingsByStatusData = Object.entries(dashboard?.bookingsByStatus || {}).map(([status, count]) => ({
    name: status,
    value: count,
  }));
  const dailyRevenueData = Object.entries(dashboard?.dailyRevenue || {}).map(([date, amount]) => ({
    date,
    revenue: amount,
  }));
  const monthlyRevenueData = Object.entries(dashboard?.monthlyRevenue || {}).map(([month, amount]) => ({
    month,
    revenue: amount,
  }));

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Tổng quan</h2>
        <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan hệ thống.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng người dùng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalActiveUsers ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng số sân</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalCourts ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <FiGrid className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalRevenue.toLocaleString() ?? 0} VND</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.averageRating.toFixed(1) ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <FiStar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng lượt đặt sân</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalBookings ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng phản hồi</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalFeedbacks ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
              <FiStar className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng gói chủ sân</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalOwnerPackages ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng bài blog</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalBlogPosts ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng theo vai trò</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={usersByRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {usersByRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sân theo trạng thái</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={courtsByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {courtsByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đặt sân theo trạng thái</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={bookingsByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {bookingsByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo ngày</h3>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm bg-[#23AEB1] text-white rounded-lg"
                onClick={() => handleFilterChange("30days")}
              >
                30 ngày
              </button>
              <button
                className="px-3 py-1 text-sm bg-gray-100 rounded-lg"
                onClick={() => handleFilterChange("7days")}
              >
                7 ngày
              </button>
              <button
                className="px-3 py-1 text-sm bg-gray-100 rounded-lg"
                onClick={() => handleFilterChange("today")}
              >
                Hôm nay
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#23AEB1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu hàng tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courts + Recent Bookings + Recent Feedbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top sân có lượt đặt cao nhất</h3>
          <div className="space-y-4">
            {topCourts.map((court) => (
              <div key={court.courtId} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{court.name}</p>
                  <p className="text-gray-500 text-sm">ID: {court.courtId}</p>
                </div>
                <p className="text-gray-900 font-semibold">{court.bookingCount} lượt</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Đặt sân gần đây</h3>
            <button className="text-[#23AEB1] text-sm">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.bookingId} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{booking.userName}</p>
                  <p className="text-gray-500 text-sm">
                    {booking.courtName} - {new Date(booking.bookingDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status === "Paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Phản hồi gần đây</h3>
            <button className="text-[#23AEB1] text-sm">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {recentFeedbacks.map((feedback) => (
              <div key={feedback.feedbackId} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{feedback.userName}</p>
                  <p className="text-gray-500 text-sm">
                    {feedback.courtName} - {feedback.rating} sao
                  </p>
                  <p className="text-gray-500 text-sm">{feedback.comment}</p>
                </div>
                <p className="text-gray-500 text-sm">
                  {new Date(feedback.createAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;