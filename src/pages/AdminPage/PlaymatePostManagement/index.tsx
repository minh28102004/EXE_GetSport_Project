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
  useGetPlaymatePostsQuery,
  useCreatePlaymatePostMutation,
  useUpdatePlaymatePostMutation,
  useDeletePlaymatePostMutation,
} from "@redux/api/playmatePost/playmatePostApi";
import type { PlaymatePost, Paged } from "@redux/api/playmatePost/type";
import { mapUiToCreateDto, mapUiToUpdateDto } from "@redux/api/playmatePost/map";
import { PlaymatePostFormModal } from "./PlaymatePostForm";
import { PlaymatePostDetailModal } from "./PlaymatePostDetail";

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

const PlaymatePostManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetPlaymatePostsQuery({ page, pageSize });

  const rows: PlaymatePost[] = Array.isArray(data?.data)
    ? (data?.data as PlaymatePost[])
    : (data?.data as Paged<PlaymatePost> | undefined)?.items ?? [];

  const totalPages = (data?.data as Paged<PlaymatePost>)?.totalPages ?? 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<PlaymatePost | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [createPost, { isLoading: creating }] = useCreatePlaymatePostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePlaymatePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePlaymatePostMutation();
  const busy = creating || updating || deleting;

  /* ---------------- Filters ---------------- */
  const [courtbookingIdFilter, setCourtbookingIdFilter] = useState<number | undefined>();
  const [userIdFilter, setUserIdFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [skilllevelFilter, setSkilllevelFilter] = useState<string | undefined>();
  const [minNeededPlayers, setMinNeededPlayers] = useState<number | undefined>();
  const [maxNeededPlayers, setMaxNeededPlayers] = useState<number | undefined>();
  const [startCreateDate, setStartCreateDate] = useState<string | undefined>();
  const [endCreateDate, setEndCreateDate] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("Createdat");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const resetFilters = () => {
    setCourtbookingIdFilter(undefined);
    setUserIdFilter(undefined);
    setStatusFilter(undefined);
    setSkilllevelFilter(undefined);
    setMinNeededPlayers(undefined);
    setMaxNeededPlayers(undefined);
    setStartCreateDate(undefined);
    setEndCreateDate(undefined);
    setSearch("");
    setSortBy("Createdat");
    setSortOrder("desc");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      courtbookingId: courtbookingIdFilter,
      userId: userIdFilter,
      status: statusFilter,
      skilllevel: skilllevelFilter,
      minNeededPlayers,
      maxNeededPlayers,
      startCreateDate,
      endCreateDate,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [
      courtbookingIdFilter,
      userIdFilter,
      statusFilter,
      skilllevelFilter,
      minNeededPlayers,
      maxNeededPlayers,
      startCreateDate,
      endCreateDate,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    ]
  );

  const { data: filteredData } = useGetPlaymatePostsQuery(params);
  const filteredRows: PlaymatePost[] = Array.isArray(filteredData?.data)
    ? (filteredData?.data as PlaymatePost[])
    : (filteredData?.data as Paged<PlaymatePost> | undefined)?.items ?? [];

  const openModal = (post: PlaymatePost | null = null) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentPost(null);
    setIsModalOpen(false);
  };

  const openDetailModal = (postId: number) => {
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedPostId(null);
    setIsDetailModalOpen(false);
  };

  const handlePostSaved = async (postData: Partial<PlaymatePost>) => {
    try {
      if (postData.id) {
        await updatePost({
          id: postData.id,
          body: mapUiToUpdateDto(postData),
        }).unwrap();
        toast.success("Updated playmate post successfully!");
      } else {
        await createPost(mapUiToCreateDto(postData)).unwrap();
        toast.success("Created playmate post successfully!");
      }
      closeModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Are you sure you want to delete playmate post ${id}?`);
    if (!ok) return;
    try {
      await deletePost(id).unwrap();
      toast.success(`Deleted playmate post ${id}!`);
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
            Playmate Post Management
          </h2>
          <p className="text-gray-500">
            Manage playmate posts in the system
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
            Create Playmate Post
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
              value={courtbookingIdFilter ?? ""}
              onChange={(e) => setCourtbookingIdFilter(e.target.value ? Number(e.target.value) : undefined)}
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

          {/* Status */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Status
            </label>
            <select
              value={statusFilter ?? ""}
              onChange={(e) => setStatusFilter(e.target.value || undefined)}
              className={filterInputCls}
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Skill Level */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Skill Level
            </label>
            <input
              type="text"
              value={skilllevelFilter ?? ""}
              onChange={(e) => setSkilllevelFilter(e.target.value || undefined)}
              placeholder="Skill level..."
              className={filterInputCls}
            />
          </div>

          {/* Min Needed Players */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Min Needed Players
            </label>
            <input
              type="number"
              min={1}
              value={minNeededPlayers ?? ""}
              onChange={(e) => setMinNeededPlayers(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Min players..."
              className={filterInputCls}
            />
          </div>

          {/* Max Needed Players */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Max Needed Players
            </label>
            <input
              type="number"
              min={1}
              value={maxNeededPlayers ?? ""}
              onChange={(e) => setMaxNeededPlayers(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Max players..."
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
              <option value="Createdat">Created At</option>
              <option value="Neededplayers">Needed Players</option>
              <option value="UserName">User Name</option>
              <option value="CourtName">Court Name</option>
              <option value="CourtLocation">Court Location</option>
              <option value="Bookingdate">Booking Date</option>
              <option value="SlotStarttime">Slot Start Time</option>
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
            {courtbookingIdFilter || userIdFilter || statusFilter || skilllevelFilter || minNeededPlayers || maxNeededPlayers || startCreateDate || endCreateDate || search ? (
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
          {(data?.data as Paged<PlaymatePost>)?.total ?? 0} playmate posts
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Court Location</th>
              <th className="p-3">Title</th>
              <th className="p-3">Players</th>
              <th className="p-3">Skill Level</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
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
                      {initials(p.userName)}
                    </div>
                    <span>{p.userName}</span>
                  </div>
                </td>
                <td className="p-3">{p.courtLocation}</td>
                <td className="p-3 truncate max-w-xs">{p.title}</td>
                <td className="p-3">{p.currentPlayers}/{p.neededplayers}</td>
                <td className="p-3">{p.skilllevel}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">{new Date(p.createdat).toLocaleString()}</td>
                <td className="p-3 flex gap-2 items-center">
                  <Tooltip title="View Details" arrow>
                    <button
                      onClick={() => openDetailModal(p.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEye className="text-teal-500 hover:text-teal-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <button
                      onClick={() => openModal(p)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={() => handleDelete(p.id)}
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
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No playmate posts found.
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
      <PlaymatePostFormModal
        open={isModalOpen}
        onSave={handlePostSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
        initialData={currentPost}
      />

      {/* Detail Modal */}
      {selectedPostId && (
        <PlaymatePostDetailModal
          open={isDetailModalOpen}
          postId={selectedPostId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default PlaymatePostManagement;