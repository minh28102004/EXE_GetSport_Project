import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Court {
  id: number;
  name: string;
  address: string;
  status: "Hoạt động" | "Tạm ngưng" | "Bảo trì";
  price: number;
}

const CourtManagement: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([
    {
      id: 1,
      name: "Sân Cầu Lông Thể Thao Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TPHCM",
      status: "Hoạt động",
      price: 180000,
    },
    {
      id: 2,
      name: "Sân Cầu Lông Phú Nhuận",
      address: "456 Phan Xích Long, Phú Nhuận, TPHCM",
      status: "Hoạt động",
      price: 200000,
    },
    {
      id: 3,
      name: "Sân Cầu Lông Bình Thạnh",
      address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh, TPHCM",
      status: "Tạm ngưng",
      price: 160000,
    },
    {
      id: 4,
      name: "Sân Cầu Lông Quận 3",
      address: "321 Võ Văn Tần, Quận 3, TPHCM",
      status: "Bảo trì",
      price: 170000,
    },
  ]);

  const toggleStatus = (id: number) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === id
          ? {
              ...court,
              status:
                court.status === "Hoạt động" ? "Tạm ngưng" : "Hoạt động",
            }
          : court
      )
    );
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý sân</h1>
        <button className="bg-[#23AEB1] text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
          + Thêm sân mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="border rounded-lg px-3 py-2">
          <option>Tất cả khu vực</option>
          <option>Quận 1</option>
          <option>Quận 3</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
          <option>Tất cả trạng thái</option>
          <option>Hoạt động</option>
          <option>Tạm ngưng</option>
          <option>Bảo trì</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sân..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="p-3">Tên sân</th>
              <th className="p-3">Địa chỉ</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Giá thuê</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr
                key={court.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 text-[#23AEB1] font-medium">
                  {court.name}
                </td>
                <td className="p-3">{court.address}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      court.status === "Hoạt động"
                        ? "bg-green-100 text-green-600"
                        : court.status === "Tạm ngưng"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {court.status}
                  </span>
                </td>
                <td className="p-3">{formatPrice(court.price)}/giờ</td>
                <td className="p-3 flex items-center space-x-3">
                  <button
                    onClick={() => toggleStatus(court.id)}
                    className="text-sm text-[#23AEB1] hover:underline"
                  >
                    {court.status === "Hoạt động" ? "Cấm sân" : "Mở lại"}
                  </button>
                  <button className="text-gray-500 hover:text-[#23AEB1]">
                    <FiEdit2 />
                  </button>
                  <button className="text-gray-500 hover:text-red-500">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>Hiển thị 10 trên tổng số {courts.length} sân</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            1
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            3
          </button>
          <span>...</span>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            13
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtManagement;
