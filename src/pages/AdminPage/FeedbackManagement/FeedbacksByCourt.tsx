"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
} from "react-icons/fa"
import Tooltip from "@mui/material/Tooltip"
import { toast } from "react-toastify"
import {
  useGetFeedbacksByCourtQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} from "@redux/api/feedback/feedbackApi"
import type { Feedback } from "@redux/api/feedback/type"
import { mapUiToCreateDto, mapUiToUpdateDto } from "@redux/api/feedback/map"
import { FeedbackFormModal } from "./FeedbackForm"
import { FeedbackDetailModal } from "./FeedbackDetail"

const FeedbacksByCourt: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>()
  const parsedCourtId = courtId ? Number.parseInt(courtId, 10) : 0

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null)
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null)

  const [createFeedback, { isLoading: creating }] = useCreateFeedbackMutation()
  const [updateFeedback, { isLoading: updating }] = useUpdateFeedbackMutation()
  const [deleteFeedback, { isLoading: deleting }] = useDeleteFeedbackMutation()
  const busy = creating || updating || deleting

  const { data, isLoading, isError } = useGetFeedbacksByCourtQuery({ courtId: parsedCourtId })

  const rows: Feedback[] = Array.isArray(data?.data)
    ? (data?.data as Feedback[])
    : (data?.data as Paged<Feedback> | undefined)?.items ?? [];

  const openModal = (feedback: Feedback | null = null) => {
    setCurrentFeedback(feedback)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setCurrentFeedback(null)
    setIsModalOpen(false)
  }

  const openDetailModal = (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setSelectedFeedbackId(null)
    setIsDetailModalOpen(false)
  }

  const handleFeedbackSaved = async (feedbackData: Partial<Feedback>) => {
    try {
      if (feedbackData.id) {
        await updateFeedback({
          id: feedbackData.id,
          body: mapUiToUpdateDto(feedbackData),
        }).unwrap()
        toast.success("Updated feedback successfully!")
      } else {
        await createFeedback(
          mapUiToCreateDto(feedbackData),
        ).unwrap()
        toast.success("Created feedback successfully!")
      }
      closeModal()
    } catch (e) {
      console.error(e)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Are you sure you want to delete feedback ${id}?`)
    if (!ok) return
    try {
      await deleteFeedback(id).unwrap()
      toast.success(`Deleted feedback ${id}!`)
    } catch (e) {
      console.error(e)
      toast.error("Deletion failed, please try again!")
    }
  }

  if (!parsedCourtId || isNaN(parsedCourtId)) {
    return <div className="text-center p-10 text-red-500">Invalid court ID.</div>
  }

  if (isLoading) return <div className="text-center p-10">Loading data...</div>
  if (isError) return <div className="text-center p-10 text-red-500">Error loading data</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Feedback for Court {parsedCourtId}</h2>
            <p className="text-gray-500 text-sm">View and manage feedback for this court</p>
          </div>

          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy}
          >
            <FaPlus />
            Create Feedback
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-sky-50 border-b border-teal-100 text-gray-700">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Booking Date</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f, i) => (
              <tr
                key={f.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{f.userName}</td>
                <td className="p-3">{new Date(f.bookingDate).toLocaleString()}</td>
                <td className="p-3">{f.rating}</td>
                <td className="p-3">{f.comment}</td>
                <td className="p-3">{new Date(f.createdAt).toLocaleString()}</td>
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
                  <Tooltip title="Edit" arrow>
                    <button
                      onClick={() => openModal(f)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      disabled={busy}
                    >
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </Tooltip>
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
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  No feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FeedbackFormModal
        open={isModalOpen}
        onSave={handleFeedbackSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />

      {selectedFeedbackId && (
        <FeedbackDetailModal
          open={isDetailModalOpen}
          feedbackId={selectedFeedbackId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  )
}

export default FeedbacksByCourt