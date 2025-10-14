import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, DollarSign, Tag, UserPlus, Star, Edit, XCircle, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import { useGetCourtBookingQuery } from "@redux/api/booking/courtBookingApi";
import {
  useGetPlaymatePostsByCourtQuery,
  useCreatePlaymatePostMutation,
  useUpdatePlaymatePostMutation,
  useDeletePlaymatePostMutation,
} from "@redux/api/playmatePost/playmatePostApi";
import {
  useGetFeedbacksByCourtQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
} from "@redux/api/feedback/feedbackApi";
import type { CourtBooking } from "@redux/api/booking/type";
import type { PlaymatePost, PlaymatePostCreateDto, PlaymatePostUpdateDto } from "@redux/api/playmatePost/type";
import type { FeedbackCreateDto, FeedbackUpdateDto } from "@redux/api/feedback/type";
import dayjs from "dayjs";

const BookingDetail: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const { data: bookingData, isLoading, error } = useGetCourtBookingQuery(Number(bookingId), {
    skip: !bookingId || isNaN(Number(bookingId)),
  });

  const booking: CourtBooking | undefined = bookingData?.data;

  const [createPlaymatePost] = useCreatePlaymatePostMutation();
  const [updatePlaymatePost] = useUpdatePlaymatePostMutation();
  const [deletePlaymatePost] = useDeletePlaymatePostMutation();
  const [createFeedback] = useCreateFeedbackMutation();
  const [updateFeedback] = useUpdateFeedbackMutation();

  // State for review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingFeedbackId, setExistingFeedbackId] = useState<number | null>(null);

  // State for playmate post modal
  const [playmateModalOpen, setPlaymateModalOpen] = useState(false);
  const [playmateForm, setPlaymateForm] = useState<PlaymatePostCreateDto>({
    courtbookingId: Number(bookingId),
    title: "",
    content: "",
    neededplayers: 1,
    skilllevel: "Intermediate",
    status: "Open",
  });
  const [existingPostId, setExistingPostId] = useState<number | null>(null);

  // Fetch existing feedback
  const { data: feedbackData } = useGetFeedbacksByCourtQuery(
    {
      courtId: booking?.courtId ?? 0,
      params: { bookingId: Number(bookingId) },
    },
    { skip: !booking || !bookingId || isNaN(Number(bookingId)) }
  );

  const existingFeedback = Array.isArray(feedbackData?.data)
    ? feedbackData.data.find((f) => f.bookingId === Number(bookingId))
    : feedbackData?.data?.items?.find((f) => f.bookingId === Number(bookingId));

  // Fetch existing playmate post
  const { data: playmateData } = useGetPlaymatePostsByCourtQuery(
    {
      courtId: booking?.courtId ?? 0,
      params: { courtbookingId: Number(bookingId) },
    },
    { skip: !booking || !bookingId || isNaN(Number(bookingId)) }
  );

  const existingPost: PlaymatePost | undefined = Array.isArray(playmateData?.data)
    ? playmateData.data.find((p) => p.courtbookingId === Number(bookingId))
    : playmateData?.data?.items?.find((p) => p.courtbookingId === Number(bookingId));

  // Pre-fill review form if feedback exists
  useEffect(() => {
    if (existingFeedback) {
      setExistingFeedbackId(existingFeedback.id);
      setRating(existingFeedback.rating);
      setComment(existingFeedback.comment);
    }
  }, [existingFeedback]);

  // Pre-fill playmate post form if post exists
  useEffect(() => {
    if (existingPost) {
      setExistingPostId(existingPost.id);
      setPlaymateForm({
        courtbookingId: existingPost.courtbookingId,
        title: existingPost.title,
        content: existingPost.content,
        neededplayers: existingPost.neededplayers,
        skilllevel: existingPost.skilllevel,
        status: existingPost.status,
      });
    }
  }, [existingPost]);

  // Handle invalid bookingId
  if (!bookingId || isNaN(Number(bookingId))) {
    return (
      <div className="min-h-screen bg-slate-100/60 flex items-center justify-center">
        <div className="text-center text-red-500 text-lg">ID đặt sân không hợp lệ.</div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100/60 flex items-center justify-center">
        <div className="text-center text-gray-600 text-lg">
          <LoadingSpinner inline size="6" />
          Đang tải chi tiết đặt sân...
        </div>
      </div>
    );
  }

  // Handle error or no booking found
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-100/60 flex items-center justify-center">
        <div className="text-center text-red-500 text-lg">
          {(error as any)?.data?.message || "Lỗi khi tải chi tiết đặt sân."}
        </div>
      </div>
    );
  }

  // Format price
  const formatPrice = (amount: number): string =>
    new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  // Format date and time
  const formatDate = (date: Date): string => dayjs(date).format("DD/MM/YYYY");
  const formatTime = (date: Date): string => dayjs(date).format("HH:mm");

  // Handle open playmate post modal
  const handleOpenPlaymateModal = () => {
    setPlaymateModalOpen(true);
    if (!existingPost) {
      setPlaymateForm({
        courtbookingId: booking.id,
        title: "",
        content: "",
        neededplayers: 1,
        skilllevel: "Intermediate",
        status: "Open",
      });
      setExistingPostId(null);
    }
  };

  // Handle playmate form input changes
  const handlePlaymateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPlaymateForm((prev) => ({
      ...prev,
      [name]: name === "neededplayers" ? parseInt(value) || 1 : value,
    }));
  };

  // Handle create or update playmate post
  const handleSubmitPlaymatePost = async () => {
    try {
      if (existingPostId) {
        await updatePlaymatePost({
          id: existingPostId,
          body: playmateForm as PlaymatePostUpdateDto,
        }).unwrap();
        toast.success("Cập nhật bài tìm người chơi thành công!");
      } else {
        await createPlaymatePost(playmateForm).unwrap();
        toast.success("Đăng bài tìm người chơi thành công!");
      }
      setPlaymateModalOpen(false);
    } catch (e: any) {
      console.error("Playmate post error:", e);
      toast.error(e?.data?.message || "Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  // Handle close playmate post
  const handleClosePlaymatePost = async () => {
    if (!existingPostId) return;
    if (!window.confirm("Bạn có chắc chắn muốn đóng bài tìm người chơi này?")) return;

    try {
      await updatePlaymatePost({
        id: existingPostId,
        body: { ...playmateForm, status: "Closed" } as PlaymatePostUpdateDto,
      }).unwrap();
      toast.success("Đóng bài tìm người chơi thành công!");
    } catch (e: any) {
      console.error("Close playmate post error:", e);
      toast.error(e?.data?.message || "Đóng bài thất bại. Vui lòng thử lại.");
    }
  };

  // Handle reopen playmate post
  const handleReopenPlaymatePost = async () => {
    if (!existingPostId) return;
    if (!window.confirm("Bạn có chắc chắn muốn mở lại bài tìm người chơi này?")) return;

    try {
      await updatePlaymatePost({
        id: existingPostId,
        body: { ...playmateForm, status: "Open" } as PlaymatePostUpdateDto,
      }).unwrap();
      toast.success("Mở lại bài tìm người chơi thành công!");
    } catch (e: any) {
      console.error("Reopen playmate post error:", e);
      toast.error(e?.data?.message || "Mở bài thất bại. Vui lòng thử lại.");
    }
  };

  // Handle open review modal
  const handleOpenReview = () => {
    setReviewModalOpen(true);
    if (!existingFeedback) {
      setRating(0);
      setComment("");
      setExistingFeedbackId(null);
    }
  };

  // Handle submit review
  const handleSubmitReview = async () => {
    const reviewData: FeedbackCreateDto = {
      bookingId: booking.id,
      rating,
      comment,
    };

    try {
      if (existingFeedbackId) {
        await updateFeedback({ id: existingFeedbackId, body: reviewData as FeedbackUpdateDto }).unwrap();
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        await createFeedback(reviewData).unwrap();
        toast.success("Đánh giá thành công!");
      }
      setReviewModalOpen(false);
    } catch (e: any) {
      console.error("Review error:", e);
      toast.error(e?.data?.message || "Đánh giá thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 py-10">
      <div className="mx-auto max-w-5xl px-5">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Chi Tiết Đặt Sân</h1>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#23AEB1]" />
              <div>
                <p className="text-sm text-gray-600">Vị trí sân</p>
                <p className="font-medium">{booking.courtLocation || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#23AEB1]" />
              <div>
                <p className="text-sm text-gray-600">Ngày đặt</p>
                <p className="font-medium">{formatDate(booking.bookingDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#23AEB1]" />
              <div>
                <p className="text-sm text-gray-600">Khung giờ</p>
                <p className="font-medium">
                  {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-[#23AEB1]" />
              <div>
                <p className="text-sm text-gray-600">Số tiền</p>
                <p className="font-medium">
                  {booking.discountedAmount
                    ? `${formatPrice(booking.discountedAmount)} (Giảm ${booking.discountPercent}%)`
                    : formatPrice(booking.amount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-[#23AEB1]" />
              <div>
                <p className="text-sm text-gray-600">Mã giảm giá</p>
                <p className="font-medium">{booking.voucherCode || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
            {existingPost && (
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-[#23AEB1]" />
                <div>
                  <p className="text-sm text-gray-600">Tìm người chơi</p>
                  <p className="font-medium">
                    Cần {existingPost.neededplayers} người, hiện có {existingPost.currentPlayers} người
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {booking.status.toUpperCase() === "DONE" && (
                <button
                  onClick={handleOpenReview}
                  className="flex-1 px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <Star className="w-4 h-4" />
                  Đánh Giá
                </button>
              )}
              {booking.status.toUpperCase() === "CONFIRMED" && (
                <button
                  onClick={handleOpenPlaymateModal}
                  className="flex-1 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  {existingPost ? (
                    <>
                      <Edit className="w-4 h-4" />
                      Chỉnh Sửa Bài Tìm Người Chơi
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Tìm Người Chơi
                    </>
                  )}
                </button>
              )}
              {existingPost && booking.status.toUpperCase() === "CONFIRMED" && (
                <button
                  onClick={existingPost.status === "Closed" ? handleReopenPlaymatePost : handleClosePlaymatePost}
                  className="flex-1 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  {existingPost.status === "Closed" ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Mở Lại Bài Tìm Người Chơi
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Đóng Bài Tìm Người Chơi
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => navigate("/booking-history")}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                Quay Lại
              </button>
            </div>
          </div>

          {/* Review Modal */}
          {reviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Đánh Giá Sân</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Xếp hạng</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${
                            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nhận xét</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                      rows={4}
                      placeholder="Nhập nhận xét của bạn..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitReview}
                      disabled={rating === 0}
                      className="flex-1 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white py-2 rounded-lg hover:brightness-95 transition disabled:opacity-70"
                    >
                      Gửi Đánh Giá
                    </button>
                    <button
                      onClick={() => setReviewModalOpen(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Playmate Post Modal */}
          {playmateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {existingPost ? "Chỉnh Sửa Bài Tìm Người Chơi" : "Tạo Bài Tìm Người Chơi"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                      type="text"
                      name="title"
                      value={playmateForm.title}
                      onChange={handlePlaymateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                      placeholder="Nhập tiêu đề bài đăng..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                    <textarea
                      name="content"
                      value={playmateForm.content}
                      onChange={handlePlaymateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                      rows={4}
                      placeholder="Nhập mô tả chi tiết..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số người cần</label>
                    <input
                      type="number"
                      name="neededplayers"
                      value={playmateForm.neededplayers}
                      onChange={handlePlaymateFormChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trình độ</label>
                    <select
                      name="skilllevel"
                      value={playmateForm.skilllevel}
                      onChange={handlePlaymateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    >
                      <option value="Beginner">Người mới</option>
                      <option value="Intermediate">Trung bình</option>
                      <option value="Advanced">Nâng cao</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitPlaymatePost}
                      disabled={!playmateForm.title || !playmateForm.content || playmateForm.neededplayers < 1}
                      className="flex-1 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white py-2 rounded-lg hover:brightness-95 transition disabled:opacity-70"
                    >
                      {existingPost ? "Cập Nhật" : "Đăng Bài"}
                    </button>
                    <button
                      onClick={() => setPlaymateModalOpen(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail; 