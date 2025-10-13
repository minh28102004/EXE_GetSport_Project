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
  useGetCourtSlotsQuery,
  useCreateCourtSlotMutation,
  useCreateBulkCourtSlotMutation,
  useUpdateCourtSlotMutation,
  useDeleteCourtSlotMutation,
  useUpdateCourtSlotAvailabilityMutation,
} from "@redux/api/courtSlot/courtSlotApi";
import type { CourtSlot, Paged } from "@redux/api/courtSlot/type";
import { mapUiToCreateDto, mapUiToBulkCreateDto, mapUiToUpdateDto } from "@redux/api/courtSlot/map";
import { CourtSlotFormModal } from "./CourtSlotForm";
import { CourtSlotDetailModal } from "./CourtSlotDetail";
import { BulkCourtSlotFormModal } from "./BulkCourtSlotForm";

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

const CourtSlotManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetCourtSlotsQuery({ page, pageSize });

  const rows: CourtSlot[] = Array.isArray(data?.data)
    ? (data?.data as CourtSlot[])
    : (data?.data as Paged<CourtSlot> | undefined)?.items ?? [];

  const totalPages = (data?.data as Paged<CourtSlot>)?.totalPages ?? 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<CourtSlot | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [createCourtSlot, { isLoading: creating }] = useCreateCourtSlotMutation();
  const [createBulkCourtSlot, { isLoading: bulkCreating }] = useCreateBulkCourtSlotMutation();
  const [updateCourtSlot, { isLoading: updating }] = useUpdateCourtSlotMutation();
  const [deleteCourtSlot, { isLoading: deleting }] = useDeleteCourtSlotMutation();
  const [updateAvailability, { isLoading: availabilityUpdating }] = useUpdateCourtSlotAvailabilityMutation();
  const busy = creating || bulkCreating || updating || deleting || availabilityUpdating;

  /* ---------------- Filters ---------------- */
  const [courtIdFilter, setCourtIdFilter] = useState<number | undefined>();
  const [isAvailableFilter, setIsAvailableFilter] = useState<string>("all");
  const [startDateTime, setStartDateTime] = useState<string | undefined>();
  const [endDateTime, setEndDateTime] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("startTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const resetFilters = () => {
    setCourtIdFilter(undefined);
    setIsAvailableFilter("all");
    setStartDateTime(undefined);
    setEndDateTime(undefined);
    setSearch("");
    setSortBy("startTime");
    setSortOrder("asc");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      courtId: courtIdFilter,
      isAvailable: isAvailableFilter !== "all" ? isAvailableFilter === "true" : undefined,
      startDateTime,
      endDateTime,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [courtIdFilter, isAvailableFilter, startDateTime, endDateTime, search, sortBy, sortOrder, page, pageSize]
  );

  const { data: filteredData } = useGetCourtSlotsQuery(params);
  const filteredRows: CourtSlot[] = Array.isArray(filteredData?.data)
    ? (filteredData?.data as CourtSlot[])
    : (filteredData?.data as Paged<CourtSlot> | undefined)?.items ?? [];

  const openModal = (slot: CourtSlot | null = null) => {
    setCurrentSlot(slot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentSlot(null);
    setIsModalOpen(false);
  };

  const openBulkModal = () => {
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
  };

  const openDetailModal = (slotId: number) => {
    setSelectedSlotId(slotId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedSlotId(null);
    setIsDetailModalOpen(false);
  };

  const handleCourtSlotSaved = async (slotData: Partial<CourtSlot>) => {
    try {
      if (slotData.id) {
        await updateCourtSlot({
          id: slotData.id,
          body: mapUiToUpdateDto(slotData),
        }).unwrap();
        toast.success("Cập nhật slot thành công!");
      } else {
        await createCourtSlot(mapUiToCreateDto(slotData)).unwrap();
        toast.success("Tạo slot mới thành công!");
      }
      closeModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleBulkCourtSlotSaved = async (bulkData: Partial<CourtSlot>) => {
    try {
      await createBulkCourtSlot(mapUiToBulkCreateDto(bulkData)).unwrap();
      toast.success("Tạo bulk slot thành công!");
      closeBulkModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Bạn có chắc muốn xoá slot ${id}?`);
    if (!ok) return;
    try {
      await deleteCourtSlot(id).unwrap();
      toast.success(`Đã xoá slot ${id}!`);
    } catch (e) {
      console.error(e);
      toast.error("Xoá thất bại, vui lòng thử lại!");
    }
  };

  const handleToggleAvailable = async (s: CourtSlot) => {
    try {
      await updateAvailability({
        id: s.id,
        isAvailable: !s.isAvailable,
      }).unwrap();
      toast.info(`Slot "${s.id}" đã được ${s.isAvailable ? "khóa" : "mở khóa"}.`);
    } catch (e) {
      console.error(e);
      toast.error("Không thể đổi trạng thái slot.");
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
            Quản lý slot sân
          </h2>
          <p className="text-gray-500">
            Quản lý slot sân và trạng thái trong hệ thống
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
            disabled={busy}
          >
            <FaPlus />
            Tạo slot mới
          </button>
          <button
            type="button"
            onClick={openBulkModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
            disabled={busy}
          >
            <FaPlus />
            Tạo bulk slot
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          {/* Court ID */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Court ID
            </label>
            <input
              type="number"
              value={courtIdFilter ?? ""}
              onChange={(e) => setCourtIdFilter(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Court ID..."
              className={filterInputCls}
            />
          </div>

          {/* Is Available */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Trạng thái
            </label>
            <select
              value={isAvailableFilter}
              onChange={(e) => setIsAvailableFilter(e.target.value)}
              className={filterInputCls}
            >
              <option value="all">Tất cả</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          {/* Start Date Time */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Start Date Time
            </label>
            <input
              type="datetime-local"
              value={startDateTime ?? ""}
              onChange={(e) => setStartDateTime(e.target.value || undefined)}
              className={filterInputCls}
            />
          </div>

          {/* End Date Time */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              End Date Time
            </label>
            <input
              type="datetime-local"
              value={endDateTime ?? ""}
              onChange={(e) => setEndDateTime(e.target.value || undefined)}
              className={filterInputCls}
            />
          </div>

          {/* Search */}
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Tìm kiếm
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
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

          {/* Sort By */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Sắp xếp
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={filterInputCls}
            >
              <option value="startTime">Start Time</option>
              <option value="endTime">End Time</option>
              <option value="slotNumber">Slot Number</option>
              <option value="courtLocation">Court Location</option>
              <option value="ownerName">Owner Name</option>
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

          {/* Actions */}
          <div className="lg:col-span-3 flex justify-end items-end">
            {courtIdFilter || isAvailableFilter !== "all" || startDateTime || endDateTime || search ? (
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
          {(data?.data as Paged<CourtSlot>)?.total ?? 0} slot
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">Chủ sân</th>
              <th className="p-3">Vị trí sân</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Bắt đầu</th>
              <th className="p-3">Kết thúc</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((s, i) => (
              <tr
                key={s.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-sm font-semibold">
                      {initials(s.ownerName)}
                    </div>
                    <span>{s.ownerName}</span>
                  </div>
                </td>
                <td className="p-3">{s.courtLocation}</td>
                <td className="p-3">{s.slotNumber}</td>
                <td className="p-3">{new Date(s.startTime).toLocaleString()}</td>
                <td className="p-3">{new Date(s.endTime).toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="Xem chi tiết" arrow>
                    <button
                      onClick={() => openDetailModal(s.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEye className="text-teal-500 hover:text-teal-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sửa" arrow>
                    <button
                      onClick={() => openModal(s)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title={s.isAvailable ? "Khóa" : "Mở khóa"} arrow>
                    <button
                      onClick={() => handleToggleAvailable(s)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      {s.isAvailable ? (
                        <FaLock className="text-yellow-600 hover:text-yellow-700" />
                      ) : (
                        <FaUnlock className="text-green-600 hover:text-green-700" />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip title="Xoá" arrow>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={() => handleDelete(s.id)}
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
                <td className="p-6 text-center text-gray-500" colSpan={7}>
                  Không tìm thấy slot phù hợp.
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
      <CourtSlotFormModal
        open={isModalOpen}
        slot={currentSlot}
        onSave={handleCourtSlotSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />

      {/* Bulk Form Modal */}
      <BulkCourtSlotFormModal
        open={isBulkModalOpen}
        onSave={handleBulkCourtSlotSaved}
        onClose={busy ? () => {} : closeBulkModal}
        loading={busy}
      />

      {/* Detail Modal */}
      {selectedSlotId && (
        <CourtSlotDetailModal
          open={isDetailModalOpen}
          slotId={selectedSlotId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default CourtSlotManagement;