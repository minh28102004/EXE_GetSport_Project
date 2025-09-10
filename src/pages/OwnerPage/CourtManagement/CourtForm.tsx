import React, { useEffect, useState } from "react";

export interface Court {   // ✅ export interface
  id?: number;
  name: string;
  type: string;
  status: string;
  price?: string;
  time?: string;
}

interface CourtFormProps {
  court: Court | null; // null = thêm mới
  onSave: (court: Court) => void;
  onClose: () => void;
}

const CourtForm: React.FC<CourtFormProps> = ({ court, onSave, onClose }) => {
  const [formData, setFormData] = useState<Court>({
    name: "",
    type: "Bóng đá",
    status: "Hoạt động",
  });

  // Nếu có dữ liệu cũ => set vào form
  useEffect(() => {
    if (court) setFormData(court);
  }, [court]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-[400px] max-w-full">
      <h2 className="text-xl font-bold mb-4">
        {court ? "Chỉnh sửa sân" : "Thêm sân"}
      </h2>
      <input
        type="text"
        placeholder="Tên sân"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border p-2 w-full rounded mb-2"
        required
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="border p-2 w-full rounded mb-2"
      >
        <option>Bóng đá</option>
        <option>Bóng rổ</option>
        <option>Cầu lông</option>
      </select>
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="border p-2 w-full rounded mb-4"
      >
        <option>Hoạt động</option>
        <option>Bảo trì</option>
      </select>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#23AEB1] text-white px-4 py-2 rounded"
        >
          {court ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 bg-gray-300 px-4 py-2 rounded"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default CourtForm;
