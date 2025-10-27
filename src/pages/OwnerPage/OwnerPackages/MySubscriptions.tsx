import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "@redux/features/auth/authSlice";
import { useGetMyOwnerPackagesQuery } from "@redux/api/ownerPackage/ownerPackageApi";
import type { OwnerPackage, OwnerPackageFilterParams } from "@redux/api/ownerPackage/type";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import Pagination from "@components/Pagination";

const SUBSCRIPTIONS_PER_PAGE = 10;

/* ====== Subscription Card ====== */
const SubscriptionCard = ({ subscription }: { subscription: OwnerPackage }) => {
    console.log(subscription)
  const formatDate = (date: Date) => {
    return date?.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <article className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{subscription.packageName}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Giá:</span>
            <span className="text-teal-600 font-semibold">{subscription.price.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Thời gian:</span>
            <span className="text-gray-600">{subscription.duration} ngày</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Bắt đầu:</span>
            <span className="text-gray-600">{subscription.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Kết thúc:</span>
            <span className="text-gray-600">{subscription.endDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Trạng thái:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                subscription.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : subscription.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : subscription.status === "Expired"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {subscription.status === "Active"
                ? "Hoạt động"
                : subscription.status === "Pending"
                ? "Đang chờ"
                : subscription.status === "Expired"
                ? "Hết hạn"
                : "Đã hủy"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Ưu tiên:</span>
            <span className="text-gray-600">{subscription.priority}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ====== My Subscriptions Page ====== */
const MySubscriptions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState("createat");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  if (!token) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    navigate(`/auth?view=login&redirect=${redirectUrl}`);
    toast.info("Vui lòng đăng nhập để xem danh sách đăng ký.");
    return null;
  }

  const params: OwnerPackageFilterParams = {
    status: statusFilter,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: SUBSCRIPTIONS_PER_PAGE,
  };

  const { data, isLoading, isError } = useGetMyOwnerPackagesQuery();

  const subscriptions = data?.data && "items" in data.data ? data.data.items : (data?.data as OwnerPackage[]) || [];
  const totalPages = data?.data && "totalPages" in data.data ? data.data.totalPages : Math.ceil((data?.data as OwnerPackage[] || []).length / SUBSCRIPTIONS_PER_PAGE) || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="8" color="teal-600" />
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500 text-lg font-semibold">Lỗi khi tải dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-8">
      {/* Title Section */}
      <section className="relative py-8 bg-white border-b border-gray-200">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-3">Danh Sách Đăng Ký Của Bạn</h2>
          <p className="text-lg text-gray-600 max-w-3xl">Xem và quản lý các gói dịch vụ owner mà bạn đã đăng ký.</p>
        </div>
      </section>

      {/* Filters and Actions */}
      <section className="px-6 md:px-8 py-6 bg-gray-50">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Lọc theo trạng thái</label>
              <select
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || undefined)}
                className="w-full sm:w-48 py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 text-sm"
              >
                <option value="">Tất cả</option>
                <option value="Pending">Đang chờ</option>
                <option value="Active">Hoạt động</option>
                <option value="Expired">Hết hạn</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Sắp xếp</label>
              <select
                value={`${sortBy}|${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("|");
                  setSortBy(by);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="w-full sm:w-48 py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 text-sm"
              >
                <option value="createat|desc">Mới nhất</option>
                <option value="createat|asc">Cũ nhất</option>
                <option value="price|asc">Giá tăng dần</option>
                <option value="price|desc">Giá giảm dần</option>
                <option value="duration|asc">Thời gian tăng dần</option>
                <option value="duration|desc">Thời gian giảm dần</option>
              </select>
            </div>
            <button
              onClick={() => navigate("/layoutOwner/ownerpackages")}
              className="w-full sm:w-auto bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Xem Gói Dịch Vụ
            </button>
          </div>
        </div>
      </section>

      {/* Subscriptions Grid */}
      <section className="px-6 md:px-8 pb-10 bg-gray-50">
        <div className="mx-auto w-full max-w-7xl">
          {subscriptions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-14">
              <h3 className="text-xl font-bold text-gray-600 mb-1.5">Không tìm thấy đăng ký</h3>
              <p className="text-gray-500 text-sm">Bạn chưa đăng ký gói dịch vụ nào. Hãy xem các gói dịch vụ để bắt đầu!</p>
              <button
                onClick={() => navigate("/layoutOwner/ownerpackages")}
                className="mt-4 bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Xem Gói Dịch Vụ
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MySubscriptions;