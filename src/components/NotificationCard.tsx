"use client"

import type React from "react"
import { useMarkNotificationReadMutation } from "@redux/api/notification/notificationApi"
import type { Notification } from "@redux/api/notification/type"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Bell, Package, Users, FileText, AlertCircle, CheckCircle2 } from "lucide-react"

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const [markNotificationRead] = useMarkNotificationReadMutation()
  const navigate = useNavigate()

  const typeDisplayNames: { [key: string]: string } = {
    OwnerPackageCreated: "Tạo gói chủ sân",
    OwnerPackageActive: "Kích hoạt gói chủ sân",
    OwnerPackageCancelled: "Hủy gói chủ sân",
    OwnerPackageDeleted: "Xóa gói chủ sân",
    PlaymateJoinCreated: "Tham gia playmate",
    PlaymateJoinDeleted: "Rời playmate",
    PlaymatePostClosed: "Đóng bài đăng playmate",
    PlaymatePostReopened: "Mở lại bài đăng playmate",
    System: "Hệ thống",
    Withdrawal: "Rút tiền",
  }

  const typeIcons: { [key: string]: React.ReactNode } = {
    OwnerPackageCreated: <Package className="w-5 h-5" />,
    OwnerPackageActive: <Package className="w-5 h-5" />,
    OwnerPackageCancelled: <Package className="w-5 h-5" />,
    OwnerPackageDeleted: <Package className="w-5 h-5" />,
    PlaymateJoinCreated: <Users className="w-5 h-5" />,
    PlaymateJoinDeleted: <Users className="w-5 h-5" />,
    PlaymatePostClosed: <FileText className="w-5 h-5" />,
    PlaymatePostReopened: <FileText className="w-5 h-5" />,
    System: <AlertCircle className="w-5 h-5" />,
    Withdrawal: <CheckCircle2 className="w-5 h-5" />,
  }

  const typeRoutes: { [key: string]: string } = {
    OwnerPackageCreated: "/layoutOwner/ownerpackage",
    OwnerPackageActive: "/layoutOwner/ownerpackage",
    OwnerPackageCancelled: "/layoutOwner/ownerpackage",
    OwnerPackageDeleted: "/layoutOwner/ownerpackage",
    PlaymateJoinCreated: "/playmate",
    PlaymateJoinDeleted: "/playmate",
    PlaymatePostClosed: "/playmate",
    PlaymatePostReopened: "/playmate",
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleMarkAsRead = async (isRead: boolean) => {
    try {
      await markNotificationRead({ notificationId: notification.id, dto: { isRead } }).unwrap()
      toast.success(`Thông báo đã được đánh dấu ${isRead ? "đã đọc" : "chưa đọc"}.`)
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái thông báo.")
    }
  }

  const handleNavigate = () => {
    const route = typeRoutes[notification.type]
    if (route) {
      navigate(route)
    }
  }

  return (
    <article
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border overflow-hidden ${
        notification.isRead ? "border-gray-200" : "border-[#1e9ea1]/30 bg-[#1e9ea1]/5"
      }`}
    >
      <div className="h-1 bg-gradient-to-r from-[#1e9ea1] to-purple-500"></div>

      <div className="p-6">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-[#1e9ea1]/10 text-[#1e9ea1] flex-shrink-0">
            {typeIcons[notification.type] || <Bell className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-base text-gray-900 cursor-pointer hover:text-[#1e9ea1] transition-colors truncate"
              onClick={handleNavigate}
            >
              {typeDisplayNames[notification.type] || notification.type}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              notification.isRead
                ? "bg-gray-50 text-gray-700 border-gray-200"
                : "bg-[#1e9ea1]/10 text-[#1e9ea1] border-[#1e9ea1]/30"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${notification.isRead ? "bg-gray-400" : "bg-[#1e9ea1]"}`}></div>
            {notification.isRead ? "Đã đọc" : "Chưa đọc"}
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex justify-between">
            <span>Ngày tạo</span>
            <span className="font-medium">{formatDate(notification.createdAt)}</span>
          </div>
          {notification.updatedAt && (
            <div className="flex justify-between">
              <span>Cập nhật</span>
              <span className="font-medium">{formatDate(notification.updatedAt)}</span>
            </div>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => handleMarkAsRead(!notification.isRead)}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-[#1e9ea1] to-[#1e9ea1] hover:from-[#1a7f88] hover:to-[#1a7f88] text-white text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          {notification.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
        </button>
      </div>
    </article>
  )
}

export default NotificationCard
