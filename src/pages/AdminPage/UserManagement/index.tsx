// src/components/UserManagement.tsx
import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock, FaTrash, FaUserEdit } from "react-icons/fa";
import UserForm from "./UserForm";
import { useGetAccountsQuery } from "../../../features/accounts/accountApi";
import type { Account } from "../../../types/account";
import "./styles.css";

const UserManagement: React.FC = () => {
  const { data: users = [], isLoading, isError } = useGetAccountsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [localUsers, setLocalUsers] = useState<Account[]>([]);

  // Sync localUsers với dữ liệu từ API khi load xong
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

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) return <div>Lỗi khi tải dữ liệu</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <p className="text-gray-600">
        Quản lý tài khoản và phân quyền người dùng trong hệ thống
      </p>

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
            {localUsers.map((u) => (
              <tr key={u.userId} className="border-b">
                <td className="p-2 font-medium">{u.fullname}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.status}</td>
                <td className="p-2">{new Date(u.createat).toLocaleDateString()}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openModal(u)}>
                    <FaUserEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  {u.status === "active" ? (
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
                    onClick={() => handleDelete(u.userId)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
