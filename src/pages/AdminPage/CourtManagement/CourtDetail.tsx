import React, { useEffect } from "react";
import { X, MapPin, Image, Star, List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetCourtQuery, useGetCourtFeedbacksQuery } from "@redux/api/court/courtApi";
import type { Court } from "@redux/api/court/type";
import LoadingSpinner from "@components/Loading_Spinner";

type Props = {
  courtId: number;
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

const CourtDetail: React.FC<Props> = ({ courtId, onClose }) => {
  const { data: courtData, isLoading: courtLoading, isError: courtError } = useGetCourtQuery(courtId);
  const { data: feedbacksData, isLoading: feedbacksLoading } = useGetCourtFeedbacksQuery(courtId);

  const court: Court | undefined = courtData?.data;
  const feedbacks = feedbacksData?.data ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (courtLoading) return <div className="p-6 text-center"><LoadingSpinner inline /> Đang tải...</div>;
  if (courtError || !court) return <div className="p-6 text-center text-red-500">Lỗi khi tải dữ liệu sân.</div>;

  return (
    <div className="relative w-full p-4">
      {/* Header + Close */}
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Chi tiết sân: {court.name ?? court.location}</h2>
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
        {/* Thông tin cơ bản */}
        <Section icon={<MapPin className="w-4 h-4" />} title="Thông tin cơ bản">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tên sân</label>
              <p className={baseField}>{court.name ?? "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Chủ sân</label>
              <p className={baseField}>{court.ownerName}</p>
            </div>
            <div>
              <label className={labelCls}>Vị trí</label>
              <p className={baseField}>{court.location ?? "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Tiện ích</label>
              <div className="flex flex-wrap gap-2">
                {court.utilities && court.utilities.length > 0 ? (
                  court.utilities.map((util, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700"
                    >
                      {util}
                    </span>
                  ))
                ) : (
                  <p className={baseField}>--</p>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls}>Giá/giờ (VND)</label>
              <p className={baseField}>{court.pricePerHour.toLocaleString()}</p>
            </div>
            <div>
              <label className={labelCls}>Trạng thái</label>
              <p className={baseField}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    court.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : court.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {court.status ?? "--"}
                </span>
              </p>
            </div>
            <div>
              <label className={labelCls}>Ưu tiên</label>
              <p className={baseField}>{court.priority}</p>
            </div>
            <div>
              <label className={labelCls}>Hoạt động</label>
              <p className={baseField}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    court.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {court.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div>
              <label className={labelCls}>Ngày bắt đầu</label>
              <p className={baseField}>
                {court.startDate ? new Date(court.startDate).toLocaleDateString() : "--"}
              </p>
            </div>
            <div>
              <label className={labelCls}>Ngày kết thúc</label>
              <p className={baseField}>
                {court.endDate ? new Date(court.endDate).toLocaleDateString() : "--"}
              </p>
            </div>
          </div>
        </Section>

        {/* Hình ảnh */}
        <Section icon={<Image className="w-4 h-4" />} title="Hình ảnh">
          {court.imageUrls && court.imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {court.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Court image ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa có hình ảnh.</p>
          )}
        </Section>

        {/* Feedbacks */}
        <Section icon={<Star className="w-4 h-4" />} title="Feedbacks">
          {feedbacksLoading ? (
            <p className="text-sm text-gray-500">Đang tải feedbacks...</p>
          ) : feedbacks.length > 0 ? (
            <div className="space-y-3">
              {feedbacks.map((fb: any, idx: number) => (
                <div key={idx} className="border-b border-gray-200 pb-2">
                  <p className="text-sm font-semibold text-gray-700">{fb.userName || "Ẩn danh"}</p>
                  <p className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{fb.comment}</p>
                  <p className="text-xs font-semibold text-yellow-600">Đánh giá: {fb.rating}/5</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa có feedback nào.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

export const CourtDetailModal: React.FC<Props & { open: boolean }> = ({ open, courtId, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ y: -8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-[101] w-[92vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <CourtDetail courtId={courtId} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourtDetail;