// src/pages/OwnerPackage/SuccessPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOwnerPackagePaymentStatusQuery } from "@redux/api/package/packageApi"; 
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";

const SuccessPage: React.FC = () => {
  const { ownerPackageId } = useParams<{ ownerPackageId: string }>();
  const navigate = useNavigate();
const { data, isLoading, isError } = useGetOwnerPackagePaymentStatusQuery({
  id: Number(ownerPackageId),
  status: "PAID",
});

  useEffect(() => {
    if (data) {
      if (data.status === "Paid") {
        toast.success("Thanh toán thành công!");
      } else {
        toast.error("Thanh toán chưa hoàn tất.");
      }
      navigate("/layoutOwner/my-subscriptions");
    } 
  }, [data, navigate]);

  if (isLoading) return <div className="text-center py-14"><LoadingSpinner /> Đang kiểm tra...</div>;
  if (isError) return <div className="text-center py-14 text-red-500">Lỗi khi kiểm tra trạng thái</div>;

  return <div className="text-center py-14">Thanh toán thành công! Đang chuyển hướng...</div>;
};

export default SuccessPage;