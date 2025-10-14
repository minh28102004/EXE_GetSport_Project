import React, { useEffect, useState } from "react";
import type { CourtSlot } from "@redux/api/courtSlot/type";
import LoadingSpinner from "@components/Loading_Spinner";
import { X, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  slot: CourtSlot | null;
  onSave: (slot: Partial<CourtSlot>) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

const defaultNew: Partial<CourtSlot> = {
  courtId: 0,
  slotNumber: 0,
  startTime: "",
  endTime: "",
  isAvailable: true,
};

const baseField =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm " +
  "transition-colors duration-150 placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 " +
  "disabled:bg-slate-50 disabled:text-slate-400";

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({
  children,
  htmlFor,
}) => (
  <label
    htmlFor={htmlFor}
    className="text-[12px] font-medium text-slate-600 block"
  >
    {children}
  </label>
);

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

const CourtSlotForm: React.FC<Props> = ({ slot, onSave, onClose, loading }) => {
  const [form, setForm] = useState<Partial<CourtSlot>>(slot ? { ...slot } : { ...defaultNew });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(slot ? { ...slot } : { ...defaultNew });
  }, [slot]);

  const setField = <K extends keyof CourtSlot>(key: K, value: any) =>
    setForm((s) => ({ ...s, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courtId) {
      setError("Court ID is required.");
      return;
    }
    if (!form.startTime || !form.endTime) {
      setError("Start and end time are required.");
      return;
    }
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      setError("Start time must be before end time.");
      return;
    }
    setError(null);
    onSave(form);
  };

  const isEdit = !!slot?.id;

  const startTimeValue = form.startTime ? new Date(form.startTime).toISOString().slice(0, 16) : "";
  const endTimeValue = form.endTime ? new Date(form.endTime).toISOString().slice(0, 16) : "";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">
          {isEdit ? "Sửa slot" : "Thêm slot mới"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
          aria-label="Đóng"
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Section icon={<Clock className="w-4 h-4" />} title="Thông tin slot">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="courtId">Court ID</Label>
            <input
              id="courtId"
              type="number"
              min={1}
              className={baseField}
              value={form.courtId ?? ""}
              onChange={(e) => setField("courtId", e.target.value ? Number(e.target.value) : 0)}
              placeholder="Court ID"
              required
              disabled={loading || isEdit}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="slotNumber">Số slot</Label>
            <input
              id="slotNumber"
              type="number"
              min={0}
              className={baseField}
              value={form.slotNumber ?? ""}
              onChange={(e) => setField("slotNumber", e.target.value ? Number(e.target.value) : 0)}
              placeholder="0"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="startTime">Bắt đầu</Label>
            <input
              id="startTime"
              type="datetime-local"
              className={baseField}
              value={startTimeValue}
              onChange={(e) => setField("startTime", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Kết thúc</Label>
            <input
              id="endTime"
              type="datetime-local"
              className={baseField}
              value={endTimeValue}
              onChange={(e) => setField("endTime", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="isAvailable">Trạng thái</Label>
            <select
              id="isAvailable"
              className={baseField}
              value={form.isAvailable ? "true" : "false"}
              onChange={(e) => setField("isAvailable", e.target.value === "true")}
              disabled={loading}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <LoadingSpinner inline color="white" size="4" />}
          {isEdit ? "Lưu thay đổi" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default CourtSlotForm;

type ModalProps = Props & { open: boolean };

export const CourtSlotFormModal: React.FC<ModalProps> = ({
  open,
  onClose,
  ...formProps
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
              <CourtSlotForm {...formProps} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};