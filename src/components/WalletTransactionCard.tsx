import type React from "react"
import type { WalletTransaction } from "../redux/api/walletTransaction/type"
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react"

const WalletTransactionCard: React.FC<{ transaction: WalletTransaction }> = ({ transaction }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "Pending":
        return <Clock className="w-4 h-4" />
      case "Accepted":
        return <CheckCircle className="w-4 h-4" />
      case "Rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const isIncoming = transaction.direction === 1

  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#1e9ea1] to-emerald-500"></div>

      <div className="p-6">
        {/* Header with amount and direction */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isIncoming ? "bg-emerald-100" : "bg-[#1e9ea1]/10"}`}>
              {isIncoming ? (
                <TrendingUp className={`w-5 h-5 ${isIncoming ? "text-emerald-600" : "text-[#1e9ea1]"}`} />
              ) : (
                <TrendingDown className="w-5 h-5 text-[#1e9ea1]" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giao dịch #{transaction.id}</p>
              <p className="text-sm text-gray-600 mt-0.5">{transaction.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isIncoming ? "text-emerald-600" : "text-[#1e9ea1]"}`}>
              {isIncoming ? "+" : "-"}
              {transaction.amount.toLocaleString()} VND
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span>
              {transaction.status === "Pending"
                ? "Đang chờ"
                : transaction.status === "Accepted"
                  ? "Đã chấp nhận"
                  : "Đã từ chối"}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Người dùng</span>
            <span className="font-medium text-gray-900">{transaction.userName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Hướng</span>
            <span className="font-medium text-gray-900">{transaction.direction === 1 ? "Nạp" : "Rút"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ngày tạo</span>
            <span className="font-medium text-gray-900">{formatDate(transaction.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số dư ví</span>
            <span className="font-bold text-emerald-600">{transaction.walletBalance.toLocaleString()} VND</span>
          </div>

          {transaction.bankInfo && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-600">Ngân hàng</span>
              <span className="font-medium text-gray-900">{transaction.bankInfo}</span>
            </div>
          )}

          {transaction.comment && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-600 text-xs mb-1">Ghi chú</p>
              <p className="text-gray-700 text-sm">{transaction.comment}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default WalletTransactionCard
