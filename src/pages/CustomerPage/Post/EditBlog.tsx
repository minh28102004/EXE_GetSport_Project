// src/pages/BlogManagement/EditBlog.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import { useGetBlogQuery, useUpdateBlogMutation } from "@redux/api/blog/blogApi";
import type { UpdateBlogDto } from "@redux/api/blog/type";

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blogData, isLoading: loadLoading, isError } = useGetBlogQuery(Number(id));
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const [formData, setFormData] = useState<UpdateBlogDto>({
    Title: "",
    Shortdesc: "",
    Content: "",
    Status: "Draft",
    Image: undefined,
  });

  useEffect(() => {
    if (blogData?.data) {
      setFormData({
        Title: blogData.data.title,
        Shortdesc: blogData.data.shortdesc || "",
        Content: blogData.data.content,
        Status: blogData.data.status || "Draft",
        Image: undefined, // Image needs to be handled separately if updating
      });
    }
  }, [blogData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, Image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlog({ id: Number(id), body: formData }).unwrap();
      toast.success("Cập nhật blog thành công!");
      navigate("/customerlayout/posts");
    } catch (error: any) {
      toast.error(error?.data?.message || "Cập nhật blog thất bại.");
    }
  };

  if (loadLoading) return <LoadingSpinner size="12" />;
  if (isError || !blogData?.data) return <div className="text-red-500">Blog không tồn tại.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiêu Đề</label>
            <input
              type="text"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô Tả Ngắn</label>
            <textarea
              name="Shortdesc"
              value={formData.Shortdesc}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nội Dung</label>
            <textarea
              name="Content"
              value={formData.Content}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-40"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Draft">Nháp</option>
              <option value="Published">Công Khai</option>
              {/* Add more statuses if needed */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hình Ảnh (Cập Nhật)</label>
            <input
              type="file"
              name="Image"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              accept="image/*"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? <LoadingSpinner inline size="4" /> : null}
              Cập Nhật
            </button>
            <button
              type="button"
              onClick={() => navigate("/customerlayout/posts")}
              className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
            >
              Hủy
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditBlog;