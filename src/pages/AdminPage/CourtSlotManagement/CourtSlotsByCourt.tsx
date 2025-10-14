"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
} from "react-icons/fa"
import Tooltip from "@mui/material/Tooltip"
import { toast } from "react-toastify"
import {
  useGetSlotsByCourtAndDateQuery,
  useCreateCourtSlotMutation,
  useUpdateCourtSlotMutation,
  useDeleteCourtSlotMutation,
  useUpdateCourtSlotAvailabilityMutation,
} from "@redux/api/courtSlot/courtSlotApi"
import type { CourtSlot } from "@redux/api/courtSlot/type"
import { mapUiToCreateDto, mapUiToUpdateDto } from "@redux/api/courtSlot/map"
import { CourtSlotFormModal } from "./CourtSlotForm"
import { CourtSlotDetailModal } from "./CourtSlotDetail"

const CourtSlotsByCourt: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>()
  const parsedCourtId = courtId ? Number.parseInt(courtId, 10) : 0

  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
    return new Date(today.setDate(diff))
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentSlot, setCurrentSlot] = useState<CourtSlot | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)

  const [createCourtSlot, { isLoading: creating }] = useCreateCourtSlotMutation()
  const [updateCourtSlot, { isLoading: updating }] = useUpdateCourtSlotMutation()
  const [deleteCourtSlot, { isLoading: deleting }] = useDeleteCourtSlotMutation()
  const [updateAvailability, { isLoading: availabilityUpdating }] = useUpdateCourtSlotAvailabilityMutation()
  const busy = creating || updating || deleting || availabilityUpdating

  const dateRange = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStartDate)
    date.setDate(weekStartDate.getDate() + i)
    return date.toISOString().split("T")[0]
  })

  const day0Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[0] })
  const day1Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[1] })
  const day2Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[2] })
  const day3Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[3] })
  const day4Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[4] })
  const day5Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[5] })
  const day6Query = useGetSlotsByCourtAndDateQuery({ courtId: parsedCourtId, date: dateRange[6] })

  const allQueries = [day0Query, day1Query, day2Query, day3Query, day4Query, day5Query, day6Query]

  const rows: CourtSlot[] = allQueries
    .flatMap((query) => (Array.isArray(query.data?.data) ? query.data.data : []))
    .filter((slot): slot is CourtSlot => slot !== undefined)

  const isLoading = allQueries.some((query) => query.isLoading)
  const isError = allQueries.some((query) => query.isError)

  const goToPreviousWeek = () => {
    setWeekStartDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    setWeekStartDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    setWeekStartDate(new Date(today.setDate(diff)))
  }

  const openModal = (slot: CourtSlot | null = null) => {
    setCurrentSlot(slot)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setCurrentSlot(null)
    setIsModalOpen(false)
  }

  const openDetailModal = (slotId: number) => {
    setSelectedSlotId(slotId)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setSelectedSlotId(null)
    setIsDetailModalOpen(false)
  }

  const handleCourtSlotSaved = async (slotData: Partial<CourtSlot>) => {
    try {
      if (slotData.id) {
        await updateCourtSlot({
          id: slotData.id,
          body: mapUiToUpdateDto(slotData),
        }).unwrap()
        toast.success("Cập nhật slot thành công!")
      } else {
        await createCourtSlot(
          mapUiToCreateDto({
            ...slotData,
            courtId: parsedCourtId,
          }),
        ).unwrap()
        toast.success("Tạo slot mới thành công!")
      }
      closeModal()
    } catch (e) {
      console.error(e)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Bạn có chắc muốn xoá slot ${id}?`)
    if (!ok) return
    try {
      await deleteCourtSlot(id).unwrap()
      toast.success(`Đã xoá slot ${id}!`)
    } catch (e) {
      console.error(e)
      toast.error("Xoá thất bại, vui lòng thử lại!")
    }
  }

  const handleToggleAvailable = async (s: CourtSlot) => {
    try {
      await updateAvailability({
        id: s.id,
        isAvailable: !s.isAvailable,
      }).unwrap()
      toast.info(`Slot "${s.id}" đã được ${s.isAvailable ? "khóa" : "mở khóa"}.`)
    } catch (e) {
      console.error(e)
      toast.error("Không thể đổi trạng thái slot.")
    }
  }

  if (!parsedCourtId || isNaN(parsedCourtId)) {
    return <div className="text-center p-10 text-red-500">Invalid court ID.</div>
  }

  if (isLoading) return <div className="text-center p-10">Đang tải dữ liệu...</div>
  if (isError) return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu</div>

  const hours = Array.from({ length: 18 }, (_, i) => (i + 6).toString().padStart(2, "0") + ":00")

  const slotBlocks = rows.map((s) => {
    const start = new Date(s.startTime)
    const end = new Date(s.endTime)
    const startHour = start.getHours()
    const endHour = end.getHours()
    const durationHours = endHour - startHour || 1
    const date = start.toISOString().split("T")[0]
    const dayIndex = dateRange.indexOf(date)
    return {
      id: s.id,
      startHour,
      durationHours,
      isAvailable: s.isAvailable,
      slotNumber: s.slotNumber,
      startTime: s.startTime,
      endTime: s.endTime,
      dayIndex,
      date,
      fullSlot: s,
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Quản lý Slot Sân {parsedCourtId}</h2>
            <p className="text-gray-500 text-sm">Xem và quản lý lịch đặt sân theo tuần</p>
          </div>

          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy}
          >
            <FaPlus />
            Tạo slot mới
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm"
              disabled={busy}
            >
              <FaChevronLeft />
              Tuần trước
            </button>

            <button
              onClick={goToToday}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition font-medium text-sm"
              disabled={busy}
            >
              <FaCalendarDay />
              Hôm nay
            </button>

            <button
              onClick={goToNextWeek}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm"
              disabled={busy}
            >
              Tuần sau
              <FaChevronRight />
            </button>
          </div>

          <div className="text-sm font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
            {new Date(dateRange[0]).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}
            {" - "}
            {new Date(dateRange[6]).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Giờ</div>
              {dateRange.map((date, index) => {
                const dateObj = new Date(date)
                const isToday = date === new Date().toISOString().split("T")[0]
                return (
                  <div key={date} className={`p-3 text-center border-l border-gray-200 ${isToday ? "bg-blue-50" : ""}`}>
                    <div
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isToday ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {dateObj.toLocaleDateString("vi-VN", { weekday: "short" })}
                    </div>
                    <div className={`text-sm font-bold mt-1 ${isToday ? "text-blue-700" : "text-gray-800"}`}>
                      {dateObj.getDate()}/{dateObj.getMonth() + 1}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="relative">
              {hours.map((hour, hourIndex) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50 transition">
                  <div className="p-3 text-sm font-medium text-gray-600 bg-gray-50 border-r border-gray-200">
                    {hour}
                  </div>
                  {dateRange.map((date, dayIndex) => {
                    const hourNum = Number.parseInt(hour.split(":")[0])
                    const slotsInCell = slotBlocks.filter(
                      (block) => block.dayIndex === dayIndex && block.startHour === hourNum,
                    )

                    return (
                      <div key={`${date}-${hour}`} className="p-1 border-l border-gray-100 min-h-[60px] relative">
                        {slotsInCell.map((block) => (
                          <div
                            key={block.id}
                            className={`rounded-lg p-2 mb-1 shadow-sm transition-all hover:shadow-md cursor-pointer group ${
                              block.isAvailable
                                ? "bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600"
                                : "bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
                            }`}
                            style={{
                              minHeight: `${block.durationHours * 60 - 4}px`,
                            }}
                          >
                            <div onClick={() => openDetailModal(block.id)} className="text-white">
                              <div className="text-xs font-bold mb-1">Slot {block.slotNumber}</div>
                              <div className="text-[10px] opacity-90">
                                {new Date(block.startTime).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {" - "}
                                {new Date(block.endTime).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-[10px] font-semibold mt-1">
                                {block.isAvailable ? "✓ Có sẵn" : "✗ Đã đặt"}
                              </div>
                            </div>

                            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Tooltip title="Xem chi tiết" arrow>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openDetailModal(block.id)
                                  }}
                                  className="flex-1 p-1 rounded bg-white/20 hover:bg-white/30 text-xs backdrop-blur-sm"
                                  disabled={busy}
                                >
                                  <FaEye className="mx-auto" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Sửa" arrow>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openModal(block.fullSlot)
                                  }}
                                  className="flex-1 p-1 rounded bg-white/20 hover:bg-white/30 text-green text-xs backdrop-blur-sm"
                                  disabled={busy}
                                >
                                  <FaEdit className="mx-auto" />
                                </button>
                              </Tooltip>
                              <Tooltip title={block.isAvailable ? "Khóa" : "Mở"} arrow>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleAvailable(block.fullSlot)
                                  }}
                                  className="flex-1 p-1 rounded bg-white/20 hover:bg-white/30 text-blue text-xs backdrop-blur-sm"
                                  disabled={busy}
                                >
                                  {block.isAvailable ? (
                                    <FaLock className="mx-auto" />
                                  ) : (
                                    <FaUnlock className="mx-auto" />
                                  )}
                                </button>
                              </Tooltip>
                              <Tooltip title="Xoá" arrow>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(block.id)
                                  }}
                                  className="flex-1 p-1 rounded bg-white/20 hover:bg-white/30 text-xs backdrop-blur-sm"
                                  disabled={busy}
                                >
                                  <FaTrash className="mx-auto" />
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-400 to-emerald-500"></div>
              <span className="text-gray-700">Slot có sẵn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-red-400 to-red-500"></div>
              <span className="text-gray-700">Slot đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500"></div>
              <span className="text-gray-700">Hôm nay</span>
            </div>
          </div>
        </div>
      </div>

      <CourtSlotFormModal
        open={isModalOpen}
        slot={currentSlot}
        onSave={handleCourtSlotSaved}
        onClose={busy ? () => {} : closeModal}
        loading={busy}
      />

      {selectedSlotId && (
        <CourtSlotDetailModal
          open={isDetailModalOpen}
          slotId={selectedSlotId}
          onClose={busy ? () => {} : closeDetailModal}
        />
      )}
    </div>
  )
}

export default CourtSlotsByCourt
