"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "@redux/features/auth/authSlice"
import { useCreateWithdrawalRequestMutation } from "@redux/api/walletTransaction/walletTransactionApi"
import { toast } from "react-toastify"
import { ArrowRight, DollarSign, Building2, CreditCard, FileText } from "lucide-react"

const WalletWithdraw: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector(selectToken)
  const [amount, setAmount] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [note, setNote] = useState("")
  const [createWithdrawal, { isLoading }] = useCreateWithdrawalRequestMutation()

  if (!token) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    navigate(`/auth?view=login&redirect=${redirectUrl}`)
    toast.info("Vui lòng đăng nhập để tạo yêu cầu rút tiền.")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) < 1000) {
      toast.error("Số tiền phải lớn hơn hoặc bằng 1000.")
      return
    }
    if (!bankName || bankName.length > 100) {
      toast.error("Tên ngân hàng không hợp lệ.")
      return
    }
    if (!bankAccount || bankAccount.length > 50) {
      toast.error("Số tài khoản ngân hàng không hợp lệ.")
      return
    }
    if (note && note.length > 500) {
      toast.error("Ghi chú không được vượt quá 500 ký tự.")
      return
    }

    try {
      await createWithdrawal({
        amount: Number(amount),
        bankName,
        bankAccount,
        note: note || undefined,
      }).unwrap()
      toast.success("Yêu cầu rút tiền đã được tạo thành công.")
      navigate("/wallet/transactions")
    } catch (error) {
      toast.error("Lỗi khi tạo yêu cầu rút tiền.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 md:px-8">
      <section className="relative py-12 mb-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1e9ea1] to-emerald-500">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#1e9ea1] uppercase tracking-wide">Quản lý ví</span>
          </div>
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3 text-balance">Tạo Yêu Cầu Rút Tiền</h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Điền thông tin ngân hàng của bạn để rút tiền từ ví. Yêu cầu sẽ được xử lý trong 1-2 ngày làm việc.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form header */}
          <div className="h-1 bg-gradient-to-r from-[#1e9ea1] to-emerald-500"></div>

          <div className="p-8">
            {/* Amount field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 text-[#1e9ea1]" />
                Số tiền (VND)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền (tối thiểu 1000)"
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-base transition-all"
                required
                min="1000"
              />
              <p className="text-xs text-gray-500 mt-1.5">Tối thiểu: 1.000 VND</p>
            </div>

            {/* Bank name field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 text-[#1e9ea1]" />
                Tên ngân hàng
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: Vietcombank, Techcombank, ..."
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-base transition-all"
                required
                maxLength={100}
              />
            </div>

            {/* Bank account field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 text-[#1e9ea1]" />
                Số tài khoản ngân hàng
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Nhập số tài khoản"
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-base transition-all"
                required
                maxLength={50}
              />
            </div>

            {/* Note field */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-[#1e9ea1]" />
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú thêm (tối đa 500 ký tự)"
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e9ea1] focus:ring-2 focus:ring-[#1e9ea1]/20 text-base transition-all resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1.5">{note.length}/500 ký tự</p>
            </div>

            {/* Submit button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/wallet/transactions")}
                className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-[#1e9ea1] to-emerald-500 hover:from-[#1a7f88] hover:to-emerald-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default WalletWithdraw
