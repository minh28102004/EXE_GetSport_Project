import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

interface Court {
  id: number;
  name: string;
  type: string;
  status: "Hoạt động" | "Bảo trì";
  price: string;
  time: string;
}

const CourtManagement: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([
    {
      id: 1,
      name: "Sân số 1",
      type: "Sân 7 người",
      status: "Hoạt động",
      price: "300,000 VNĐ/giờ",
      time: "06:00 - 22:00",
    },
    {
      id: 2,
      name: "Sân số 2",
      type: "Sân 11 người",
      status: "Bảo trì",
      price: "500,000 VNĐ/giờ",
      time: "06:00 - 22:00",
    },
    {
      id: 3,
      name: "Sân số 3",
      type: "Sân 7 người",
      status: "Hoạt động",
      price: "300,000 VNĐ/giờ",
      time: "06:00 - 22:00",
    },
  ]);

  const [filter, setFilter] = useState<"Tất cả" | "Hoạt động" | "Bảo trì">("Tất cả");
  const [search, setSearch] = useState("");

  const filteredCourts = courts.filter(
    (court) =>
      (filter === "Tất cả" || court.status === filter) &&
      court.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sân</h2>
          <p className="text-gray-600">Quản lý thông tin các sân bóng</p>
        </div>
        <button className="bg-[#23AEB1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1e9697]">
          + Thêm sân mới
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sân..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23AEB1]"
          />
        </div>

        <div className="flex items-center gap-2">
          {["Tất cả", "Hoạt động", "Bảo trì"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === status
                  ? "bg-[#23AEB1] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-3">Tên sân</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Giá thuê</th>
              <th className="px-6 py-3">Thời gian hoạt động</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourts.map((court) => (
              <tr key={court.id} className="border-t text-sm">
                {/* Tên sân */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{court.name}</p>
                    <p className="text-gray-500">{court.type}</p>
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      court.status === "Hoạt động"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {court.status}
                  </span>
                </td>

                {/* Giá thuê */}
                <td className="px-6 py-4">{court.price}</td>

                {/* Thời gian hoạt động */}
                <td className="px-6 py-4">{court.time}</td>

                {/* Actions */}
                <td className="px-6 py-4 text-right flex gap-3 justify-end">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit2 />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
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

export default CourtManagement;
