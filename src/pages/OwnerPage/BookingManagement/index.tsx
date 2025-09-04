import React from "react";
import { FiSearch, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";

const BookingManagement: React.FC = () => {
  const bookings = [
    {
      id: 1,
      customer: "Trần Minh Hoàng",
      court: "Sân số 1",
      time: "18/07/2025 - 19:00 ~ 21:00",
      status: "Đang chờ",
    },
    {
      id: 2,
      customer: "Lê Văn Đức",
      court: "Sân số 2",
      time: "18/07/2025 - 20:00 ~ 22:00",
      status: "Đã xác nhận",
    },
    {
      id: 3,
      customer: "Phạm Thị Mai",
      court: "Sân số 3",
      time: "19/07/2025 - 08:00 ~ 10:00",
      status: "Đã hủy",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Đang chờ":
        return "bg-yellow-100 text-yellow-700";
      case "Đã xác nhận":
        return "bg-green-100 text-green-700";
      case "Đã hủy":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header page */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đơn đặt sân</h2>
        <p className="text-gray-600">Quản lý thông tin các đơn đặt sân</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#23AEB1] focus:border-[#23AEB1] outline-none"
          />
        </div>

        {/* Status filter */}
        <div className="flex space-x-2">
          {["Tất cả", "Đang chờ", "Đã xác nhận", "Đã hủy"].map((status) => (
            <button
              key={status}
              className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-50"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-600">Khách hàng</th>
              <th className="px-6 py-3 text-gray-600">Sân</th>
              <th className="px-6 py-3 text-gray-600">Thời gian</th>
              <th className="px-6 py-3 text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="px-6 py-4">{booking.customer}</td>
                <td className="px-6 py-4">{booking.court}</td>
                <td className="px-6 py-4 flex items-center space-x-2">
                  <FiCalendar className="text-gray-400" />
                  <span>{booking.time}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-800">
                    <FiCheckCircle />
                    <span>Xác nhận</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-800">
                    <FiXCircle />
                    <span>Hủy</span>
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
