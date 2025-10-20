// src/pages/BlogManagement/MyBlogs.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Edit, Trash, Eye } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import {
  useGetMyBlogsQuery,
  useDeleteBlogMutation,
} from "@redux/api/blog/blogApi";
import { selectToken } from "@redux/features/auth/authSlice";
import type { Blog, ListParams } from "@redux/api/blog/type";
import dayjs from "dayjs";

const MyBlogs: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [filterParams, setFilterParams] = useState<ListParams>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching, error, refetch } = useGetMyBlogsQuery(
    filterParams,
    {
      skip: !token,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [deleteBlog] = useDeleteBlogMutation();

  const blogs = Array.isArray(data?.data)
    ? data.data
    : (data?.data as any)?.items || [];

  const totalPages = (data?.data as any)?.totalPages || 1;

  // Handle no token
  if (!token) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-500 text-lg">Vui lòng đăng nhập để quản lý blog.</p>
          <button
            onClick={() => (window.location.href = "/auth?view=login&redirect=/customerlayout/posts")}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  // Handle API error
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-500 text-lg">
            {(error as any)?.data?.message || "Lỗi khi tải blog. Vui lòng thử lại."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <LoadingSpinner size="12" />
          <p className="text-center mt-2 text-gray-500">Đang tải blog…</p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (date: string): string => dayjs(date).format("DD/MM/YYYY HH:mm");

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa blog này?")) return;

    try {
      await deleteBlog(blogId).unwrap();
      toast.success("Xóa blog thành công!");
    } catch (e: any) {
      console.error("Delete blog error:", e);
      toast.error(e?.data?.message || "Xóa blog thất bại. Vui lòng thử lại.");
    }
  };

  // Handle edit blog
  const handleEditBlog = (blogId: number) => {
    navigate(`/edit-blog/${blogId}`);
  };

  // Handle view blog
  const handleViewBlog = (blogId: number) => {
    navigate(`/blogPost/${blogId}`);
  };

  // Handle create new blog
  const handleCreateBlog = () => {
    navigate("/create-blog");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#23AEB1]" />
            Blog Của Tôi
          </h1>
          <button
            onClick={handleCreateBlog}
            className="px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Tạo Blog Mới
          </button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            Bạn chưa có blog nào.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Blog List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-sm font-semibold text-gray-700">Tiêu Đề</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Ngày Tạo</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Trạng Thái</th>
                    <th className="p-3 text-sm font-semibold text-gray-700">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog: Blog) => (
                    <tr
                      key={blog.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-sm text-gray-900">{blog.title}</td>
                      <td className="p-3 text-sm text-gray-900">{formatDate(blog.createdAt)}</td>
                      <td className="p-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : blog.status === "Draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewBlog(blog.id)}
                            className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-200 transition-all duration-200 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Xem
                          </button>
                          <button
                            onClick={() => handleEditBlog(blog.id)}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-all duration-200 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-all duration-200 flex items-center gap-1"
                          >
                            <Trash className="w-4 h-4" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filterParams.page === page
                        ? "bg-[#23AEB1] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isFetching && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
            <LoadingSpinner inline size="4" />
            <span className="text-sm text-gray-600">Đang đồng bộ dữ liệu…</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBlogs;