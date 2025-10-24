import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "@redux/features/auth/authSlice";
import { useCreateOwnerPackageBookingMutation } from "@redux/api/ownerPackage/ownerPackageApi";
import { useGetPackageQuery } from "@redux/api/package/packageApi";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import { CreditCard, Wallet as WalletIcon } from "lucide-react";

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const { data: packageData, isLoading, isError } = useGetPackageQuery(Number(id));
  const [createOwnerPackageBooking, { isLoading: isCreating }] = useCreateOwnerPackageBookingMutation();

  const pkg = packageData?.data;

  // STATE CHO PHƯƠNG THỨC THANH TOÁN
  const [paymentMethod, setPaymentMethod] = React.useState<"PayOS" | "Wallet">("PayOS");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="8" color="teal-600" />
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500 text-lg font-semibold">Gói không tồn tại</div>
      </div>
    );
  }

  const handlePay = async () => {
    if (!token || !user) {
      const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?view=login&redirect=${redirectUrl}`);
      toast.info("Vui lòng đăng nhập để thực hiện thanh toán.");
      return;
    }

    if (!pkg.isActive) {
      toast.error("Gói hiện không khả dụng.");
      return;
    }

    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + pkg.durationDays);

      const ownerPackageData = {
        ownerId: user.id,
        packagename: pkg.name,
        duration: pkg.durationDays,
        startdate: today.toISOString().split("T")[0],
        enddate: endDate.toISOString().split("T")[0],
        price: pkg.price,
        priority: 1,
        paymentMethod, // GỬI PHƯƠNG THỨC THANH TOÁN
      };

      const response = await createOwnerPackageBooking(ownerPackageData).unwrap();

      // XỬ LÝ THEO PHƯƠNG THỨC
      if (response?.data?.isFreeTrial === true) {
        toast.success("Gói FREE_TRIAL đã được kích hoạt thành công!");
        navigate("/layoutOwner/my-subscriptions");
      } else if (paymentMethod === "Wallet") {
        // WALLET: THÀNH CÔNG NGAY
        toast.success("Mua gói thành công bằng ví!");
        setTimeout(() => navigate("/layoutOwner/my-subscriptions"), 1500);
      } else if (response?.paymentLink) {
        // PAYOS: CHUYỂN HƯỚNG
        toast.success("Chuyển đến cổng thanh toán PayOS...");
        window.location.href = response.paymentLink;
      } else {
        toast.error("Không thể xử lý thanh toán. Vui lòng thử lại.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-8">
      <div className="mx-auto max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Xác Nhận Thanh Toán
        </h2>

        {/* THÔNG TIN GÓI */}
        <div className="border-b border-gray-200 pb-5 mb-5">
          <h3 className="text-xl font-bold text-teal-600">{pkg.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{pkg.description || "Không có mô tả."}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Giá gói:</span>
            <span className="text-teal-600 font-bold text-lg">{pkg.price.toLocaleString()} ₫</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Thời hạn:</span>
            <span className="text-gray-600">{pkg.durationDays} ngày</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Trạng thái:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                pkg.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {pkg.isActive ? "Hoạt động" : "Không khả dụng"}
            </span>
          </div>
        </div>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Chọn phương thức thanh toán</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* PAYOS */}
            <button
              onClick={() => setPaymentMethod("PayOS")}
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "PayOS"
                  ? "border-teal-500 bg-teal-50 text-teal-700 shadow-md"
                  : "border-gray-300 hover:border-teal-400"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">PayOS</div>
                <div className="text-xs text-gray-500">Thẻ, ví điện tử</div>
              </div>
            </button>

            {/* WALLET */}
            <button
              onClick={() => setPaymentMethod("Wallet")}
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "Wallet"
                  ? "border-teal-500 bg-teal-50 text-teal-700 shadow-md"
                  : "border-gray-300 hover:border-teal-400"
              }`}
            >
              <WalletIcon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Ví của tôi</div>
                <div className="text-xs text-gray-500">Nhanh chóng</div>
              </div>
            </button>
          </div>
        </div>

        {/* NÚT THANH TOÁN */}
        <button
          onClick={handlePay}
          disabled={isCreating || !pkg.isActive}
          className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            isCreating || !pkg.isActive
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg"
          }`}
        >
          {isCreating ? (
            <LoadingSpinner inline color="white" size="5" />
          ) : (
            <>
              {paymentMethod === "PayOS" ? "Thanh Toán Qua PayOS" : "Mua Bằng Ví"}
              <span className="text-sm font-normal">({pkg.price.toLocaleString()} ₫)</span>
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/layoutOwner/ownerpackages")}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Quay Lại
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;