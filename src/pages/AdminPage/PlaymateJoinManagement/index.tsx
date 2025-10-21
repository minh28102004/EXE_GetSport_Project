import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSearch,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  useGetPlaymateJoinsQuery,
  useCreatePlaymateJoinMutation,
  useDeletePlaymateJoinMutation,
} from "@redux/api/playmateJoin/playmateJoinApi";
import type { PlaymateJoin, Paged } from "@redux/api/playmateJoin/type";
import { mapUiToCreateDto } from "@redux/api/playmateJoin/map";
import { PlaymateJoinFormModal } from "./PlaymateJoinForm";
import { PlaymateJoinDetailModal } from "./PlaymateJoinDetail";

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

const PlaymateJoinManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetPlaymateJoinsQuery({ page, pageSize });

  const rows: PlaymateJoin[] = Array.isArray(data?.data)
    ? (data?.data as PlaymateJoin[])
    : (data?.data as Paged<PlaymateJoin> | undefined)?.items ?? [];

const totalPages = data?.pagination?.totalPages;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentJoin, setCurrentJoin] = useState<PlaymateJoin | null>(null);
  const [selectedJoinId, setSelectedJoinId] = useState<number | null>(null);

  const [createJoin, { isLoading: creating }] = useCreatePlaymateJoinMutation();
  const [deleteJoin, { isLoading: deleting }] = useDeletePlaymateJoinMutation();
  const busy = creating || deleting;

  /* ---------------- Filters ---------------- */
  const [postIdFilter, setPostIdFilter] = useState<number | undefined>();
  const [userIdFilter, setUserIdFilter] = useState<number | undefined>();
  const [startJoinedDate, setStartJoinedDate] = useState<string | undefined>();
  const [endJoinedDate, setEndJoinedDate] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("Joinedat");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const resetFilters = () => {
    setPostIdFilter(undefined);
    setUserIdFilter(undefined);
    setStartJoinedDate(undefined);
    setEndJoinedDate(undefined);
    setSearch("");
    setSortBy("Joinedat");
    setSortOrder("desc");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      postId: postIdFilter,
      userId: userIdFilter,
      startJoinedDate,
      endJoinedDate,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }),
    [
      postIdFilter,
      userIdFilter,
      startJoinedDate,
      endJoinedDate,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    ]
  );

  const { data: filteredData } = useGetPlaymateJoinsQuery(params);
  const filteredRows: PlaymateJoin[] = Array.isArray(filteredData?.data)
    ? (filteredData?.data as PlaymateJoin[])
    : (filteredData?.data as Paged<PlaymateJoin> | undefined)?.items ?? [];

  const openModal = (join: PlaymateJoin | null = null) => {
    setCurrentJoin(join);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentJoin(null);
    setIsModalOpen(false);
  };

  const openDetailModal = (joinId: number) => {
    setSelectedJoinId(joinId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedJoinId(null);
    setIsDetailModalOpen(false);
  };

  const handleJoinSaved = async (joinData: Partial<PlaymateJoin>) => {
    try {
      await createJoin(mapUiToCreateDto(joinData)).unwrap();
      toast.success("Joined playmate post successfully!");
      closeModal();
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Are you sure you want to delete playmate join ${id}?`);
    if (!ok) return;
    try {
      await deleteJoin(id).unwrap();
      toast.success(`Deleted playmate join ${id}!`);
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
            Playmate Join Management
          </h2>
          <p className="text-gray-500">
            Manage playmate joins in the system
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
            Join Playmate Post
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3 md:p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3">
          {/* Post ID */}
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Post ID
            </label>
            <input
              type="number"
              value={postIdFilter ?? ""}
              onChange={(e) => setPostIdFilter(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Post ID..."
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

          {/* Start Joined Date */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Start Joined Date
            </label>
            <input
              type="datetime-local"
              value={startJoinedDate ?? ""}
              onChange={(e) => setStartJoinedDate(e.target.value || undefined)}
              className={filterInputCls}
            />
          </div>

          {/* End Joined Date */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              End Joined Date
            </label>
            <input
              type="datetime-local"
              value={endJoinedDate ?? ""}
              onChange={(e) => setEndJoinedDate(e.target.value || undefined)}
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
              <option value="Joinedat">Joined At</option>
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
            {postIdFilter || userIdFilter || startJoinedDate || endJoinedDate || search ? (
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
          {(data?.data as Paged<PlaymateJoin>)?.total ?? 0} playmate joins
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Court Location</th>
              <th className="p-3">Post Title</th>
              <th className="p-3">Players</th>
              <th className="p-3">Skill Level</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined At</th>
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
                <td className="p-3 truncate max-w-xs">{p.postTitle}</td>
                <td className="p-3">{p.currentPlayers}/{p.neededplayers}</td>
                <td className="p-3">{p.postSkilllevel}</td>
                <td className="p-3">{p.postStatus}</td>
                <td className="p-3">{new Date(p.joinedat).toLocaleString()}</td>
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
                  No playmate joins found.
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
      <PlaymateJoinFormModal
        open={isModalOpen}
        onSave={handleJoinSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
        initialData={currentJoin}
      />

      {/* Detail Modal */}
      {selectedJoinId && (
        <PlaymateJoinDetailModal
          open={isDetailModalOpen}
          joinId={selectedJoinId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  );
};

export default PlaymateJoinManagement;