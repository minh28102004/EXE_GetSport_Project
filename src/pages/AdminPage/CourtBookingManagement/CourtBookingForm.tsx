import React, { useEffect, useState } from "react";
import type { CourtBooking } from "@redux/api/booking/type";
import LoadingSpinner from "@components/Loading_Spinner";
import { X, Calendar, MapPin, Clock, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  booking: CourtBooking | null;
  onSave: (booking: Partial<CourtBooking>) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

const defaultNew: Partial<CourtBooking> = {
  courtId: 0,
  slotId: 0,
  bookingDate: new Date(),
  amount: 0,
  voucherCode: "",
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

const CourtBookingForm: React.FC<Props> = ({ booking, onSave, onClose, loading }) => {
  const [form, setForm] = useState<Partial<CourtBooking>>(booking ? { ...booking } : { ...defaultNew });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(booking ? { ...booking } : { ...defaultNew });
    console.log("CourtBookingForm: Initial form state:", booking ? { ...booking } : { ...defaultNew });
  }, [booking]);

  const setField = <K extends keyof CourtBooking>(key: K, value: any) =>
    setForm((s) => {
      const newState = { ...s, [key]: value };
      console.log("CourtBookingForm: Updated form state:", newState);
      return newState;
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courtId) {
      setError("Court ID is required.");
      return;
    }
    if (!form.slotId) {
      setError("Slot ID is required.");
      return;
    }
    if (!form.bookingDate) {
      setError("Booking date is required.");
      return;
    }
    if (form.amount == null || form.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    setError(null);
    console.log("CourtBookingForm: Submitting form data:", form);
    onSave(form);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Create New Booking</h2>
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

      <Section icon={<MapPin className="w-4 h-4" />} title="Booking Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="courtId">Court ID</Label>
            <input
              id="courtId"
              type="number"
              min={1}
              className={baseField}
              value={form.courtId ?? ""}
              onChange={(e) => setField("courtId", e.target.value ? Number(e.target.value) : 0)}
              placeholder="Enter court ID"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="slotId">Slot ID</Label>
            <input
              id="slotId"
              type="number"
              min={1}
              className={baseField}
              value={form.slotId ?? ""}
              onChange={(e) => setField("slotId", e.target.value ? Number(e.target.value) : 0)}
              placeholder="Enter slot ID"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="bookingDate">Booking Date</Label>
            <input
              id="bookingDate"
              type="date"
              className={baseField}
              value={form.bookingDate ? new Date(form.bookingDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setField("bookingDate", e.target.value ? new Date(e.target.value) : undefined)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount (VND)</Label>
            <input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              className={baseField}
              value={form.amount ?? ""}
              onChange={(e) => setField("amount", e.target.value ? Number(e.target.value) : 0)}
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="voucherCode">Voucher Code (optional)</Label>
            <input
              id="voucherCode"
              className={baseField}
              value={form.voucherCode ?? ""}
              onChange={(e) => setField("voucherCode", e.target.value)}
              placeholder="Enter voucher code"
              disabled={loading}
            />
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
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <LoadingSpinner inline color="white" size="4" />}
          Create Booking
        </button>
      </div>
    </form>
  );
};

export default CourtBookingForm;

type ModalProps = Props & { open: boolean };

export const CourtBookingFormModal: React.FC<ModalProps> = ({
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
              <CourtBookingForm {...formProps} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};