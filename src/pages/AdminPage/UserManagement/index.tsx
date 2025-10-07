import React, { useMemo, useState } from "react";
import { FaLock, FaUnlock, FaTrash, FaUserEdit, FaSearch, FaFilter, FaTimes } from "react-icons/fa"; // ⬅️ thêm icon search/filter
import {
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@redux/features/account/accountApi";
import type { Account } from "@redux/features/account/type";
import UserForm from "./UserForm";
import "./styles.css";

// 🟢 Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  /* ---------------- Filters state ---------------- */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const roleOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((u) => u.role && set.add(String(u.role)));
    return ["all", ...Array.from(set)];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((u) => {
      const matchesSearch =
        !q ||
        (u.fullName?.toLowerCase().includes(q) ?? false) ||
        (u.email?.toLowerCase().includes(q) ?? false);

      const matchesRole = roleFilter === "all" || String(u.role).toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" ? u.isActive : !u.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [rows, search, roleFilter, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const openModal = (user: Account | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setCurrentUser(null);
    setIsModalOpen(false);
  };

  const handleUserSaved = async (user: Partial<Account> & { password?: string }) => {
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

        toast.success("Cập nhật người dùng thành công!", {
          position: "top-right",
          autoClose: 2200,
          theme: "colored",
          newestOnTop: true,
        });
      } else {
        const dto = mapUiToDto(user);
        await createAccount(dto).unwrap();
        // chỉ toast cho cập nhật/xoá theo yêu cầu cũ
      }
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (u: Account) => {
    try {
      await updateAccount({ id: u.id, body: { isactive: !u.isActive } }).unwrap();
    } catch (e) {
      console.error(e);
      alert("Không thể đổi trạng thái tài khoản.");
    }
  };

  const handleDelete = async (id: number, name?: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xoá người dùng${name ? ` "${name}"` : ""}?`);
    if (!ok) return;
    try {
      await deleteAccount(id).unwrap();
      toast.success(`Đã xoá${name ? ` "${name}"` : ""}!`, {
        position: "top-right",
        autoClose: 2200,
        theme: "colored",
        newestOnTop: true,
      });
    } catch (e) {
      console.error(e);
      alert("Xoá thất bại, vui lòng thử lại!");
    }
  };

  if (isLoading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-500">Quản lý tài khoản và phân quyền trong hệ thống</p>
        </div>
        {/* (bỏ nút thêm như trước) */}
      </div>

      {/* 🔎 Filter bar */}
      <div className="bg-blue/80 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Tìm kiếm</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên hoặc email..."
                className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Xoá tìm kiếm"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Vai trò</label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r === "all" ? "Tất cả" : r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value="all">Tất cả</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions / count */}
          <div className="md:col-span-1 flex md:justify-end items-end">
            {(search || roleFilter !== "all" || statusFilter !== "all") ? (
              <button
                type="button"
                onClick={resetFilters}
                className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Reset
              </button>
            ) : (
              <div className="text-sm text-gray-500 md:text-right w-full md:w-auto">
                Tổng: <span className="font-semibold">{rows.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Match count */}
        <div className="mt-2 text-xs text-gray-500">
          Đang hiển thị <span className="font-semibold">{filteredRows.length}</span> / {rows.length} người dùng
        </div>
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
            {filteredRows.map((u, i) => (
              <tr
                key={u.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{u.fullName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "active" : "inactive"}
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "--"}
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

            {filteredRows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (sửa người dùng) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={busy ? undefined : closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentUser ? "Sửa người dùng" : "Thêm người dùng"}
              </h3>

              <UserForm user={currentUser} onSave={handleUserSaved} onClose={closeModal} loading={busy} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
