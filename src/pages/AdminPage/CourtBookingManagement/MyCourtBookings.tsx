import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetMyCourtBookingsQuery,
  useCreateCourtBookingMutation,
} from "@redux/api/booking/courtBookingApi";
import type { CourtBooking, Paged } from "@redux/api/booking/type";
import { mapUiToCreateDto } from "@redux/api/booking/map";
import { CourtBookingFormModal } from "./CourtBookingForm";
import { CourtBookingDetailModal } from "./CourtBookingDetail";

const filterInputCls =
  "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm " +
  "focus:outline-none focus:ring-1 focus:ring-teal-200 focus:border-teal-400";

const MyCourtBookings: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetMyCourtBookingsQuery({ page, pageSize });

  const rows: CourtBooking[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data as Paged<CourtBooking> | undefined)?.items ?? [];

  const totalPages = (data?.data as Paged<CourtBooking>)?.totalPages ?? 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  const [createBooking, { isLoading: creating }] = useCreateCourtBookingMutation();
  const busy = creating;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const [startBookingDate, setStartBookingDate] = useState<string | undefined>();
  const [endBookingDate, setEndBookingDate] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("bookingDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMinAmount(undefined);
    setMaxAmount(undefined);
    setStartBookingDate(undefined);
    setEndBookingDate(undefined);
    setSortBy("bookingDate");
    setSortOrder("asc");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      search,
      status: statusFilter !== "all" ? statusFilter : undefined,
      minAmount,
      maxAmount,
      startBookingDate: startBookingDate ? new Date(startBookingDate) : undefined,
      endBookingDate: endBookingDate ? new Date(endBookingDate) : undefined,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [search, statusFilter, minAmount, maxAmount, startBookingDate, endBookingDate, sortBy, sortOrder, page]
  );

  const { data: filteredData, isFetching: isFiltering } = useGetMyCourtBookingsQuery(params, {
    skip: !search && statusFilter === "all" && !minAmount && !maxAmount && !startBookingDate && !endBookingDate,
  });

  const filteredRows: CourtBooking[] = (!search && statusFilter === "all" && !minAmount && !maxAmount && !startBookingDate && !endBookingDate)
    ? rows
    : (Array.isArray(filteredData?.data)
        ? filteredData.data
        : (filteredData?.data as Paged<CourtBooking> | undefined)?.items ?? []);

  console.log("MyCourtBookings: API data:", data);
  console.log("MyCourtBookings: rows:", rows);
  console.log("MyCourtBookings: params:", params);
  console.log("MyCourtBookings: filteredData:", filteredData);
  console.log("MyCourtBookings: filteredRows:", filteredRows);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDetailModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedBookingId(null);
    setIsDetailModalOpen(false);
  };

  const handleBookingSaved = async (bookingData: Partial<CourtBooking>) => {
    try {
      const result = await createBooking(mapUiToCreateDto(bookingData)).unwrap();
      toast.success("Booking created successfully! Redirecting to payment...");
      if (result.paymentLink) {
        window.location.href = result.paymentLink;
      }
      closeModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("Failed to create booking.");
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Error loading bookings.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">My Court Bookings</h2>
          <p className="text-gray-500">View and manage your court bookings</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={busy}
        >
          <FaPlus />
          Create New Booking
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by court location..."
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
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={filterInputCls}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={filterInputCls}
            >
              <option value="bookingDate">Booking Date</option>
              <option value="amount">Amount</option>
              <option value="createAt">Created At</option>
              <option value="courtLocation">Court Location</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className={filterInputCls}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Amount (from - to)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="From"
                value={minAmount ?? ""}
                onChange={(e) => setMinAmount(e.target.value ? Number(e.target.value) : undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="number"
                placeholder="To"
                value={maxAmount ?? ""}
                onChange={(e) => setMaxAmount(e.target.value ? Number(e.target.value) : undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-6">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Booking Date (from - to)</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startBookingDate ?? ""}
                onChange={(e) => setStartBookingDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
              <input
                type="date"
                value={endBookingDate ?? ""}
                onChange={(e) => setEndBookingDate(e.target.value || undefined)}
                className={`${filterInputCls} flex-1`}
              />
            </div>
          </div>
          <div className="lg:col-span-12 flex justify-end items-end">
            {search || statusFilter !== "all" || minAmount || maxAmount || startBookingDate || endBookingDate ? (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 w-full sm:w-auto px-3 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Reset
              </button>
            ) : (
              <div className="text-sm text-gray-500 text-right w-full sm:w-auto">
                Total: <span className="font-semibold">{rows.length}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Showing <span className="font-semibold">{filteredRows.length}</span> /{" "}
          {(data?.data as Paged<CourtBooking>)?.totalCount ?? rows.length} bookings
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Court</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Booking Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((b, i) => (
              <tr
                key={b.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3">{b.id}</td>
                <td className="p-3">{b.courtLocation}</td>
                <td className="p-3">
                  {new Date(b.slotStartTime).toLocaleTimeString()} -{" "}
                  {new Date(b.slotEndTime).toLocaleTimeString()}
                </td>
                <td className="p-3">{new Date(b.bookingDate).toLocaleDateString()}</td>
                <td className="p-3">{b.amount.toLocaleString()} VND</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      b.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2 items-center">
                  <button
                    onClick={() => openDetailModal(b.id)}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    disabled={busy}
                  >
                    <FaEye className="text-teal-500 hover:text-teal-700" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={7}>
                  No bookings found.
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
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || busy}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <CourtBookingFormModal
        open={isModalOpen}
        booking={null}
        onSave={handleBookingSaved}
        onClose={closeModal}
        loading={busy}
      />

      {selectedBookingId && (
        <CourtBookingDetailModal
          open={isDetailModalOpen}
          bookingId={selectedBookingId}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

export default MyCourtBookings;