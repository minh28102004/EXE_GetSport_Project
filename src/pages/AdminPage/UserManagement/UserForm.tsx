import React, { useState } from "react";
import type { Account } from "@redux/api/account/type";

type Props = {
  user: Account | null; // null = create, khác null = edit
  onSave: (user: Partial<Account>) => void;
  onClose: () => void;
  loading?: boolean;
};

const defaultNew: Partial<Account> = {
  fullName: "",
  email: "",
  role: "Customer",
  isActive: true,
  status: null,
  phoneNumber: "",
  membershipType: null,
  skillLevel: null,
  totalPoint: 0,
};

const UserForm: React.FC<Props> = ({ user, onSave, onClose, loading }) => {
  const [form, setForm] = useState<Partial<Account>>(
    user ? { ...user } : { ...defaultNew }
  );

  const setField = <K extends keyof Account>(
    name: K,
    value: Partial<Account>[K]
  ) => setForm((s) => ({ ...s, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full name */}
      <input
        name="fullName"
        value={form.fullName ?? ""}
        onChange={(e) => setField("fullName", e.target.value)}
        placeholder="Họ và tên"
        className="border p-2 rounded w-full"
        required
        disabled={loading}
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        value={form.email ?? ""}
        onChange={(e) => setField("email", e.target.value)}
        placeholder="Email"
        className="border p-2 rounded w-full"
        required
        disabled={loading}
      />

      {/* Role */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Vai trò</label>
          <select
            name="role"
            value={form.role ?? "Customer"}
            onChange={(e) => setField("role", e.target.value)}
            className="border p-2 rounded w-full"
            disabled={loading}
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
        </div>

        {/* Trạng thái hoạt động */}
        <div className="flex items-end gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={!!form.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
            className="h-5 w-5"
            disabled={loading}
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Hoạt động
          </label>
        </div>
      </div>

      {/* Thông tin phụ */}
      <div className="grid grid-cols-2 gap-3">
        <input
          name="phoneNumber"
          value={form.phoneNumber ?? ""}
          onChange={(e) => setField("phoneNumber", e.target.value)}
          placeholder="Số điện thoại"
          className="border p-2 rounded w-full"
          disabled={loading}
        />

        <input
          type="date"
          name="dateOfBirth"
          value={(form.dateOfBirth ?? "") as string}
          onChange={(e) => setField("dateOfBirth", e.target.value)}
          className="border p-2 rounded w-full"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="membershipType"
          value={form.membershipType ?? ""}
          onChange={(e) => setField("membershipType", e.target.value)}
          placeholder="Loại hội viên (tuỳ chọn)"
          className="border p-2 rounded w-full"
          disabled={loading}
        />
        <input
          name="skillLevel"
          value={form.skillLevel ?? ""}
          onChange={(e) => setField("skillLevel", e.target.value)}
          placeholder="Trình độ (tuỳ chọn)"
          className="border p-2 rounded w-full"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min={0}
          name="totalPoint"
          value={Number(form.totalPoint ?? 0)}
          onChange={(e) => setField("totalPoint", Number(e.target.value))}
          placeholder="Điểm tích luỹ"
          className="border p-2 rounded w-full"
          disabled={loading}
        />
        <select
          name="status"
          value={(form.status ?? "") as string}
          onChange={(e) => setField("status", e.target.value || null)}
          className="border p-2 rounded w-full"
          disabled={loading}
        >
          <option value="">-- Trạng thái (optional) --</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="banned">banned</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#23AEB1] text-white rounded"
          disabled={loading}
        >
          {user ? "Lưu thay đổi" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
