import React, { useEffect } from "react";
import { X, Users, FileText, Award, Calendar, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetPlaymatePostQuery } from "@redux/api/playmatePost/playmatePostApi";
import type { PlaymatePost } from "@redux/api/playmatePost/type";
import LoadingSpinner from "@components/Loading_Spinner";

type Props = {
  postId: number;
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

const PlaymatePostDetail: React.FC<Props> = ({ postId, onClose }) => {
  const { data: postData, isLoading, isError } = useGetPlaymatePostQuery(postId);

  const post: PlaymatePost | undefined = postData?.data;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (isLoading) return <div className="p-6 text-center"><LoadingSpinner inline /> Loading...</div>;
  if (isError || !post) return <div className="p-6 text-center text-red-500">Error loading playmate post details.</div>;

  const createdDate = new Date(post.createdat).toLocaleString();
  const bookingDate = new Date(post.bookingdate).toLocaleString();
  const slotStartTime = new Date(post.slotStarttime).toLocaleTimeString();
  const slotEndTime = new Date(post.slotEndtime).toLocaleTimeString();

  return (
    <div className="relative w-full p-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Playmate Post Details: {post.id}</h2>
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
        <Section icon={<Users className="w-4 h-4" />} title="User Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>User Name</label>
              <p className={baseField}>{post.userName}</p>
            </div>
          </div>
        </Section>

        <Section icon={<Calendar className="w-4 h-4" />} title="Booking Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Booking ID</label>
              <p className={baseField}>{post.courtbookingId}</p>
            </div>
            <div>
              <label className={labelCls}>Booking Date</label>
              <p className={baseField}>{bookingDate}</p>
            </div>
            <div>
              <label className={labelCls}>Court Name</label>
              <p className={baseField}>{post.courtName}</p>
            </div>
            <div>
              <label className={labelCls}>Court Location</label>
              <p className={baseField}>{post.courtLocation}</p>
            </div>
            <div>
              <label className={labelCls}>Slot Start Time</label>
              <p className={baseField}>{slotStartTime}</p>
            </div>
            <div>
              <label className={labelCls}>Slot End Time</label>
              <p className={baseField}>{slotEndTime}</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Court Images</label>
              <p className={baseField}>{post.courtImageUrls.join(", ")}</p>
            </div>
          </div>
        </Section>

        <Section icon={<FileText className="w-4 h-4" />} title="Post Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title</label>
              <p className={baseField}>{post.title}</p>
            </div>
            <div>
              <label className={labelCls}>Needed Players</label>
              <p className={baseField}>{post.neededplayers}</p>
            </div>
            <div>
              <label className={labelCls}>Current Players</label>
              <p className={baseField}>{post.currentPlayers}</p>
            </div>
            <div>
              <label className={labelCls}>Skill Level</label>
              <p className={baseField}>{post.skilllevel}</p>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <p className={baseField}>{post.status}</p>
            </div>
            <div>
              <label className={labelCls}>Created At</label>
              <p className={baseField}>{createdDate}</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Content</label>
              <p className={baseField}>{post.content}</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export const PlaymatePostDetailModal: React.FC<Props & { open: boolean }> = ({ open, postId, onClose }) => {
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
              <PlaymatePostDetail postId={postId} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaymatePostDetail;