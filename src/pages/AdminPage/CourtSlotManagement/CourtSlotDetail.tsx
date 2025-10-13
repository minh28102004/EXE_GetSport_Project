import React, { useEffect } from "react";
import { X, Clock, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetCourtSlotQuery } from "@redux/api/courtSlot/courtSlotApi";
import type { CourtSlot } from "@redux/api/courtSlot/type";
import LoadingSpinner from "@components/Loading_Spinner";

type Props = {
  slotId: number;
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

const CourtSlotDetail: React.FC<Props> = ({ slotId, onClose }) => {
  const { data: slotData, isLoading, isError } = useGetCourtSlotQuery(slotId);

  const slot: CourtSlot | undefined = slotData?.data;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (isLoading) return <div className="p-6 text-center"><LoadingSpinner inline /> Loading...</div>;
  if (isError || !slot) return <div className="p-6 text-center text-red-500">Error loading slot details.</div>;

  const startDate = new Date(slot.startTime).toLocaleDateString();
  const startTime = new Date(slot.startTime).toLocaleTimeString();
  const endDate = new Date(slot.endTime).toLocaleDateString();
  const endTime = new Date(slot.endTime).toLocaleTimeString();

  return (
    <div className="relative w-full p-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Chi tiết slot: {slot.slotNumber}</h2>
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
        <Section icon={<MapPin className="w-4 h-4" />} title="Thông tin sân">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tên sân</label>
              <p className={baseField}>{slot.courtName}</p>
            </div>
            <div>
              <label className={labelCls}>Vị trí</label>
              <p className={baseField}>{slot.courtLocation}</p>
            </div>
            <div>
              <label className={labelCls}>Giá/giờ</label>
              <p className={baseField}>{slot.courtPricePerHour.toLocaleString()} VND</p>
            </div>
            <div>
              <label className={labelCls}>Chủ sân</label>
              <p className={baseField}>{slot.ownerName}</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Hình ảnh</label>
              <p className={baseField}>{slot.courtImageUrls.join(", ")}</p>
            </div>
          </div>
        </Section>

        <Section icon={<Clock className="w-4 h-4" />} title="Thông tin slot">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Số slot</label>
              <p className={baseField}>{slot.slotNumber}</p>
            </div>
            <div>
              <label className={labelCls}>Bắt đầu (ngày)</label>
              <p className={baseField}>{startDate}</p>
            </div>
            <div>
              <label className={labelCls}>Bắt đầu (giờ)</label>
              <p className={baseField}>{startTime}</p>
            </div>
            <div>
              <label className={labelCls}>Kết thúc (ngày)</label>
              <p className={baseField}>{endDate}</p>
            </div>
            <div>
              <label className={labelCls}>Kết thúc (giờ)</label>
              <p className={baseField}>{endTime}</p>
            </div>
            <div>
              <label className={labelCls}>Trạng thái</label>
              <p className={baseField}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    slot.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {slot.isAvailable ? "Available" : "Unavailable"}
                </span>
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export const CourtSlotDetailModal: React.FC<Props & { open: boolean }> = ({ open, slotId, onClose }) => {
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
              <CourtSlotDetail slotId={slotId} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourtSlotDetail;