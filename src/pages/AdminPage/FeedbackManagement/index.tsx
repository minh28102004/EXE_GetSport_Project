import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  useGetFeedbacksQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} from "@redux/api/feedback/feedbackApi";
import type { Feedback, Paged } from "@redux/api/feedback/type";
import { mapUiToCreateDto, mapUiToUpdateDto } from "@redux/api/feedback/map";
import { FeedbackFormModal } from "./FeedbackForm";
import { FeedbackDetailModal } from "./FeedbackDetail";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/features/auth/authSlice";

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

const FeedbackManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetFeedbacksQuery({ page, pageSize });

  const rows: Feedback[] = Array.isArray(data?.data)
    ? (data?.data as Feedback[])
    : (data?.data as Paged<Feedback> | undefined)?.items ?? [];
const {  userLogin } = useSelector(selectAuth);
  const totalPages = (data?.data as Paged<Feedback>)?.totalPages ?? 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);

  const [createFeedback, { isLoading: creating }] = useCreateFeedbackMutation();
  const [updateFeedback, { isLoading: updating }] = useUpdateFeedbackMutation();
  const [deleteFeedback, { isLoading: deleting }] = useDeleteFeedbackMutation();
  const busy = creating || updating || deleting;

  /* ---------------- Filters ---------------- */
  const [bookingIdFilter, setBookingIdFilter] = useState<number | undefined>();
  const [userIdFilter, setUserIdFilter] = useState<number | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();
  const [maxRating, setMaxRating] = useState<number | undefined>();
  const [startCreateDate, setStartCreateDate] = useState<string | undefined>();
  const [endCreateDate, setEndCreateDate] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("Createat");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const resetFilters = () => {
    setBookingIdFilter(undefined);
    setUserIdFilter(undefined);
    setMinRating(undefined);
    setMaxRating(undefined);
    setStartCreateDate(undefined);
    setEndCreateDate(undefined);
    setSearch("");
    setSortBy("Createat");
    setSortOrder("desc");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      bookingId: bookingIdFilter,
      userId: userIdFilter,
      minRating,
      maxRating,
      startCreateDate,
      endCreateDate,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [bookingIdFilter, userIdFilter, minRating, maxRating, startCreateDate, endCreateDate, search, sortBy, sortOrder, page, pageSize]
  );

  const { data: filteredData } = useGetFeedbacksQuery(params);
  const filteredRows: Feedback[] = Array.isArray(filteredData?.data)
    ? (filteredData?.data as Feedback[])
    : (filteredData?.data as Paged<Feedback> | undefined)?.items ?? [];

  const openModal = (feedback: Feedback | null = null) => {
    setCurrentFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentFeedback(null);
    setIsModalOpen(false);
  };

  const openDetailModal = (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedFeedbackId(null);
    setIsDetailModalOpen(false);
  };

  const handleFeedbackSaved = async (feedbackData: Partial<Feedback>) => {
    try {
      if (feedbackData.id) {
        await updateFeedback({
          id: feedbackData.id,
          body: mapUiToUpdateDto(feedbackData),
        }).unwrap();
        toast.success("Updated feedback successfully!");
      } else {
        await createFeedback(mapUiToCreateDto(feedbackData)).unwrap();
        toast.success("Created feedback successfully!");
      }
      closeModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Are you sure you want to delete feedback ${id}?`);
    if (!ok) return;
    try {
      await deleteFeedback(id).unwrap();
      toast.success(`Deleted feedback ${id}!`);
    } catch (e) {
      console.error(e);
      toast.error("Deletion failed, please try again!");
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Loading data...</div>;
  if (isError)
    return <div className="text-center p-10 text-red-500">Error loading data</div>;

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-6 md:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Feedback Management
          </h2>
          <p className="text-gray-500">
            Manage feedbacks in the system
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
            Create Feedback
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          {/* Booking ID */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Booking ID
            </label>
            <input
              type="number"
              value={bookingIdFilter ?? ""}
              onChange={(e) => setBookingIdFilter(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Booking ID..."
              className={filterInputCls}
            />
          </div>

          {/* User ID */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              User ID
            </label>
            <input
              type="number"
              value={userIdFilter ?? ""}
              onChange={(e) => setUserIdFilter(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="User ID..."
              className={filterInputCls}
            />
          </div>

          {/* Min Rating */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Min Rating
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={minRating ?? ""}
              onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="1-5"
              className={filterInputCls}
            />
          </div>

          {/* Max Rating */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Max Rating
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={maxRating ?? ""}
              onChange={(e) => setMaxRating(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="1-5"
              className={filterInputCls}
            />
          </div>

          {/* Start Create Date */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Start Create Date
            </label>
            <input
              type="datetime-local"
              value={startCreateDate ?? ""}
              onChange={(e) => setStartCreateDate(e.target.value || undefined)}
              className={filterInputCls}
            />
          </div>

          {/* End Create Date */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              End Create Date
            </label>
            <input
              type="datetime-local"
              value={endCreateDate ?? ""}
              onChange={(e) => setEndCreateDate(e.target.value || undefined)}
              className={filterInputCls}
            />
          </div>

          {/* Search */}
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
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
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={filterInputCls}
            >
              <option value="Createat">Created At</option>
              <option value="Rating">Rating</option>
              <option value="UserName">User Name</option>
              <option value="CourtLocation">Court Location</option>
              <option value="Bookingdate">Booking Date</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className={filterInputCls}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Actions */}
          <div className="lg:col-span-3 flex justify-end items-end">
            {bookingIdFilter || userIdFilter || minRating || maxRating || startCreateDate || endCreateDate || search ? (
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
          {(data?.data as Paged<Feedback>)?.total ?? 0} feedbacks
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Court Location</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((f, i) => (
              <tr
                key={f.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-sm font-semibold">
                      {initials(f.userName)}
                    </div>
                    <span>{f.userName}</span>
                  </div>
                </td>
                <td className="p-3">{f.courtLocation}</td>
                <td className="p-3">{f.rating}</td>
                <td className="p-3 truncate max-w-xs">{f.comment}</td>
                <td className="p-3">{new Date(f.createat).toLocaleString()}</td>
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="View Details" arrow>
                    <button
                      onClick={() => openDetailModal(f.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEye className="text-teal-500 hover:text-teal-700" />
                    </button>
                  </Tooltip>
                  {userLogin && userLogin.role.toLower() === "admin" &&
                  <Tooltip title="Edit" arrow>
                    <button
                      onClick={() => openModal(f)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
                  } 
                  
                  <Tooltip title="Delete" arrow>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={() => handleDelete(f.id)}
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
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  No feedback found.
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

      {/* Form Modal */}
      <FeedbackFormModal
        open={isModalOpen}
        feedback={currentFeedback}
        onSave={handleFeedbackSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />

      {/* Detail Modal */}
      {selectedFeedbackId && (
        <FeedbackDetailModal
          open={isDetailModalOpen}
          feedbackId={selectedFeedbackId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default FeedbackManagement;