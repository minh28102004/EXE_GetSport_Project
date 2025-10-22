import React, { useState } from "react";
import {
  FiGrid,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiUsers,
  FiPackage,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Đầu tháng
    endDate: new Date(), // Hôm nay
    customRange: false,
  });

  const { data: dashboardData, error: dashboardError, isLoading: isDashboardLoading } = useGetAdminDashboardQuery({
    startDate: dateRange.startDate.toISOString().split("T")[0],
    endDate: dateRange.endDate.toISOString().split("T")[0],
  });

  const { data: topCourtsData, error: topCourtsError, isLoading: isTopCourtsLoading } = useGetAdminTopCourtsQuery({
    startDate: dateRange.startDate.toISOString().split("T")[0],
    endDate: dateRange.endDate.toISOString().split("T")[0],
    topN: 5,
  });

  const { data: recentBookingsData, error: recentBookingsError, isLoading: isRecentBookingsLoading } =
    useGetAdminRecentBookingsQuery({ limit: 5 });

  const { data: recentFeedbacksData, error: recentFeedbacksError, isLoading: isRecentFeedbacksLoading } =
    useGetAdminRecentFeedbacksQuery({ limit: 5 });

  // Preset Filters
  const handlePresetFilter = (type: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
      case "today":
        start = end = today;
        break;
      case "yesterday":
        start = end = new Date(today.getTime() - 86400000);
        break;
      case "week":
        const day = today.getDay();
        start = new Date(today.getTime() - (day === 0 ? 6 : day - 1) * 86400000);
        end = today;
        break;
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "year":
        start = new Date(today.getFullYear(), 0, 1);
        end = today;
        break;
      case "lastYear":
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setDateRange({ startDate: start, endDate: end, customRange: false });
  };

  // Custom Date Range
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange({
      startDate: start || new Date(),
      endDate: end || new Date(),
      customRange: true,
    });
  };

  // Format display
  const getPeriodDisplay = () => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    
    if (start.toDateString() === end.toDateString()) {
      return `${end.toLocaleDateString('vi-VN')}`;
    } else {
      return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
    }
  };

  // Days difference for chart type
  const daysDiff = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 3600 * 24));

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

  // Prepare chart data based on range
  let revenueChartData = [];
  let chartType = "line";
  let xAxisKey = "date";
  let chartTitle = "Doanh thu";

  if (daysDiff <= 1) {
    // 1 ngày: theo giờ
    revenueChartData = Object.entries(dashboard?.hourlyRevenue || {}).map(([hour, amount]) => ({
      hour: `${hour}:00`,
      revenue: amount,
    }));
    chartType = "bar";
    xAxisKey = "hour";
    chartTitle = "Doanh thu theo giờ";
  } else if (daysDiff <= 31) {
    // <= 1 tháng: theo ngày
    revenueChartData = Object.entries(dashboard?.dailyRevenue || {}).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }),
      revenue: amount,
    }));
    chartType = "line";
    xAxisKey = "date";
    chartTitle = "Doanh thu theo ngày";
  } else {
    // > 1 tháng: theo tháng
    revenueChartData = Object.entries(dashboard?.monthlyRevenue || {}).map(([month, amount]) => {
      const [year, mon] = month.split('-');
      const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
      return {
        month: monthNames[parseInt(mon) - 1],
        revenue: amount,
      };
    });
    chartType = "bar";
    xAxisKey = "month";
    chartTitle = "Doanh thu theo tháng";
  }

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

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Tổng quan</h2>
        <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan hệ thống.</p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preset Buttons */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {[
                { key: "today", label: "Hôm nay" },
                { key: "yesterday", label: "Hôm qua" },
                { key: "week", label: "Tuần" },
                { key: "month", label: "Tháng" },
                { key: "lastMonth", label: "Th. trước" },
                { key: "year", label: "Năm" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handlePresetFilter(item.key)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                    (dateRange.customRange === false && 
                     // Check if matches preset
                     ((item.key === "today" && dateRange.startDate.toDateString() === dateRange.endDate.toDateString()) ||
                      (item.key === "yesterday" && 
                       new Date(dateRange.startDate.getTime() - 86400000).toDateString() === new Date().toDateString()) ||
                      (item.key === "month" && dateRange.startDate.getDate() === 1 && 
                       dateRange.startDate.getMonth() === dateRange.endDate.getMonth() && 
                       dateRange.startDate.getFullYear() === dateRange.endDate.getFullYear()) ||
                      (item.key === "year" && dateRange.startDate.getMonth() === 0 && 
                       dateRange.startDate.getDate() === 1 && 
                       dateRange.startDate.getFullYear() === dateRange.endDate.getFullYear())))
                    ? "bg-[#23AEB1]shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <DatePicker
              selectsRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateChange}
              locale={vi}
              dateFormat="dd/MM/yyyy"
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23AEB1] focus:border-transparent"
              placeholderText="Chọn khoảng thời gian"
              endDatePlaceholder="Đến ngày"
              wrapperClassName="w-full"
            />
            <span className="text-sm text-gray-500 hidden sm:block">|</span>
            <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
              {getPeriodDisplay()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FiUsers, label: "Người dùng", value: dashboard?.totalActiveUsers ?? 0, color: "blue" },
          { icon: FiGrid, label: "Sân", value: dashboard?.totalCourts ?? 0, color: "green" },
          { icon: FiDollarSign, label: "Doanh thu", value: dashboard?.totalRevenue?.toLocaleString() ?? 0, color: "yellow", suffix: "VND" },
          { icon: FiCalendar, label: "Đặt sân", value: dashboard?.totalBookings ?? 0, color: "indigo" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value} {stat.suffix || ""}
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Charts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng theo vai trò</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={usersByRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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
              <Pie data={courtsByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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
              <Pie data={bookingsByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bookingsByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{chartTitle}</h3>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "line" ? (
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value?.toLocaleString()} VND`, "Doanh thu"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#23AEB1" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value?.toLocaleString()} VND`, "Doanh thu"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#23AEB1" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top sân phổ biến</h3>
          <div className="space-y-3">
            {topCourts.map((court, index) => (
              <div key={court.courtId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#23AEB1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{court.name}</p>
                    <p className="text-gray-500 text-xs">ID: {court.courtId}</p>
                  </div>
                </div>
                <p className="text-[#23AEB1] font-semibold">{court.bookingCount} lượt</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Đặt sân mới</h3>
            <button className="text-[#23AEB1] text-sm hover:underline">Xem tất cả →</button>
          </div>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((booking) => (
              <div key={booking.bookingId} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{booking.userName}</p>
                    <p className="text-gray-500 text-xs truncate">{booking.courtName}</p>
                  </div>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    booking.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {booking.status === "Paid" ? "Đã TT" : "Chờ"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Phản hồi mới</h3>
            <button className="text-[#23AEB1] text-sm hover:underline">Xem tất cả →</button>
          </div>
          <div className="space-y-3">
            {recentFeedbacks.slice(0, 5).map((feedback) => (
              <div key={feedback.feedbackId} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{feedback.userName}</p>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < feedback.rating ? "fill-current" : ""} />
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2">{feedback.comment}</p>
                  </div>
                  <p className="text-gray-400 text-xs ml-2 whitespace-nowrap">
                    {new Date(feedback.createAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;