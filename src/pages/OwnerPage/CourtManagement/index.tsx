import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaLock,
  FaUnlock,
  FaEye,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  useGetCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeleteCourtMutation,
} from "@redux/api/court/courtApi";
import type { Court, Paged } from "@redux/api/court/type";
import { mapUiToDto } from "@redux/api/court/map";
import { CourtFormModal } from "./CourtForm";
import { CourtDetailModal } from "./CourtDetail";

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

const CourtManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetCourtsQuery({ page, pageSize });

  const rows: Court[] = Array.isArray(data?.data)
    ? (data?.data as Court[])
    : (data?.data as Paged<Court> | undefined)?.items ?? [];

  const totalPages = (data?.data as Paged<Court>)?.totalPages ?? 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentCourt, setCurrentCourt] = useState<Court | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);

  const [createCourt, { isLoading: creating }] = useCreateCourtMutation();
  const [updateCourt, { isLoading: updating }] = useUpdateCourtMutation();
  const [deleteCourt, { isLoading: deleting }] = useDeleteCourtMutation();
  const busy = creating || updating || deleting;

  /* ---------------- Filters ---------------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Reset filters và refetch với page=1
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy("priority");
    setSortOrder("asc");
    setPage(1);
  };

  // Params cho query
  const params = useMemo(
    () => ({
      search,
      status: statusFilter !== "all" ? statusFilter : undefined,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [search, statusFilter, minPrice, maxPrice, startDate, endDate, sortBy, sortOrder, page, pageSize]
  );

  // Refetch khi params thay đổi (RTK Query tự handle)
  const { data: filteredData } = useGetCourtsQuery(params);

  const filteredRows: Court[] = Array.isArray(filteredData?.data)
    ? (filteredData?.data as Court[])
    : (filteredData?.data as Paged<Court> | undefined)?.items ?? [];

  const openModal = (court: Court | null = null) => {
    setCurrentCourt(court);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCourt(null);
    setIsModalOpen(false);
  };

  const openDetailModal = (courtId: number) => {
    setSelectedCourtId(courtId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedCourtId(null);
    setIsDetailModalOpen(false);
  };

  const handleCourtSaved = async (courtData: Partial<Court> & { images?: File[] }) => {
    try {
      if (courtData.id) {
        await updateCourt({
          id: courtData.id,
          body: mapUiToDto(courtData),
        }).unwrap();
        toast.success("Cập nhật sân thành công!");
      } else {
        await createCourt(mapUiToDto(courtData)).unwrap();
        toast.success("Tạo sân mới thành công!");
      }
      closeModal();
      // Refetch
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number, name?: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xoá sân${name ? ` "${name}"` : ""}?`);
    if (!ok) return;
    try {
      await deleteCourt(id).unwrap();
      toast.success(`Đã xoá${name ? ` "${name}"` : ""}!`);
    } catch (e) {
      console.error(e);
      toast.error("Xoá thất bại, vui lòng thử lại!");
    }
  };

  const handleToggleActive = async (c: Court) => {
    try {
      await updateCourt({
        id: c.id,
        body: { isActive: !c.isActive },
      }).unwrap();
      toast.info(`Sân "${c.name}" đã được ${c.isActive ? "khóa" : "mở khóa"}.`);
    } catch (e) {
      console.error(e);
      toast.error("Không thể đổi trạng thái sân.");
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError)
    return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-6 md:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Quản lý sân
          </h2>
          <p className="text-gray-500">
            Quản lý sân và trạng thái trong hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={busy}
        >
          <FaPlus />
          Tạo sân mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          {/* Search */}
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Tìm kiếm tên hoặc tiện ích
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên sân hoặc tiện ích..."
                className={`${filterInputCls} pl-9 pr-9`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={filterInputCls}
            >
              <option value="all">Tất cả</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Sort */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Sắp xếp
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={filterInputCls}
            >
              <option value="priority">Ưu tiên</option>
              <option value="name">Tên</option>
              <option value="priceperhour">Giá</option>
              <option value="location">Vị trí</option>
              <option value="startdate">Ngày bắt đầu</option>
              <option value="enddate">Ngày kết thúc</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Thứ tự
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className={filterInputCls}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Giá/giờ (từ - đến)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={minPrice ?? ""}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="number"
                placeholder="Đến"
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Ngày (từ - đến)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate ?? ""}
                onChange={(e) => setStartDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="date"
                value={endDate ?? ""}
                onChange={(e) => setEndDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-12 flex justify-end items-end">
            {search || statusFilter !== "all" || minPrice || maxPrice || startDate || endDate ? (
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
          Đang hiển thị <span className="font-semibold">{filteredRows.length}</span> /{" "}
          {(data?.data as Paged<Court>)?.total ?? 0} sân
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">Tên sân</th>
              <th className="p-3">Vị trí</th>
              <th className="p-3">Giá/giờ</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ưu tiên</th>
              <th className="p-3">Ngày bắt đầu</th>
              <th className="p-3">Ngày kết thúc</th>
              <th className="p-3">Hoạt động</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((c, i) => (
              <tr
                key={c.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3">{c.name ?? "--"}</td>
                <td className="p-3">{c.location}</td>
                <td className="p-3">{c.pricePerHour.toLocaleString()} VND</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : c.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status ?? "--"}
                  </span>
                </td>
                <td className="p-3">{c.priority}</td>
                <td className="p-3 text-gray-600">
                  {c.startDate ? new Date(c.startDate).toLocaleDateString() : "--"}
                </td>
                <td className="p-3 text-gray-600">
                  {c.endDate ? new Date(c.endDate).toLocaleDateString() : "--"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.isActive ? "active" : "inactive"}
                  </span>
                </td>
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="Xem chi tiết" arrow>
                    <button
                      onClick={() => openDetailModal(c.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEye className="text-teal-500 hover:text-teal-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sửa" arrow>
                    <button
                      onClick={() => openModal(c)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title={c.isActive ? "Khóa" : "Mở khóa"} arrow>
                    <button
                      onClick={() => handleToggleActive(c)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      {c.isActive ? (
                        <FaLock className="text-yellow-600 hover:text-yellow-700" />
                      ) : (
                        <FaUnlock className="text-green-600 hover:text-green-700" />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip title="Xoá" arrow>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={() => handleDelete(c.id, c.name)}
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
                <td className="p-6 text-center text-gray-500" colSpan={10}>
                  Không tìm thấy sân phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || busy}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-3 py-1">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || busy}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Form Modal */}
      <CourtFormModal
        open={isModalOpen}
        court={currentCourt}
        onSave={handleCourtSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />

      {/* Detail Modal */}
      {selectedCourtId && (
        <CourtDetailModal
          open={isDetailModalOpen}
          courtId={selectedCourtId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default CourtManagement;