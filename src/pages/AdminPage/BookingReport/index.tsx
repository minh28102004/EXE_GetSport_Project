import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FiRefreshCw, FiDownload } from "react-icons/fi";

// Mock dữ liệu
const lineData = [
  { date: "01/01", bookings: 20 },
  { date: "05/01", bookings: 45 },
  { date: "10/01", bookings: 60 },
  { date: "15/01", bookings: 90 },
  { date: "20/01", bookings: 70 },
  { date: "25/01", bookings: 110 },
  { date: "30/01", bookings: 85 },
];

const barData = [
  { time: "8-10h", bookings: 30 },
  { time: "10-12h", bookings: 50 },
  { time: "12-14h", bookings: 20 },
  { time: "14-16h", bookings: 40 },
  { time: "16-18h", bookings: 70 },
  { time: "18-20h", bookings: 90 },
  { time: "20-22h", bookings: 60 },
];

const bookings = [
  {
    id: 1,
    time: "24/01/2025 14:30",
    customer: "Lê Văn Hoàng",
    phone: "0912345678",
    court: "Sân số 3 - Quận 1",
    slot: "19:00 - 21:00",
    status: "Đã xác nhận",
  },
  {
    id: 2,
    time: "24/01/2025 13:45",
    customer: "Trần Minh Hoàng",
    phone: "0912345670",
    court: "Sân số 1 - Quận 3",
    slot: "17:00 - 19:00",
    status: "Chờ xác nhận",
  },
  {
    id: 3,
    time: "24/01/2025 12:20",
    customer: "Nguyễn Thị Lan",
    phone: "0923456789",
    court: "Sân số 5 - Quận 7",
    slot: "20:00 - 22:00",
    status: "Hoàn thành",
  },
];

const BookingReport: React.FC = () => {
  const [filter, setFilter] = useState("Tháng này");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Báo cáo đặt sân</h1>
      <p className="text-gray-600">
        Thống kê chi tiết về tình hình đặt sân cầu lông của hệ thống
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Tổng số đơn</p>
          <h2 className="text-xl font-bold">1,247</h2>
          <p className="text-green-500 text-sm">+2.8% so với tháng trước</p>
        </div>
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Tỷ lệ hủy</p>
          <h2 className="text-xl font-bold">8.5%</h2>
          <p className="text-red-500 text-sm">+2.1% so với tháng trước</p>
        </div>
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Khung giờ hot nhất</p>
          <h2 className="text-xl font-bold">19:00 - 21:00</h2>
          <p className="text-gray-500 text-sm">342 lượt đặt</p>
        </div>
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Doanh thu từ đặt sân</p>
          <h2 className="text-xl font-bold">156.8 triệu đ</h2>
          <p className="text-green-500 text-sm">+12.7% so với tháng trước</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option>Hôm nay</option>
          <option>Tuần này</option>
          <option>Tháng này</option>
          <option>Quý này</option>
          <option>Năm này</option>
        </select>
        <select className="border p-2 rounded-lg">
          <option>Tất cả khu vực</option>
          <option>Quận 1</option>
          <option>Quận 3</option>
          <option>Quận 7</option>
        </select>
        <select className="border p-2 rounded-lg">
          <option>Tất cả trạng thái</option>
          <option>Đã xác nhận</option>
          <option>Chờ xác nhận</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
        </select>
        <button className="ml-auto flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
          <FiRefreshCw /> Làm mới
        </button>
        <button className="flex items-center gap-2 bg-[#23AEB1] text-white px-4 py-2 rounded-lg">
          <FiDownload /> Xuất báo cáo
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">Biểu đồ đặt sân theo thời gian</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#23AEB1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">Phân bố đặt sân theo khung giờ</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#23AEB1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking list */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-bold mb-4">Danh sách đơn đặt sân chi tiết</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">STT</th>
              <th className="p-2">Thời gian đặt</th>
              <th className="p-2">Khách hàng</th>
              <th className="p-2">Sân</th>
              <th className="p-2">Khung giờ</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => (
              <tr key={b.id} className="border-b">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{b.time}</td>
                <td className="p-2">
                  {b.customer}
                  <br />
                  <span className="text-sm text-gray-500">{b.phone}</span>
                </td>
                <td className="p-2">{b.court}</td>
                <td className="p-2">{b.slot}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      b.status === "Đã xác nhận"
                        ? "bg-green-100 text-green-600"
                        : b.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-600"
                        : b.status === "Hoàn thành"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingReport;
