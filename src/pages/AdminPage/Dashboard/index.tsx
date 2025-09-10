import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { date: "1/1", revenue: 40 },
  { date: "5/1", revenue: 50 },
  { date: "10/1", revenue: 65 },
  { date: "15/1", revenue: 78 },
  { date: "20/1", revenue: 90 },
  { date: "23/1", revenue: 110 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Tổng quan</h2>
        <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan hệ thống trong ngày hôm nay.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng số sân hoạt động */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Tổng số sân hoạt động</p>
          <h3 className="text-2xl font-bold">127</h3>
          <p className="text-green-600 text-sm">+12% so với tháng trước</p>
        </div>

        {/* Doanh thu hôm nay */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Doanh thu hôm nay</p>
          <h3 className="text-2xl font-bold">45.2M</h3>
          <p className="text-green-600 text-sm">+8.5% so với hôm qua</p>
        </div>

        {/* Lượt đặt sân */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Lượt đặt sân hôm nay</p>
          <h3 className="text-2xl font-bold">1,247</h3>
          <p className="text-green-600 text-sm">+15.3% so với hôm qua</p>
        </div>

        {/* Tỷ lệ đặt thành công */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Tỷ lệ đặt thành công</p>
          <h3 className="text-2xl font-bold">94.2%</h3>
          <p className="text-red-600 text-sm">-2.1% so với hôm qua</p>
        </div>
      </div>

      {/* Chart + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Doanh thu theo ngày trong tháng</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-[#23AEB1] text-white rounded-lg">
                30 ngày
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg">
                7 ngày
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg">
                Hôm nay
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#23AEB1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Phân bố sân theo quận</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">[ Bản đồ placeholder ]</p>
          </div>
        </div>
      </div>

      {/* Top courts + Recent bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top sân */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top sân có lượt đặt cao nhất</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Sân Cầu Lông Thể Thao Quận 1</p>
                <p className="text-gray-500 text-sm">Quận 1, TPHCM</p>
              </div>
              <p className="text-gray-900 font-semibold">1,234 lượt</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Sân Cầu Lông Phú Nhuận</p>
                <p className="text-gray-500 text-sm">Phú Nhuận, TPHCM</p>
              </div>
              <p className="text-gray-900 font-semibold">987 lượt</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Sân Cầu Lông Bình Thạnh</p>
                <p className="text-gray-500 text-sm">Bình Thạnh, TPHCM</p>
              </div>
              <p className="text-gray-900 font-semibold">856 lượt</p>
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Đặt sân gần đây</h3>
            <button className="text-[#23AEB1] text-sm">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Trần Minh Hoàng</p>
                <p className="text-gray-500 text-sm">Sân A1 - 14:00-16:00</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Đã thanh toán
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Lê Thị Mai Anh</p>
                <p className="text-gray-500 text-sm">Sân B2 - 16:00-18:00</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                Chờ thanh toán
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Nguyễn Văn Đức</p>
                <p className="text-gray-500 text-sm">Sân C1 - 18:00-20:00</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Đã thanh toán
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
