"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken, selectUser } from "@redux/features/auth/authSlice"
import {
  useGetAllWithdrawalRequestsQuery,
  useProcessWithdrawalRequestMutation,
} from "@redux/api/walletTransaction/walletTransactionApi"
import type { WalletTransaction, WalletTransactionFilterParams } from "@redux/api/walletTransaction/type"
import { toast } from "react-toastify"
import Pagination from "@components/Pagination"
import WalletTransactionCard from "@components/WalletTransactionCard"
import LoadingSpinner from "@/components/Loading_Spinner"
import { Filter, CheckCircle, XCircle, Clock } from "lucide-react"

const TRANSACTIONS_PER_PAGE = 10

const WalletWithdrawalRequests: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector(selectToken)
  const user = useSelector(selectUser)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [userIdFilter, setUserIdFilter] = useState<number | undefined>()
  const [search, setSearch] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState("Createdat")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [processTransactionId, setProcessTransactionId] = useState<number | null>(null)
  const [processStatus, setProcessStatus] = useState<string>("Pending")
  const [adminNote, setAdminNote] = useState<string>("")

  const params: WalletTransactionFilterParams = {
    userId: userIdFilter,
    status: statusFilter,
    search,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: TRANSACTIONS_PER_PAGE,
  }

  const { data, isLoading, isError } = useGetAllWithdrawalRequestsQuery(params)
  const [processWithdrawal, { isLoading: isProcessing }] = useProcessWithdrawalRequestMutation()

  if (!token || user?.role != "Admin") {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    navigate(`/auth?view=login&redirect=${redirectUrl}`)
    toast.info("Vui lòng đăng nhập với quyền admin để xem yêu cầu rút tiền.")
    return null
  }

  const transactions: WalletTransaction[] = data?.data || []
  const totalPages = data?.pagination?.totalPages || 1

  const handleProcessWithdrawal = async (transactionId: number) => {
    try {
      await processWithdrawal({ transactionId, status: processStatus, adminNote }).unwrap()
      toast.success(
        `Yêu cầu rút tiền #${transactionId} đã được ${processStatus === "Accepted" ? "chấp nhận" : "từ chối"} thành công.`,
      )
      setProcessTransactionId(null)
      setAdminNote("")
    } catch (error) {
      toast.error("Lỗi khi xử lý yêu cầu rút tiền.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="8" color="blue-600" />
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    )
  }

  if (isError) {
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
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1e9ea1] to-emerald-500">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#1e9ea1] uppercase tracking-wide">Admin</span>
          </div>
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3 text-balance">Quản Lý Yêu Cầu Rút Tiền</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Xem và xử lý các yêu cầu rút tiền từ người dùng. Phê duyệt hoặc từ chối các yêu cầu đang chờ.
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
              <label className="text-sm font-semibold text-gray-700 block mb-2">Trạng thái</label>
              <select
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || undefined)}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              >
                <option value="">Tất cả</option>
                <option value="Pending">Đang chờ</option>
                <option value="Accepted">Đã chấp nhận</option>
                <option value="Rejected">Đã từ chối</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">ID người dùng</label>
              <input
                type="number"
                value={userIdFilter || ""}
                onChange={(e) => setUserIdFilter(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Nhập ID"
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value || undefined)}
                placeholder="Ngân hàng, ghi chú..."
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
                <option value="Amount|asc">Số tiền ↑</option>
                <option value="Amount|desc">Số tiền ↓</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl">
        {transactions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="relative">
                  <WalletTransactionCard transaction={transaction} />
                  {transaction.status === "Pending" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setProcessTransactionId(transaction.id)
                          setProcessStatus("Accepted")
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => {
                          setProcessTransactionId(transaction.id)
                          setProcessStatus("Rejected")
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {processTransactionId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#1e9ea1] to-emerald-500"></div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Xử lý yêu cầu rút tiền #{processTransactionId}
                    </h3>

                    <div className="mb-4">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Trạng thái</label>
                      <select
                        value={processStatus}
                        onChange={(e) => setProcessStatus(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
                      >
                        <option value="Accepted">Chấp nhận</option>
                        <option value="Rejected">Từ chối</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Ghi chú admin</label>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Nhập ghi chú (tùy chọn)"
                        className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all resize-none"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setProcessTransactionId(null)}
                        className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleProcessWithdrawal(processTransactionId)}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#1e9ea1] to-emerald-500 hover:from-[#1a7f88] hover:to-emerald-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? "Đang xử lý..." : "Xác nhận"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy yêu cầu rút tiền</h3>
            <p className="text-gray-600">Hiện tại không có yêu cầu rút tiền nào cần xử lý.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default WalletWithdrawalRequests
