import React, { useState } from "react";
import { FaLock, FaUnlock, FaTrash, FaUserEdit } from "react-icons/fa"; // ⬅️ bỏ FaUserPlus
import {
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@redux/api/account/accountApi";
import type { Account } from "@redux/api/account/type";
import { mapUiToDto } from "@/redux/api/account/map";
import UserForm from "./UserForm";
import "./styles.css";

// ... mapUiToDto giữ nguyên ...

const UserManagement: React.FC = () => {
  const { data, isLoading, isError } = useGetAccountsQuery(undefined);

  const rows: Account[] = Array.isArray(data?.data)
    ? (data?.data as Account[])
    : (data?.data as { items?: Account[] } | undefined)?.items ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);

  const [createAccount, { isLoading: creating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: updating }] = useUpdateAccountMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const busy = creating || updating || deleting;

  const openModal = (user: Account | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setCurrentUser(null);
    setIsModalOpen(false);
  };

  const handleUserSaved = async (
    user: Partial<Account> & { password?: string }
  ) => {
    try {
      if (user.id) {
        await updateAccount({
          id: user.id,
          body: {
            fullname: user.fullName,
            email: user.email,
            role: user.role,
            phonenumber: user.phoneNumber,
            dateofbirth: user.dateOfBirth,
            gender: user.gender,
            membershiptype: user.membershipType,
            skilllevel: user.skillLevel,
            isactive: user.isActive,
            status: user.status,
            totalpoint: user.totalPoint,
          },
        }).unwrap();
      } else {
        const dto = mapUiToDto(user);
        await createAccount(dto).unwrap();
      }
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (u: Account) => {
    try {
      await updateAccount({
        id: u.id,
        body: { isactive: !u.isActive },
      }).unwrap();
    } catch (e) {
      console.error(e);
      alert("Không thể đổi trạng thái tài khoản.");
    }
  };

  const handleDelete = async (id: number, name?: string) => {
    const ok = window.confirm(
      `Bạn có chắc muốn xoá người dùng${name ? ` "${name}"` : ""}?`
    );
    if (!ok) return;
    try {
      await deleteAccount(id).unwrap();
    } catch (e) {
      console.error(e);
      alert("Xoá thất bại, vui lòng thử lại!");
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <p className="text-gray-500">
            Quản lý tài khoản và phân quyền trong hệ thống
          </p>
        </div>
        {/* ⬇️ BỎ NÚT THÊM NGƯỜI DÙNG */}
        {/* (để trống hoặc thêm phần khác nếu cần) */}
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
            {rows.map((u, i) => (
              <tr
                key={u.id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{u.fullName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "active" : "inactive"}
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "--"}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openModal(u)}
                    className="hover:scale-110 transition"
                    title="Sửa"
                    disabled={busy}
                  >
                    <FaUserEdit className="text-blue-500 hover:text-blue-700" />
                  </button>

                  <button
                    onClick={() => handleToggleActive(u)}
                    className="hover:scale-110 transition"
                    title={u.isActive ? "Khoá" : "Mở khoá"}
                    disabled={busy}
                  >
                    {/* ✅ active -> mở khoá xanh; inactive -> khoá vàng */}
                    {u.isActive ? (
                      <FaUnlock className="text-green-500 hover:text-green-700" />
                    ) : (
                      <FaLock className="text-yellow-500 hover:text-yellow-700" />
                    )}
                  </button>

                  <button
                    className="hover:scale-110 transition"
                    onClick={() => handleDelete(u.id, u.fullName)}
                    title="Xoá"
                    disabled={busy}
                  >
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  Chưa có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (vẫn giữ để sửa người dùng) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={busy ? undefined : closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentUser ? "Sửa người dùng" : "Thêm người dùng"}
              </h3>

              <UserForm
                user={currentUser}
                onSave={handleUserSaved}
                onClose={closeModal}
                loading={busy}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
