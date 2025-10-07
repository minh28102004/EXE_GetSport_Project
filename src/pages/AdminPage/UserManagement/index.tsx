import React, { useMemo, useState } from "react";
import {
  FaLock,
  FaUnlock,
  FaTrash,
  FaUserEdit,
  FaSearch,
  FaFilter,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@redux/api/account/accountApi";
import type { Account } from "@redux/api/account/type";
import { mapUiToDto } from "@/redux/api/account/map";
import UserForm, { UserFormModal } from "./UserForm";

const initials = (name?: string) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const filterInputCls =
  "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm " +
  "focus:outline-none focus:ring-1 focus:ring-teal-200 focus:border-teal-400";

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

  /* ---------------- Filters ---------------- */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

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

      const matchesRole =
        roleFilter === "all" ||
        String(u.role).toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? u.isActive : !u.isActive);

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
        toast.success("Cập nhật người dùng thành công!");
      } else {
        const dto = mapUiToDto(user);
        await createAccount(dto).unwrap();
        toast.success("Tạo người dùng mới thành công!");
      }
      closeModal();
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleToggleActive = async (u: Account) => {
    try {
      await updateAccount({
        id: u.id,
        body: { isactive: !u.isActive },
      }).unwrap();
      toast.info(
        `Tài khoản "${u.fullName}" đã được ${u.isActive ? "khóa" : "mở khóa"}.`
      );
    } catch (e) {
      console.error(e);
      toast.error("Không thể đổi trạng thái tài khoản.");
    }
  };

  const handleDelete = async (id: number, name?: string) => {
    const ok = window.confirm(
      `Bạn có chắc muốn xoá người dùng${name ? ` "${name}"` : ""}?`
    );
    if (!ok) return;
    try {
      await deleteAccount(id).unwrap();
      toast.success(`Đã xoá${name ? ` "${name}"` : ""}!`);
    } catch (e) {
      console.error(e);
      toast.error("Xoá thất bại, vui lòng thử lại!");
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>
    );

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-6 md:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Quản lý người dùng
          </h2>
          <p className="text-gray-500">
            Quản lý tài khoản và phân quyền trong hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={busy}
        >
          <FaUserPlus />
          Tạo tài khoản
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Tìm kiếm
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên hoặc email..."
                className={`${filterInputCls} pl-9 pr-9`}
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
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Vai trò
            </label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`${filterInputCls} pl-9 pr-3`}
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
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={filterInputCls}
            >
              <option value="all">Tất cả</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions / count */}
          <div className="md:col-span-1 flex md:justify-end items-end">
            {search || roleFilter !== "all" || statusFilter !== "all" ? (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 w-full md:w-auto px-3 rounded-lg border border-gray-300 hover:bg-gray-50"
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

        <div className="mt-2 text-xs text-gray-500">
          Đang hiển thị{" "}
          <span className="font-semibold">{filteredRows.length}</span> /{" "}
          {rows.length} người dùng
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
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
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50"
                } hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-sm font-semibold">
                      {initials(u.fullName)}
                    </div>
                    <span>{u.fullName}</span>
                  </div>
                </td>
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
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="Sửa" arrow>
                    <button
                      onClick={() => openModal(u)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaUserEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>

                  <Tooltip title={u.isActive ? "Khoá" : "Mở khoá"} arrow>
                    <button
                      onClick={() => handleToggleActive(u)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      {u.isActive ? (
                        <FaLock className="text-yellow-600 hover:text-yellow-700" />
                      ) : (
                        <FaUnlock className="text-green-600 hover:text-green-700" />
                      )}
                    </button>
                  </Tooltip>

                  <Tooltip title="Xoá" arrow>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={() => handleDelete(u.id, u.fullName)}
                      disabled={busy}
                    >
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </Tooltip>
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

      {/* Modal (dùng component đã sửa) */}
      <UserFormModal
        open={isModalOpen}
        user={currentUser}
        onSave={handleUserSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />
    </div>
  );
};

export default UserManagement;
