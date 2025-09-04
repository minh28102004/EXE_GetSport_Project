import React, { useEffect, useState } from "react";

// Define the User type
interface User {
  id?: number; // Optional for new users
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserForm: React.FC<{
  user: User | null; // Allow user to be null for new user
  onSave: (user: User) => void;
  onClose: () => void;
}> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    role: "Admin",
    status: "Hoạt động",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">{user ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h1>
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Tên"
        className="border p-2 rounded-lg w-full mb-2"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className="border p-2 rounded-lg w-full mb-2"
        required
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="border p-2 rounded-lg w-full mb-2"
      >
        <option>Admin</option>
        <option>Quản lý</option>
        <option>Nhân viên</option>
        <option>Khách hàng</option>
      </select>
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="border p-2 rounded-lg w-full mb-4"
      >
        <option>Hoạt động</option>
        <option>Bị khóa</option>
      </select>
      <button type="submit" className="bg-[#23AEB1] text-white px-4 py-2 rounded-lg">
        {user ? "Cập nhật" : "Thêm"}
      </button>
      <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-lg ml-2">
        Hủy
      </button>
    </form>
  );
};

export default UserForm;