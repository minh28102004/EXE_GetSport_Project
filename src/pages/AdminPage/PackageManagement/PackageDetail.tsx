import React, { useEffect } from "react";
import { X, Tag, DollarSign, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetPackageQuery } from "@redux/api/package/packageApi";
import type { Package } from "@redux/api/package/type";
import LoadingSpinner from "@components/Loading_Spinner";

type Props = {
  packageId: number;
  onClose: () => void;
};

const baseField = "text-sm text-gray-600";
const labelCls = "text-xs font-semibold text-gray-500 mb-1 block";

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <div className="mb-3 flex items-center gap-2 text-slate-900">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 ring-1 ring-teal-100">
        {icon}
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const PackageDetail: React.FC<Props> = ({ packageId, onClose }) => {
  const { data: packageData, isLoading: packageLoading, isError: packageError } = useGetPackageQuery(packageId);

  const pkg: Package | undefined = packageData?.data;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (packageLoading) return <div className="p-6 text-center"><LoadingSpinner inline /> Đang tải...</div>;
  if (packageError || !pkg) return <div className="p-6 text-center text-red-500">Lỗi khi tải dữ liệu gói.</div>;

  return (
    <div className="relative w-full p-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Chi tiết gói: {pkg.name}</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 mt-4">
        <Section icon={<Tag className="w-4 h-4" />} title="Thông tin gói">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tên gói</label>
              <p className={baseField}>{pkg.name}</p>
            </div>
            <div>
              <label className={labelCls}>Mô tả</label>
              <p className={baseField}>{pkg.description ?? "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Giá (VND)</label>
              <p className={baseField}>{pkg.price.toLocaleString()}</p>
            </div>
            <div>
              <label className={labelCls}>Thời gian (ngày)</label>
              <p className={baseField}>{pkg.durationDays}</p>
            </div>
            <div>
              <label className={labelCls}>Trạng thái</label>
              <p className={baseField}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pkg.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {pkg.isActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </p>
            </div>
            <div>
              <label className={labelCls}>Ngày tạo</label>
              <p className={baseField}>
                {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : "--"}
              </p>
            </div>
            <div>
              <label className={labelCls}>Ngày cập nhật</label>
              <p className={baseField}>
                {pkg.updatedAt ? new Date(pkg.updatedAt).toLocaleDateString() : "--"}
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export const PackageDetailModal: React.FC<Props & { open: boolean }> = ({ open, packageId, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            key="panel"
            initial={{ y: -8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-[101] w-[90vw] max-w-3xl rounded-2xl bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex-1 min-h-0 max-h-[80vh] overflow-y-auto p-4">
              <PackageDetail packageId={packageId} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackageDetail;