import React, { useState } from "react";

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
}

interface UserFormProps {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>(
    user || { name: "", email: "", role: "Khách hàng", status: "Hoạt động" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Tên người dùng"
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded w-full"
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option>Admin</option>
        <option>Quản lý</option>
        <option>Nhân viên</option>
        <option>Khách hàng</option>
      </select>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option>Hoạt động</option>
        <option>Bị khóa</option>
      </select>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          Hủy
        </button>
        <button type="submit" className="px-4 py-2 bg-[#23AEB1] text-white rounded">
          Lưu
        </button>
      </div>
    </form>
  );
};

export default UserForm;
