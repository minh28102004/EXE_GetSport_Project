"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "@redux/features/auth/authSlice"
import { useGetTotalNotificationsQuery, useGetUserNotificationsQuery } from "@redux/api/notification/notificationApi"
import type { Notification, NotificationFilterParams } from "@redux/api/notification/type"
import { toast } from "react-toastify"
import LoadingSpinner from "@components/Loading_Spinner"
import Pagination from "@components/Pagination"
import NotificationCard from "@components/NotificationCard"
import { Bell, Filter } from "lucide-react"

const NOTIFICATIONS_PER_PAGE = 10

const Notifications: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector(selectToken)
  const [currentPage, setCurrentPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>()
  const [search, setSearch] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState("Createdat")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filterParams: NotificationFilterParams = {
    type: typeFilter,
    isRead: isReadFilter,
    search,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: NOTIFICATIONS_PER_PAGE,
  }

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
  } = useGetUserNotificationsQuery(filterParams)
  const { data: totalData } = useGetTotalNotificationsQuery(filterParams)

  const notifications: Notification[] = notificationsData?.data || []
  const totalNotifications = totalData?.data || 0
  const totalPages = notificationsData?.pagination?.totalPages || Math.ceil(totalNotifications / NOTIFICATIONS_PER_PAGE)

  if (!token) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    navigate(`/auth?view=login&redirect=${redirectUrl}`)
    toast.info("Vui lòng đăng nhập để xem thông báo.")
    return null
  }

  const notificationTypes = [
    { value: "System", label: "Hệ thống" },
    { value: "Withdrawal", label: "Rút tiền" },
    { value: "OwnerPackageCreated", label: "Tạo gói chủ sân" },
    { value: "OwnerPackageActive", label: "Kích hoạt gói chủ sân" },
    { value: "OwnerPackageCancelled", label: "Hủy gói chủ sân" },
    { value: "OwnerPackageDeleted", label: "Xóa gói chủ sân" },
    { value: "PlaymateJoinCreated", label: "Tham gia playmate" },
    { value: "PlaymateJoinDeleted", label: "Rời playmate" },
    { value: "PlaymatePostClosed", label: "Đóng bài đăng playmate" },
    { value: "PlaymatePostReopened", label: "Mở lại bài đăng playmate" },
  ]

  if (isNotificationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="8" color="blue-600" />
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    )
  }

  if (isNotificationsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500 text-lg font-semibold">Lỗi khi tải dữ liệu</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 md:px-8">
      <section className="relative py-12 mb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1e9ea1] to-purple-500">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#1e9ea1] uppercase tracking-wide">Thông báo</span>
          </div>
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3 text-balance">Thông Báo Của Bạn</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Xem và quản lý các thông báo liên quan đến tài khoản của bạn. Tất cả hoạt động được ghi lại chi tiết.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-[#1e9ea1]" />
            <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Loại</label>
              <select
                value={typeFilter || ""}
                onChange={(e) => setTypeFilter(e.target.value || undefined)}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              >
                <option value="">Tất cả</option>
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Trạng thái</label>
              <select
                value={isReadFilter === undefined ? "" : isReadFilter ? "true" : "false"}
                onChange={(e) => {
                  const value = e.target.value
                  setIsReadFilter(value === "" ? undefined : value === "true")
                }}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              >
                <option value="">Tất cả</option>
                <option value="false">Chưa đọc</option>
                <option value="true">Đã đọc</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value || undefined)}
                placeholder="Tìm theo nội dung"
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Sắp xếp</label>
              <select
                value={`${sortBy}|${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("|")
                  setSortBy(by)
                  setSortOrder(order as "asc" | "desc")
                }}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              >
                <option value="Createdat|desc">Mới nhất</option>
                <option value="Createdat|asc">Cũ nhất</option>
                <option value="Isread|asc">Chưa đọc trước</option>
                <option value="Isread|desc">Đã đọc trước</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl">
        {notifications.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thông báo</h3>
            <p className="text-gray-600">Bạn chưa có thông báo nào. Tất cả hoạt động sẽ được hiển thị ở đây.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Notifications
