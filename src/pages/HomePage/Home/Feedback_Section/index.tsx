import React, { useState, useRef, useEffect } from "react";
import { MapPin, CheckCircle, Heart, } from "lucide-react";
import { Link } from "react-router-dom";
import { reviews } from "./data";

const FeedbackSection: React.FC = () => {
  // State cho từng review: expanded + overflow
  const [reviewState, setReviewState] = useState<
    Record<number, { expanded: boolean; overflow: boolean }>
  >({});
  const pRefs = useRef<{ [key: number]: HTMLParagraphElement | null }>({});

  // Kiểm tra overflow khi mount
  useEffect(() => {
    const newState: Record<number, { expanded: boolean; overflow: boolean }> =
      {};
    reviews.forEach((review) => {
      const p = pRefs.current[review.id];
      newState[review.id] = {
        expanded: false,
        overflow: p ? p.scrollHeight > p.clientHeight : false,
      };
    });
    setReviewState(newState);
  }, []);

  const toggleExpand = (id: number) => {
    setReviewState((prev) => ({
      ...prev,
      [id]: { ...prev[id], expanded: !prev[id].expanded },
    }));
  };

  // Format ngày
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hôm qua";
    if (diffDays <= 7) return `${diffDays} ngày trước`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string, timeString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${formattedDate} lúc ${timeString}`;
  };

  // Render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <svg
            className="w-5 h-5 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <svg
            className="w-5 h-5 text-yellow-400 fill-current absolute top-0 left-0"
            viewBox="0 0 20 20"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="py-12 sm:py-18 px-4 sm:px-6 lg:px-15 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hàng nghìn người chơi cầu lông đã tin tưởng và sử dụng dịch vụ của
            chúng tôi. Dưới đây là một số đánh giá từ họ.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {reviews.map((review) => {
            const state = reviewState[review.id];
            return (
              <div
                key={review.id}
                className="h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 border border-gray-100 hover:border-teal-200 group relative"
              >
                {/* Header */}
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(review.datePosted)}
                      </span>
                      {review.isVerified && (
                        <div className="flex items-center bg-teal-50 text-teal-600 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Xác thực
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="w-4 h-4 inline mr-1 mb-0.5" />
                      {review.location}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg inline-flex items-center w-fit">
                    {formatDateTime(review.datePosted, review.timePosted)}
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm font-medium text-gray-600">
                      ({review.rating})
                    </span>
                  </div>
                  {review.experienceYears && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {review.experienceYears} năm kinh nghiệm
                    </span>
                  )}
                </div>

                {/* Comment */}
                <div className="flex-1 text-gray-700 leading-relaxed mb-6 text-left">
                  <p
                    ref={(el) => {
                      pRefs.current[review.id] = el;
                    }}
                    className={`transition-all duration-300 ${
                      state?.expanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {review.comment}
                  </p>

                  {state?.overflow && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="text-teal-500 font-medium mt-1 hover:underline text-sm"
                    >
                      {state.expanded ? "Thu gọn" : "Đọc thêm"}
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {review.avatar}
                      </span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {review.author}
                      </h4>
                      <p className="text-sm text-gray-500">{review.role}</p>
                    </div>
                  </div>

                  <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors duration-200 group/like">
                    <Heart className="w-5 h-5 group-hover/like:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-medium">{review.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            to="/blogPost"
            className="group inline-flex items-center gap-1 px-3 py-2 border-2 border-teal-200 text-teal-600 rounded-xl font-semibold 
               hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            Xem Thêm Đánh Giá
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
