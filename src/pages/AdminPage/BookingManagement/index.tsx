import React, { useState } from "react";
import { FiEye } from "react-icons/fi";

interface Booking {
  id: number;
  user: string;
  court: string;
  date: string;
  time: string;
  status: "Chờ xác nhận" | "Đã xác nhận" | "Đã huỷ" | "Hoàn thành";
}

const BookingManagement: React.FC = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: 1,
      user: "Nguyễn Văn A",
      court: "Sân Cầu Lông Quận 1",
      date: "2025-08-30",
      time: "08:00 - 09:00",
      status: "Chờ xác nhận",
    },
    {
      id: 2,
      user: "Trần Thị B",
      court: "Sân Cầu Lông Phú Nhuận",
      date: "2025-08-29",
      time: "18:00 - 20:00",
      status: "Đã xác nhận",
    },
    {
      id: 3,
      user: "Lê Văn C",
      court: "Sân Cầu Lông Bình Thạnh",
      date: "2025-08-28",
      time: "19:00 - 21:00",
      status: "Đã huỷ",
    },
  ]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Quản lý đơn đặt sân</h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="border rounded-lg px-3 py-2">
          <option>Tất cả trạng thái</option>
          <option>Chờ xác nhận</option>
          <option>Đã xác nhận</option>
          <option>Đã huỷ</option>
          <option>Hoàn thành</option>
        </select>
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên user hoặc sân..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="p-3">Người đặt</th>
              <th className="p-3">Sân</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{b.user}</td>
                <td className="p-3">{b.court}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.time}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      b.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-600"
                        : b.status === "Đã xác nhận"
                        ? "bg-green-100 text-green-600"
                        : b.status === "Đã huỷ"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3">
                  <button className="flex items-center text-[#23AEB1] hover:underline">
                    <FiEye className="mr-1" /> Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
