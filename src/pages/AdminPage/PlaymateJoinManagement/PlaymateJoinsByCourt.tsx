import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaTrash,
  FaEye,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  useGetPlaymateJoinsByCourtQuery,
  useDeletePlaymateJoinMutation,
} from "@redux/api/playmateJoin/playmateJoinApi";
import type { PlaymateJoin } from "@redux/api/playmateJoin/type";
import { PlaymateJoinDetailModal } from "./PlaymateJoinDetail";

const PlaymateJoinsByCourt: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const parsedCourtId = courtId ? Number.parseInt(courtId, 10) : 0;

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJoinId, setSelectedJoinId] = useState<number | null>(null);

  const [deleteJoin, { isLoading: deleting }] = useDeletePlaymateJoinMutation();
  const busy = deleting;

  const { data, isLoading, isError } = useGetPlaymateJoinsByCourtQuery({ courtId: parsedCourtId });

  const rows: PlaymateJoin[] = Array.isArray(data?.data)
    ? (data?.data as PlaymateJoin[])
    : (data?.data as Paged<PlaymateJoin> | undefined)?.items ?? [];

  const openDetailModal = (joinId: number) => {
    setSelectedJoinId(joinId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedJoinId(null);
    setIsDetailModalOpen(false);
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

  if (!parsedCourtId || isNaN(parsedCourtId)) {
    return <div className="text-center p-10 text-red-500">Invalid court ID.</div>;
  }

  if (isLoading) return <div className="text-center p-10">Loading data...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Error loading data</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Playmate Joins for Court {parsedCourtId}</h2>
            <p className="text-gray-500 text-sm">View playmate joins for this court</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            {rows.map((p, i) => (
              <tr
                key={p.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{p.userName}</td>
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
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No playmate joins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default PlaymateJoinsByCourt;