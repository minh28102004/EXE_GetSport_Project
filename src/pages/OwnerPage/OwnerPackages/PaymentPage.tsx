import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "@redux/features/auth/authSlice";
import { useCreateOwnerPackageBookingMutation } from "@redux/api/ownerPackage/ownerPackageApi";
import { useGetPackageQuery, } from "@redux/api/package/packageApi";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const { data: packageData, isLoading, isError } = useGetPackageQuery(Number(id));
  const [createOwnerPackageBooking, { isLoading: isCreating }] = useCreateOwnerPackageBookingMutation();

  const pkg = packageData?.data;

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

    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + pkg.durationDays);

      const ownerPackageData = {
        ownerId: user.id,
        packagename: pkg.name,
        duration: pkg.durationDays,
        startdate: today.toISOString().split('T')[0],
        enddate: endDate.toISOString().split('T')[0],
        price: pkg.price,
        priority: 1,
      };

      const response = await createOwnerPackageBooking(ownerPackageData).unwrap();
      if(response?.data?.isFreeTrial == true) {
            toast.info("Gói FREE_TRIAL đã được kích hoạt thành công! Bạn có thể tạo sân ngay.");
            navigate("/layoutOwner/my-subscriptions");
      }
      else
      if (response.data && response.paymentLink) {
        toast.info("Chuyển đến cổng thanh toán...");
        window.location.href = response.paymentLink; 
      } else {
        toast.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-8">
      <div className="mx-auto max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Xác Nhận Thanh Toán</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800">{pkg.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{pkg.description || "Không có mô tả."}</p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Giá:</span>
            <span className="text-teal-600 font-semibold">{pkg.price.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Thời gian:</span>
            <span className="text-gray-600">{pkg.durationDays} ngày</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Trạng thái:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {pkg.isActive ? "Hoạt động" : "Không khả dụng"}
            </span>
          </div>
        </div>
        <button
          onClick={handlePay}
          disabled={isCreating || !pkg.isActive}
          className="mt-6 w-full bg-teal-600 py-2.5 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isCreating ? <LoadingSpinner inline color="white" size="4" /> : "Thanh Toán"}
        </button>
        <button
          onClick={() => navigate("/layoutOwner/ownerpackages")}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Quay Lại
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;