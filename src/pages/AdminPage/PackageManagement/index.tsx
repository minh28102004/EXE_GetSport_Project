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
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from "@redux/api/package/packageApi";
import type { Package, Paged } from "@redux/api/package/type";
import { mapUiToDto } from "@redux/api/package/map";
import { PackageFormModal } from "./PackageForm";
import { PackageDetailModal } from "./PackageDetail";

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

const PackageManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetPackagesQuery({ page, pageSize });
  const rows: Package[] = Array.isArray(data?.data)
    ? (data?.data as Package[])
    : (data?.data as Paged<Package> | undefined)?.items ?? [];

const totalPages = data?.pagination?.totalPages;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const [createPackage, { isLoading: creating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: updating }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: deleting }] = useDeletePackageMutation();
  const busy = creating || updating || deleting;

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minDurationDays, setMinDurationDays] = useState<number | undefined>();
  const [maxDurationDays, setMaxDurationDays] = useState<number | undefined>();
  const [startCreateDate, setStartCreateDate] = useState<string | undefined>();
  const [endCreateDate, setEndCreateDate] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinDurationDays(undefined);
    setMaxDurationDays(undefined);
    setStartCreateDate(undefined);
    setEndCreateDate(undefined);
    setSortBy("createdAt");
    setSortOrder("asc");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      search,
      isActive: isActiveFilter !== "all" ? isActiveFilter === "active" : undefined,
      minPrice,
      maxPrice,
      minDurationDays,
      maxDurationDays,
      startCreateDate,
      endCreateDate,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [search, isActiveFilter, minPrice, maxPrice, minDurationDays, maxDurationDays, startCreateDate, endCreateDate, sortBy, sortOrder, page, pageSize]
  );

  const { data: filteredData, isFetching: isFiltering } = useGetPackagesQuery(params, {
    skip: !search && isActiveFilter === "all" && !minPrice && !maxPrice && !minDurationDays && !maxDurationDays && !startCreateDate && !endCreateDate,
  });

  // Use rows if no filters are applied; otherwise, use filteredData
  const filteredRows: Package[] = (!search && isActiveFilter === "all" && !minPrice && !maxPrice && !minDurationDays && !maxDurationDays && !startCreateDate && !endCreateDate)
    ? rows
    : (Array.isArray(filteredData?.data)
        ? (filteredData?.data as Package[])
        : (filteredData?.data as Paged<Package> | undefined)?.items ?? []);

  // Debugging logs
  console.log("API data:", data);
  console.log("rows:", rows);
  console.log("params:", params);
  console.log("filteredData:", filteredData);
  console.log("filteredRows:", filteredRows);

  const openModal = (pkg: Package | null = null) => {
    setCurrentPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentPackage(null);
    setIsModalOpen(false);
  };

  const openDetailModal = (packageId: number) => {
    setSelectedPackageId(packageId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedPackageId(null);
    setIsDetailModalOpen(false);
  };

  const handlePackageSaved = async (packageData: Partial<Package>) => {
    try {
      if (packageData.id) {
        await updatePackage({
          id: packageData.id,
          body: mapUiToDto(packageData),
        }).unwrap();
        toast.success("Cập nhật gói thành công!");
      } else {
        await createPackage(mapUiToDto(packageData)).unwrap();
        toast.success("Tạo gói mới thành công!");
      }
      closeModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number, name?: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa gói${name ? ` "${name}"` : ""}?`);
    if (!ok) return;
    try {
      await deletePackage(id).unwrap();
      toast.success(`Đã xóa${name ? ` "${name}"` : ""}!`);
    } catch (e) {
      console.error(e);
      toast.error("Xóa thất bại, vui lòng thử lại!");
    }
  };

  const handleToggleActive = async (p: Package) => {
    try {
      await updatePackage({
        id: p.id,
        body: { Isactive: !p.isActive }, // Backend expects PascalCase
      }).unwrap();
      toast.info(`Gói "${p.name}" đã được ${p.isActive ? "khóa" : "mở khóa"}.`);
    } catch (e) {
      console.error(e);
      toast.error("Không thể đổi trạng thái gói.");
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (isError)
    return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Quản lý gói
          </h2>
          <p className="text-gray-500">
            Quản lý các gói dịch vụ trong hệ thống
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={busy}
        >
          <FaPlus />
          Tạo gói mới
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Tìm kiếm tên gói
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên gói..."
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

          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Trạng thái
            </label>
            <select
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className={filterInputCls}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Sắp xếp
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={filterInputCls}
            >
              <option value="createdAt">Ngày tạo</option>
              <option value="name">Tên</option>
              <option value="price">Giá</option>
              <option value="durationDays">Thời gian</option>
              <option value="updatedAt">Ngày cập nhật</option>
            </select>
          </div>

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

          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Giá (từ - đến)
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

          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Thời gian (từ - đến)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Từ (ngày)"
                value={minDurationDays ?? ""}
                onChange={(e) => setMinDurationDays(e.target.value ? Number(e.target.value) : undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="number"
                placeholder="Đến (ngày)"
                value={maxDurationDays ?? ""}
                onChange={(e) => setMaxDurationDays(e.target.value ? Number(e.target.value) : undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Ngày tạo (từ - đến)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startCreateDate ?? ""}
                onChange={(e) => setStartCreateDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="date"
                value={endCreateDate ?? ""}
                onChange={(e) => setEndCreateDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>

          <div className="lg:col-span-12 flex justify-end items-end">
            {search || isActiveFilter !== "all" || minPrice || maxPrice || minDurationDays || maxDurationDays || startCreateDate || endCreateDate ? (
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
          {(data?.data as Paged<Package>)?.total ?? rows.length} gói
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">Tên gói</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Thời gian (ngày)</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Ngày cập nhật</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((p, i) => (
              <tr
                key={p.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-sm font-semibold">
                      {initials(p.name)}
                    </div>
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="p-3">{p.price.toLocaleString()} VND</td>
                <td className="p-3">{p.durationDays}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "--"}
                </td>
                <td className="p-3 text-gray-600">
                  {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "--"}
                </td>
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="Xem chi tiết" arrow>
                    <button
                      onClick={() => openDetailModal(p.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEye className="text-teal-500 hover:text-teal-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sửa" arrow>
                    <button
                      onClick={() => openModal(p)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title={p.isActive ? "Khóa" : "Mở khóa"} arrow>
                    <button
                      onClick={() => handleToggleActive(p)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      {p.isActive ? (
                        <FaLock className="text-yellow-600 hover:text-yellow-700" />
                      ) : (
                        <FaUnlock className="text-green-600 hover:text-green-700" />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip title="Xóa" arrow>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={() => handleDelete(p.id, p.name)}
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
                  Không tìm thấy gói phù hợp.
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

      <PackageFormModal
        open={isModalOpen}
        package={currentPackage}
        onSave={handlePackageSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />

      {selectedPackageId && (
        <PackageDetailModal
          open={isDetailModalOpen}
          packageId={selectedPackageId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default PackageManagement;