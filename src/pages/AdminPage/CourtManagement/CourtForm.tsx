// CourtForm.tsx
import React, { useEffect, useState } from "react";
import type { Court } from "@redux/api/court/type";
import LoadingSpinner from "@components/Loading_Spinner"; // Giả sử có
import { X, MapPin, DollarSign, Calendar, Image } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  court: Court | null; // null = create
  onSave: (court: Partial<Court> & { images?: File[] }) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

const defaultNew: Partial<Court> = {
  location: "",
  pricePerHour: 0,
  priority: 0,
  isActive: true,
  status: "Pending",
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

const CourtForm: React.FC<Props> = ({ court, onSave, onClose, loading }) => {
  const [form, setForm] = useState<Partial<Court> & { images?: File[] }>(
    court ? { ...court } : { ...defaultNew }
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setForm(court ? { ...court } : { ...defaultNew });
    setImagePreviews([]);
  }, [court]);

  const setField = <K extends keyof (Court & { images?: File[] })>(
    key: K,
    value: any
  ) => setForm((s) => ({ ...s, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm((s) => ({ ...s, images: files }));
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const isEdit = !!court?.id;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Header + Close */}
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">
          {isEdit ? "Sửa sân" : "Thêm sân mới"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Thông tin cơ bản */}
      <Section icon={<MapPin className="w-4 h-4" />} title="Thông tin sân">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="location">Vị trí</Label>
            <input
              id="location"
              className={baseField}
              value={form.location ?? ""}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="VD: Sân bóng ABC, Quận 1"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="pricePerHour">Giá/giờ (VND)</Label>
            <input
              id="pricePerHour"
              type="number"
              min={0}
              className={baseField}
              value={form.pricePerHour ?? ""}
              onChange={(e) => setField("pricePerHour", Number(e.target.value))}
              placeholder="0"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="priority">Ưu tiên</Label>
            <input
              id="priority"
              type="number"
              min={0}
              className={baseField}
              value={form.priority ?? ""}
              onChange={(e) => setField("priority", Number(e.target.value))}
              placeholder="0"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              className={baseField}
              value={form.status ?? "Pending"}
              onChange={(e) => setField("status", e.target.value)}
              disabled={loading || !isEdit}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="images">Hình ảnh (tùy chọn)</Label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className={baseField}
              disabled={loading}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, idx) => (
                  <img key={idx} src={preview} alt="Preview" className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            )}
            {isEdit && form.imageUrls && form.imageUrls.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">Hình hiện tại: {form.imageUrls.join(", ")}</div>
            )}
          </div>
        </div>
      </Section>

      {/* Ngày */}
      <Section icon={<Calendar className="w-4 h-4" />} title="Thời gian hoạt động">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="startDate">Ngày bắt đầu</Label>
            <input
              id="startDate"
              type="date"
              className={baseField}
              value={(form.startDate ?? "") as string}
              onChange={(e) => setField("startDate", e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="endDate">Ngày kết thúc</Label>
            <input
              id="endDate"
              type="date"
              className={baseField}
              value={(form.endDate ?? "") as string}
              onChange={(e) => setField("endDate", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </Section>

      {/* Actions */}
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

export default CourtForm;

/* ===================== Modal Wrapper ===================== */
type ModalProps = Props & { open: boolean };

export const CourtFormModal: React.FC<ModalProps> = ({
  open,
  onClose,
  ...formProps
}) => {
  // ESC để đóng
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
          className="fixed inset-0 z-[100] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* panel */}
          <motion.div
            key="panel"
            initial={{ y: -8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-[101] w-[92vw] max-w-2xl rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <CourtForm {...formProps} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};