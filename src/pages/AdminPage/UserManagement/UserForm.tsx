import React, { useState } from "react";

interface Court {
  id?: number;
  name: string;
  type: string;
  status: "Hoạt động" | "Bảo trì";
  price: string;
  time: string;
}

interface CourtFormProps {
  court: Court | null;
  onSave: (court: Court) => void;
  onClose: () => void;
}

const CourtForm: React.FC<CourtFormProps> = ({ court, onSave, onClose }) => {
  const [formData, setFormData] = useState<Court>(
    court || { name: "", type: "", status: "Hoạt động", price: "", time: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">
        {court ? "Chỉnh sửa sân" : "Thêm sân mới"}
      </h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Tên sân"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Loại sân"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="Hoạt động">Hoạt động</option>
        <option value="Bảo trì">Bảo trì</option>
      </select>

      <input
        type="text"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Giá thuê"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="time"
        value={formData.time}
        onChange={handleChange}
        placeholder="Thời gian hoạt động"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#23AEB1] text-white rounded hover:bg-[#1e9697]"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default CourtForm;
