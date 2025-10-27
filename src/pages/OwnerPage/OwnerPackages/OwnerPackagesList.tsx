// src/pages/OwnerPackage/OwnerPackagesList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPackagesQuery } from "@redux/api/package/packageApi";
import type { Package, PackageFilterParams } from "@redux/api/package/type";
import LoadingSpinner from "@components/Loading_Spinner";
import Pagination from "@components/Pagination";

const POSTS_PER_PAGE = 9;

/* ====== Package Card ====== */
const PackageCard = ({ pkg }: { pkg: Package }) => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate(`/layoutOwner/ownerpackage/payment/${pkg.id}`);
  };

  return (
    <article
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Header */}
      <div className="p-5 bg-teal-50">
        <h3 className="font-bold text-gray-900 mb-2 text-lg">{pkg.name}</h3>
        <p className="text-gray-600 text-sm">{pkg.description}</p>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-teal-600 font-semibold">{pkg.price.toLocaleString()} VND</span>
          <span className="text-gray-500 text-sm">/ {pkg.durationDays} days</span>
        </div>
        <button
          onClick={handleSubscribe}
          className="w-full bg-teal-600 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          disabled={!pkg.isActive}
        >
          {pkg.isActive ? "Đăng ký" : "Không khả dụng"}
        </button>
      </div>
    </article>
  );
};

/* ====== Owner Packages List Page ====== */
const OwnerPackagesList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minDuration, setMinDuration] = useState<number | undefined>();
  const [maxDuration, setMaxDuration] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const params: PackageFilterParams = {
    search: search || undefined,
    minPrice,
    maxPrice,
    minDurationDays: minDuration,
    maxDurationDays: maxDuration,
    isActive: true, // Only active packages
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: POSTS_PER_PAGE,
  };

  const { data, isLoading, isError } = useGetPackagesQuery(params);

  const packages = data?.data && 'items' in data.data ? data.data.items : (data?.data as Package[]) || [];
  const totalPages = data?.data && 'totalPages' in data.data ? data.data.totalPages : Math.ceil((data?.data as Package[] || []).length / POSTS_PER_PAGE) || 1;

  if (isLoading) return <div className="text-center py-14"><LoadingSpinner /> Đang tải...</div>;
  if (isError) return <div className="text-center py-14 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Title Section */}
      <section className="relative py-8 text-center">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">Gói Dịch Vụ</h2>
          <p className="text-lg text-gray-600 max-w-2xl">Chọn gói phù hợp để nâng cấp tài khoản owner của bạn.</p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="px-5 md:px-8 pb-5">
        <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên gói..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="number"
              placeholder="Giá từ"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            />
            <input
              type="number"
              placeholder="Giá đến"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="number"
              placeholder="Thời gian từ (ngày)"
              value={minDuration || ''}
              onChange={(e) => setMinDuration(e.target.value ? Number(e.target.value) : undefined)}
              className="pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            />
            <input
              type="number"
              placeholder="Thời gian đến (ngày)"
              value={maxDuration || ''}
              onChange={(e) => setMaxDuration(e.target.value ? Number(e.target.value) : undefined)}
              className="pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <select
            value={`${sortBy}|${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('|');
              setSortBy(by);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          >
            <option value="price|asc">Giá tăng dần</option>
            <option value="price|desc">Giá giảm dần</option>
            <option value="durationDays|asc">Thời gian tăng dần</option>
            <option value="durationDays|desc">Thời gian giảm dần</option>
          </select>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="px-5 md:px-8 pb-10">
        <div className="mx-auto w-full max-w-7xl">
          {packages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-14">
              <h3 className="text-xl font-bold text-gray-600 mb-1.5">Không tìm thấy gói</h3>
              <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OwnerPackagesList;