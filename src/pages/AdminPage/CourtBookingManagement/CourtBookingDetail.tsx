import React, { useEffect } from "react";
import { X, Calendar, MapPin, Clock, Tag, DollarSign } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetCourtBookingQuery, useCheckPaymentStatusQuery } from "@redux/api/booking/courtBookingApi";
import type { CourtBooking } from "@redux/api/booking/type";
import LoadingSpinner from "@components/Loading_Spinner";

type Props = {
  bookingId: number;
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

const CourtBookingDetail: React.FC<Props> = ({ bookingId, onClose }) => {
  const { data: bookingData, isLoading: bookingLoading, isError: bookingError } = useGetCourtBookingQuery(bookingId);
  const { data: paymentStatusData, isLoading: paymentLoading } = useCheckPaymentStatusQuery(bookingId);

  const booking: CourtBooking | undefined = bookingData?.data;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (bookingLoading || paymentLoading) {
    return (
      <div className="p-6 text-center">
        <LoadingSpinner inline />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (bookingError || !booking) {
    return <div className="p-6 text-center text-red-500">Error loading booking details.</div>;
  }

  return (
    <div className="relative w-full p-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Booking Details: #{booking.id}</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 mt-4">
        <Section icon={<MapPin className="w-4 h-4" />} title="Court Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Court Location</label>
              <p className={baseField}>{booking.courtLocation ?? "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Court Owner</label>
              <p className={baseField}>{booking.courtOwnerName ?? "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Price per Hour</label>
              <p className={baseField}>{booking.courtPricePerHour.toLocaleString()} VND</p>
            </div>
            <div>
              <label className={labelCls}>Images</label>
              {booking.courtImageUrls.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {booking.courtImageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Court image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className={baseField}>No images available</p>
              )}
            </div>
          </div>
        </Section>

        <Section icon={<Clock className="w-4 h-4" />} title="Slot Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Slot ID</label>
              <p className={baseField}>{booking.slotId}</p>
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <p className={baseField}>
                {new Date(booking.slotStartTime).toLocaleTimeString()} -{" "}
                {new Date(booking.slotEndTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Section>

        <Section icon={<Calendar className="w-4 h-4" />} title="Booking Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Booking Date</label>
              <p className={baseField}>{new Date(booking.bookingDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <p className={baseField}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
            </div>
            <div>
              <label className={labelCls}>Amount</label>
              <p className={baseField}>{booking.amount.toLocaleString()} VND</p>
            </div>
            <div>
              <label className={labelCls}>Created At</label>
              <p className={baseField}>{new Date(booking.createAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Section>

        <Section icon={<Tag className="w-4 h-4" />} title="Voucher Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Voucher Code</label>
              <p className={baseField}>{booking.voucherCode ?? "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Discount Percent</label>
              <p className={baseField}>{booking.discountPercent ? `${booking.discountPercent}%` : "--"}</p>
            </div>
            <div>
              <label className={labelCls}>Discounted Amount</label>
              <p className={baseField}>
                {booking.discountedAmount ? booking.discountedAmount.toLocaleString() + " VND" : "--"}
              </p>
            </div>
          </div>
        </Section>

        <Section icon={<DollarSign className="w-4 h-4" />} title="Payment Status">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelCls}>Payment Status</label>
              <p className={baseField}>{paymentStatusData?.data?.status ?? "Unknown"}</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export const CourtBookingDetailModal: React.FC<Props & { open: boolean }> = ({ open, bookingId, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
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
              <CourtBookingDetail bookingId={bookingId} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourtBookingDetail;