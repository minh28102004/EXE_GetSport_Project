import React, { useState } from "react";
import type { PlaymatePost } from "@redux/api/playmatePost/type";
import LoadingSpinner from "@components/Loading_Spinner";
import { X, Users, FileText, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  onSave: (data: Partial<PlaymatePost>) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
  initialData?: Partial<PlaymatePost>;
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

const PlaymatePostForm: React.FC<Props> = ({ onSave, onClose, loading, initialData }) => {
  const [form, setForm] = useState<Partial<PlaymatePost>>({
    courtbookingId: initialData?.courtbookingId ?? 0,
    title: initialData?.title ?? "",
    content: initialData?.content ?? "",
    neededplayers: initialData?.neededplayers ?? 1,
    skilllevel: initialData?.skilllevel ?? "",
    status: initialData?.status ?? "Open",
  });
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof PlaymatePost>(key: K, value: any) =>
    setForm((s) => ({ ...s, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courtbookingId) {
      setError("Booking ID is required.");
      return;
    }
    if (!form.title || form.title.length > 100) {
      setError("Title is required and cannot exceed 100 characters.");
      return;
    }
    if (form.content && form.content.length > 500) {
      setError("Content cannot exceed 500 characters.");
      return;
    }
    if (!form.neededplayers || form.neededplayers < 1) {
      setError("Needed players must be greater than 0.");
      return;
    }
    if (form.skilllevel && form.skilllevel.length > 50) {
      setError("Skill level cannot exceed 50 characters.");
      return;
    }
    if (!form.status || !["Open", "Closed", "Cancelled"].includes(form.status)) {
      setError("Status must be one of: Open, Closed, Cancelled.");
      return;
    }
    setError(null);
    onSave(form);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">
          {initialData?.id ? "Edit Playmate Post" : "Create Playmate Post"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
          aria-label="Close"
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

      <Section icon={<FileText className="w-4 h-4" />} title="Post Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="courtbookingId">Booking ID</Label>
            <input
              id="courtbookingId"
              type="number"
              min={1}
              className={baseField}
              value={form.courtbookingId ?? ""}
              onChange={(e) => setField("courtbookingId", e.target.value ? Number(e.target.value) : 0)}
              placeholder="Enter booking ID"
              required
              disabled={loading || !!initialData?.id}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              className={baseField}
              value={form.title ?? ""}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Enter post title"
              required
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              className={`${baseField} h-24`}
              value={form.content ?? ""}
              onChange={(e) => setField("content", e.target.value)}
              placeholder="Enter post content"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="neededplayers">Needed Players</Label>
            <input
              id="neededplayers"
              type="number"
              min={1}
              className={baseField}
              value={form.neededplayers ?? ""}
              onChange={(e) => setField("neededplayers", e.target.value ? Number(e.target.value) : 0)}
              placeholder="Enter needed players"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="skilllevel">Skill Level</Label>
            <input
              id="skilllevel"
              type="text"
              className={baseField}
              value={form.skilllevel ?? ""}
              onChange={(e) => setField("skilllevel", e.target.value)}
              placeholder="Enter skill level"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className={baseField}
              value={form.status ?? "Open"}
              onChange={(e) => setField("status", e.target.value)}
              disabled={loading}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
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
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <LoadingSpinner inline color="white" size="4" />}
          {initialData?.id ? "Update Post" : "Submit Post"}
        </button>
      </div>
    </form>
  );
};

export default PlaymatePostForm;

type ModalProps = Props & { open: boolean };

export const PlaymatePostFormModal: React.FC<ModalProps> = ({
  open,
  onClose,
  ...formProps
}) => {
  React.useEffect(() => {
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
              <PlaymatePostForm {...formProps} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};