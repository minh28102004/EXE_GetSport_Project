import React, { useState } from "react";
import { FiSearch, FiUserPlus } from "react-icons/fi";
import { FaLock, FaUnlock, FaTrash, FaUserEdit } from "react-icons/fa";
import UserForm from "./UserForm"; // Import UserForm component
import "./styles.css";
// Define the User type
interface User {
  id?: number; // Optional for new users
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string; // Optional for new users
}

// Mock data
const initialUsers: User[] = [
  {
    id: 1,
    name: "Trần Minh Khang",
    email: "khang.tran@email.com",
    role: "Admin",
    status: "Hoạt động",
    createdAt: "15/1/2024",
  },
  {
    id: 2,
    name: "Nguyễn Thị Lan Anh",
    email: "lananh.nguyen@email.com",
    role: "Quản lý",
    status: "Hoạt động",
    createdAt: "18/1/2024",
  },
  {
    id: 3,
    name: "Lê Văn Hoàng",
    email: "hoang.le@email.com",
    role: "Nhân viên",
    status: "Hoạt động",
    createdAt: "20/1/2024",
  },
  {
    id: 4,
    name: "Phạm Thị Mai",
    email: "mai.pham@email.com",
    role: "Khách hàng",
    status: "Hoạt động",
    createdAt: "22/1/2024",
  },
  {
    id: 5,
    name: "Võ Minh Tuấn",
    email: "tuan.vo@email.com",
    role: "Khách hàng",
    status: "Bị khóa",
    createdAt: "25/1/2024",
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // For editing user

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const openModal = (user: User | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentUser(null);
    setIsModalOpen(false);
  };

  const handleUserSaved = (user: User) => {
    if (user.id) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, { ...user, id: users.length + 1 }]);
    }
    closeModal();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <p className="text-gray-600">
        Quản lý tài khoản và phân quyền người dùng trong hệ thống
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Tổng người dùng</p>
          <h2 className="text-xl font-bold">{users.length}</h2>
        </div>
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Hoạt động</p>
          <h2 className="text-xl font-bold text-green-600">
            {users.filter(user => user.status === "Hoạt động").length}
          </h2>
        </div>
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Bị khóa</p>
          <h2 className="text-xl font-bold text-red-600">
            {users.filter(user => user.status === "Bị khóa").length}
          </h2>
        </div>
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500">Admin</p>
          <h2 className="text-xl font-bold text-purple-600">
            {users.filter(user => user.role === "Admin").length}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full border pl-10 p-2 rounded-lg"
          />
        </div>
        <select
          className="border p-2 rounded-lg"
        >
          <option>Tất cả vai trò</option>
          <option>Admin</option>
          <option>Quản lý</option>
          <option>Nhân viên</option>
          <option>Khách hàng</option>
        </select>
        <select
          className="border p-2 rounded-lg"
        >
          <option>Tất cả trạng thái</option>
          <option>Hoạt động</option>
          <option>Bị khóa</option>
        </select>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#23AEB1] text-white px-4 py-2 rounded-lg">
          <FiUserPlus /> Thêm người dùng
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Người dùng</th>
              <th className="p-2">Email</th>
              <th className="p-2">Vai trò</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Ngày tạo</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2 font-medium">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      u.role === "Admin"
                        ? "bg-purple-100 text-purple-600"
                        : u.role === "Quản lý"
                        ? "bg-blue-100 text-blue-600"
                        : u.role === "Nhân viên"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      u.status === "Hoạt động"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-2">{u.createdAt}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openModal(u)}>
                    <FaUserEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  {u.status === "Hoạt động" ? (
                    <button className="text-yellow-500 hover:text-yellow-700">
                      <FaLock />
                    </button>
                  ) : (
                    <button className="text-green-500 hover:text-green-700">
                      <FaUnlock />
                    </button>
                  )}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(u.id!)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Hiển thị 1 đến {users.length} trong tổng số {users.length} người dùng
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg">Trước</button>
            <button className="px-3 py-1 border rounded-lg bg-[#23AEB1] text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded-lg">2</button>
            <button className="px-3 py-1 border rounded-lg">Sau</button>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
{/* User Form Modal */}
{/* User Form Modal */}
{isModalOpen && (
  <div className="modal-overlay">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <UserForm user={currentUser} onSave={handleUserSaved} onClose={closeModal} />
    </div>
  </div>
)}
    </div>
  );
};

export default UserManagement;