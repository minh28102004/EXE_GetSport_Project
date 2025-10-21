import React, { useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '@redux/api/blog/blogApi';
import type { Blog, Paged } from '@redux/api/blog/type';
import { mapUiToDto } from '@redux/api/blog/map';
import { BlogFormModal } from './BlogForm';
import { BlogDetailModal } from './BlogDetail';

const initials = (name?: string) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const filterInputCls =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm ' +
  'focus:outline-none focus:ring-1 focus:ring-teal-200 focus:border-teal-400';

const BlogManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>('createdat');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const params = useMemo(
    () => ({
      search,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [search, statusFilter, startDate, endDate, sortBy, sortOrder, page]
  );

  const { data, isLoading, isError } = useGetBlogsQuery(params);
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();
  const busy = creating || updating || deleting;

  const rows: Blog[] = Array.isArray(data?.data)
    ? (data?.data as Blog[])
    : (data?.data as Paged<Blog> | undefined)?.items ?? [];
const totalPages = data?.pagination?.totalPages;
  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy('createdat');
    setSortOrder('desc');
    setPage(1);
  };

  const openModal = (blog: Blog | null = null) => {
    setCurrentBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentBlog(null);
    setIsModalOpen(false);
  };

  const openDetailModal = (blogId: number) => {
    setSelectedBlogId(blogId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedBlogId(null);
    setIsDetailModalOpen(false);
  };

  const handleBlogSaved = async (blogData: Partial<Blog> & { Image?: File }) => {
    try {
      if (blogData.id) {
        await updateBlog({
          id: blogData.id,
          body: mapUiToDto(blogData),
        }).unwrap();
        toast.success('Cập nhật blog thành công!');
      } else {
        await createBlog(mapUiToDto(blogData)).unwrap();
        toast.success('Tạo blog mới thành công!');
      }
      closeModal();
      setPage(1);
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.Message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id: number, title?: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa blog${title ? ` "${title}"` : ''}?`);
    if (!ok) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success(`Đã xóa${title ? ` "${title}"` : ''}!`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.Message || 'Xóa thất bại, vui lòng thử lại!');
    }
  };

  if (isLoading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý Blog</h2>
          <p className="text-gray-500">Quản lý bài viết blog trong hệ thống</p>
        </div>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 disabled:opacity-70"
          disabled={busy}
        >
          <FaPlus />
          Tạo Blog mới
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Tìm kiếm</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tiêu đề hoặc mô tả..."
                className={`${filterInputCls} pl-9 pr-9`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              )}
            </div>
          </div>
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={filterInputCls}
            >
              <option value="all">Tất cả</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Banned">Banned</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Sắp xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={filterInputCls}
            >
              <option value="createdat">Ngày tạo</option>
              <option value="title">Tiêu đề</option>
              <option value="updatedat">Ngày cập nhật</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Thứ tự</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className={filterInputCls}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Ngày (từ - đến)</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate ?? ''}
                onChange={(e) => setStartDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="date"
                value={endDate ?? ''}
                onChange={(e) => setEndDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>
          <div className="lg:col-span-12 flex justify-end items-end">
            {search || statusFilter !== 'all' || startDate || endDate ? (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 w-full sm:w-auto px-3 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Reset
              </button>
            ) : (
              <div className="text-sm text-gray-500 text-right w-full sm:w-auto">
                Tổng: <span className="font-semibold">{rows.length}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Đang hiển thị <span className="font-semibold">{rows.length}</span> /{' '}
          {(data?.data as Paged<Blog>)?.total ?? 0} bài viết
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">Tác giả</th>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Mô tả ngắn</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Ngày cập nhật</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <tr
                key={b.id}
                className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-sm font-semibold">
                      {initials(b.authorName)}
                    </div>
                    <span>{b.authorName}</span>
                  </div>
                </td>
                <td className="p-3">{b.title}</td>
                <td className="p-3">{b.shortdesc ?? '--'}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'Published'
                        ? 'bg-green-100 text-green-700'
                        : b.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : b.status === 'Banned'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {b.status ?? '--'}
                  </span>
                </td>
                <td className="p-3">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : '--'}
                </td>
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="Xem chi tiết" arrow>
                    <button
                      onClick={() => openDetailModal(b.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEye className="text-teal-500 hover:text-teal-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sửa" arrow>
                    <button
                      onClick={() => openModal(b)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Xóa" arrow>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={7}>
                  Không tìm thấy bài viết phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || busy}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-3 py-1">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || busy}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      <BlogFormModal
        open={isModalOpen}
        blog={currentBlog}
        onSave={handleBlogSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />
      {selectedBlogId && (
        <BlogDetailModal
          open={isDetailModalOpen}
          blogId={selectedBlogId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default BlogManagement;