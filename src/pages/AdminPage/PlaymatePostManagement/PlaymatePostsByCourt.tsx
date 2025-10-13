import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  useGetPlaymatePostsByCourtQuery,
  useCreatePlaymatePostMutation,
  useUpdatePlaymatePostMutation,
  useDeletePlaymatePostMutation,
} from "@redux/api/playmatePost/playmatePostApi";
import type { PlaymatePost } from "@redux/api/playmatePost/type";
import { mapUiToCreateDto, mapUiToUpdateDto } from "@redux/api/playmatePost/map";
import { PlaymatePostFormModal } from "./PlaymatePostForm";
import { PlaymatePostDetailModal } from "./PlaymatePostDetail";

const PlaymatePostsByCourt: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const parsedCourtId = courtId ? Number.parseInt(courtId, 10) : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<PlaymatePost | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [createPost, { isLoading: creating }] = useCreatePlaymatePostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePlaymatePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePlaymatePostMutation();
  const busy = creating || updating || deleting;

  const { data, isLoading, isError } = useGetPlaymatePostsByCourtQuery({ courtId: parsedCourtId });

  const rows: PlaymatePost[] = Array.isArray(data?.data)
    ? (data?.data as PlaymatePost[])
    : (data?.data as Paged<PlaymatePost> | undefined)?.items ?? [];

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
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Playmate Posts for Court {parsedCourtId}</h2>
            <p className="text-gray-500 text-sm">View and manage playmate posts for this court</p>
          </div>

          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy}
          >
            <FaPlus />
            Create Playmate Post
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            {rows.map((p, i) => (
              <tr
                key={p.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{p.userName}</td>
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
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No playmate posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PlaymatePostFormModal
        open={isModalOpen}
        onSave={handlePostSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
        initialData={currentPost}
      />

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

export default PlaymatePostsByCourt;