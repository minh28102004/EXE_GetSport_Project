// src/components/UserManagement.tsx
import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock, FaTrash, FaUserEdit, FaUserPlus } from "react-icons/fa";
import UserForm from "./UserForm";
import { useGetAccountsQuery } from "../../../features/accounts/accountApi";
import type { Account } from "../../../types/account";
import "./styles.css";

const UserManagement: React.FC = () => {
  const { data: users = [], isLoading, isError } = useGetAccountsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [localUsers, setLocalUsers] = useState<Account[]>([]);

  useEffect(() => {
    if (users.length) setLocalUsers(users);
  }, [users]);

  const handleDelete = (id: number) => {
    setLocalUsers(localUsers.filter((user) => user.userId !== id));
  };

  const openModal = (user: Account | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentUser(null);
    setIsModalOpen(false);
  };

  const handleUserSaved = (user: Account) => {
    if (user.userId) {
      setLocalUsers(localUsers.map((u) => (u.userId === user.userId ? user : u)));
    } else {
      setLocalUsers([...localUsers, { ...user, userId: localUsers.length + 1 }]);
    }
    closeModal();
  };

  if (isLoading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-500">Quản lý tài khoản và phân quyền trong hệ thống</p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:scale-105 transition"
        >
          <FaUserPlus /> Thêm người dùng
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-gray-700">
            <tr>
              <th className="p-3">Người dùng</th>
              <th className="p-3">Email</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {localUsers.map((u, i) => (
              <tr
                key={u.userId}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{u.fullname}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(u.createat).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => openModal(u)} className="hover:scale-110 transition">
                    <FaUserEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  {u.status === "active" ? (
                    <button className="hover:scale-110 transition">
                      <FaLock className="text-yellow-500 hover:text-yellow-700" />
                    </button>
                  ) : (
                    <button className="hover:scale-110 transition">
                      <FaUnlock className="text-green-500 hover:text-green-700" />
                    </button>
                  )}
                  <button
                    className="hover:scale-110 transition"
                    onClick={() => handleDelete(u.userId)}
                  >
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserForm user={currentUser} onSave={handleUserSaved} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
