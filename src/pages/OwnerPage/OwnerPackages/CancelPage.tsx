import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetOwnerPackagePaymentStatusQuery } from "@redux/api/package/packageApi"; 
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";

const CancelPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy ownerPackageId từ query string
  const searchParams = new URLSearchParams(location.search);
  const ownerPackageId = searchParams.get("ownerPackageId");

const { data, isLoading, isError } = useGetOwnerPackagePaymentStatusQuery({
  id: Number(ownerPackageId),
  status: "CANCELLED",
});


  useEffect(() => {
    if (data) {
      toast.error("Thanh toán bị hủy.");
      navigate("/layoutOwner/ownerpackages");
    }
  }, [data, navigate]);

  if (isLoading)
    return (
      <div className="text-center py-14">
        <LoadingSpinner /> Đang kiểm tra...
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-14 text-red-500">
        Lỗi khi kiểm tra trạng thái
      </div>
    );

  return (
    <div className="text-center py-14">
      Thanh toán bị hủy! Đang chuyển hướng...
    </div>
  );
};

export default CancelPage;
