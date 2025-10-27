"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken, selectUser } from "@redux/features/auth/authSlice"
import { useGetUserTransactionHistoryQuery } from "@redux/api/walletTransaction/walletTransactionApi"
import type { WalletTransaction, WalletTransactionFilterParams } from "@redux/api/walletTransaction/type"
import { toast } from "react-toastify"
import Pagination from "@components/Pagination"
import WalletTransactionCard from "@components/WalletTransactionCard"
import { Filter, Plus, History } from "lucide-react"

const TRANSACTIONS_PER_PAGE = 10

const WalletTransactions: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector(selectToken)
  const user = useSelector(selectUser)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [search, setSearch] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState("Createdat")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const params: WalletTransactionFilterParams = {
    userId: user?.role === "Admin" || user?.role === "Staff" ? undefined : user?.userId,
    type: typeFilter,
    status: statusFilter,
    search,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: TRANSACTIONS_PER_PAGE,
  }

  const { data, isLoading, isError } = useGetUserTransactionHistoryQuery(params)

  const transactions: WalletTransaction[] = data?.data || []
  const totalPages = data?.pagination?.totalPages || 1

  if (!token) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    navigate(`/auth?view=login&redirect=${redirectUrl}`)
    toast.info("Vui lòng đăng nhập để xem lịch sử giao dịch.")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 md:px-8">
      <section className="relative py-12 mb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1e9ea1] to-emerald-500">
              <History className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#1e9ea1] uppercase tracking-wide">Quản lý ví</span>
          </div>
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3 text-balance">Lịch Sử Giao Dịch</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Xem và quản lý lịch sử giao dịch ví của bạn. Tất cả giao dịch được ghi lại chi tiết.
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
              <label className="text-sm font-semibold text-gray-700 block mb-2">Loại</label>
              <select
                value={typeFilter || ""}
                onChange={(e) => setTypeFilter(e.target.value || undefined)}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-sm transition-all"
              >
                <option value="">Tất cả</option>
                <option value="Withdrawal">Rút tiền</option>
                <option value="Deposit">Nạp tiền</option>
                <option value="Refund">Hoàn tiền</option>
                <option value="WithdrawalReceive">Nhận rút tiền</option>
              </select>
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

            <div className="flex items-end">
              <button
                onClick={() => navigate("/wallet/withdraw")}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#1e9ea1] to-emerald-500 hover:from-[#1a7f88] hover:to-emerald-600 text-white font-semibold transition-all flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Rút tiền
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl">
        {transactions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {transactions.map((transaction) => (
                <WalletTransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy giao dịch</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có giao dịch nào. Hãy tạo yêu cầu rút tiền để bắt đầu!</p>
            <button
              onClick={() => navigate("/wallet/withdraw")}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-[#1e9ea1] to-emerald-500 hover:from-[#1a7f88] hover:to-emerald-600 text-white font-semibold transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Tạo yêu cầu rút tiền
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default WalletTransactions
