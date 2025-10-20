import React, { useEffect } from "react";
import { X, Star, User, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetFeedbackQuery } from "@redux/api/feedback/feedbackApi";
import type { Feedback } from "@redux/api/feedback/type";
import LoadingSpinner from "@components/Loading_Spinner";

type Props = {
  feedbackId: number;
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

const FeedbackDetail: React.FC<Props> = ({ feedbackId, onClose }) => {
  const { data: feedbackData, isLoading, isError } = useGetFeedbackQuery(feedbackId);

  const feedback: Feedback | undefined = feedbackData?.data;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (isLoading) return <div className="p-6 text-center"><LoadingSpinner inline /> Loading...</div>;
  if (isError || !feedback) return <div className="p-6 text-center text-red-500">Error loading feedback details.</div>;

  const createdDate = new Date(feedback.createdAt).toLocaleString();

  return (
    <div className="relative w-full p-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Feedback Details: {feedback.id}</h2>
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
        <Section icon={<User className="w-4 h-4" />} title="User Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>User Name</label>
              <p className={baseField}>{feedback.userName}</p>
            </div>
          </div>
        </Section>

        <Section icon={<Calendar className="w-4 h-4" />} title="Booking Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Booking ID</label>
              <p className={baseField}>{feedback.bookingId}</p>
            </div>
            <div>
              <label className={labelCls}>Booking Date</label>
              <p className={baseField}>{new Date(feedback.bookingDate).toLocaleString()}</p>
            </div>
            <div>
              <label className={labelCls}>Court Name</label>
              <p className={baseField}>{feedback.courtName}</p>
            </div>
            <div>
              <label className={labelCls}>Court Location</label>
              <p className={baseField}>{feedback.courtLocation}</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Court Images</label>
              {feedback.courtImageUrls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {feedback.courtImageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Court image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              ) : (
                <p className={baseField}>No images available.</p>
              )}
            </div>
          </div>
        </Section>

        <Section icon={<Star className="w-4 h-4" />} title="Feedback Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rating</label>
              <p className={baseField}>{feedback.rating}</p>
            </div>
            <div>
              <label className={labelCls}>Created At</label>
              <p className={baseField}>{createdDate}</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Comment</label>
              <p className={baseField}>{feedback.comment}</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export const FeedbackDetailModal: React.FC<Props & { open: boolean }> = ({ open, feedbackId, onClose }) => {
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
              <FeedbackDetail feedbackId={feedbackId} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackDetail;