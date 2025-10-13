import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Star, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useGetMyFeedbacksQuery } from "@redux/api/feedback/feedbackApi";
import LoadingSpinner from "@components/Loading_Spinner";
import type { Feedback, FeedbackFilterParams } from "@redux/api/feedback/type";

const FeedbackHistory: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<FeedbackFilterParams>({
    page: 1,
    pageSize: 10,
    sortBy: "Createat",
    sortOrder: "desc",
  });

  const { data, error, isLoading } = useGetMyFeedbacksQuery(params);
  const feedbackList = Array.isArray(data?.data)
    ? data.data
    : (data?.data as Paged<Feedback> | undefined)?.items || [];
  const pagination = (data?.data as Paged<Feedback> | undefined)?.pagination || {
    TotalCount: feedbackList.length,
    PageSize: params.pageSize || 10,
    CurrentPage: params.page || 1,
    TotalPages: Math.ceil(feedbackList.length / (params.pageSize || 10)),
  };

  const sortOptions = [
    { value: "Createat", label: "Submitted On" },
    { value: "Rating", label: "Rating" },
    { value: "UserName", label: "User Name" },
    { value: "CourtLocation", label: "Court Location" },
    { value: "Bookingdate", label: "Booking Date" },
  ];

  const handleSortChange = (sortBy: string) => {
    setParams({ ...params, sortBy, page: 1 }); // Reset to page 1 on sort change
  };

  const toggleSortOrder = () => {
    setParams({
      ...params,
      sortOrder: params.sortOrder === "desc" ? "asc" : "desc",
      page: 1, // Reset to page 1 on sort order change
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination.TotalPages || 1)) {
      setParams({ ...params, page: newPage });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 py-10">
      <div className="mx-auto max-w-5xl px-5">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Your Feedback History
          </h1>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
                Sort By:
              </label>
              <select
                id="sortBy"
                value={params.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ebabc]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortOrder}
                className="p-2 text-gray-600 hover:text-[#2ebabc] flex items-center gap-1"
                title={params.sortOrder === "desc" ? "Sort ascending" : "Sort descending"}
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="text-sm">{params.sortOrder === "desc" ? "Desc" : "Asc"}</span>
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center text-gray-600 text-lg">
              <LoadingSpinner inline size="6" />
              <p className="mt-4">Loading your feedback...</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>
                {(error as any)?.data?.message ||
                  (error instanceof Error
                    ? error.message
                    : "Failed to load feedback. Please try again.")}
              </p>
            </div>
          )}

          {!isLoading && !error && feedbackList.length === 0 && (
            <div className="text-center text-gray-600">
              <p>You haven’t submitted any feedback yet.</p>
              <button
                onClick={() => navigate("/courts")}
                className="mt-4 text-[#2ebabc] hover:underline"
              >
                Explore courts to leave feedback
              </button>
            </div>
          )}

          {!isLoading && !error && feedbackList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-[#2ebabc]"
                      onClick={() => handleSortChange("CourtLocation")}
                    >
                      Court {params.sortBy === "CourtLocation" && <ArrowUpDown className="inline w-4 h-4" />}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-[#2ebabc]"
                      onClick={() => handleSortChange("Rating")}
                    >
                      Rating {params.sortBy === "Rating" && <ArrowUpDown className="inline w-4 h-4" />}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Comment
                    </th>
                    <th
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-[#2ebabc]"
                      onClick={() => handleSortChange("Bookingdate")}
                    >
                      Booking Date {params.sortBy === "Bookingdate" && <ArrowUpDown className="inline w-4 h-4" />}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-[#2ebabc]"
                      onClick={() => handleSortChange("Createat")}
                    >
                      Submitted On {params.sortBy === "Createat" && <ArrowUpDown className="inline w-4 h-4" />}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((feedback) => (
                    <tr key={feedback.id} className="border-b">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {feedback.courtName}
                        <br />
                        <span className="text-xs text-gray-500">
                          {feedback.courtLocation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2">({feedback.rating}/5)</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {feedback.comment || "No comment"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(feedback.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(feedback.createat).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination.TotalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {feedbackList.length} of {pagination.TotalCount} feedback
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange((params.page || 1) - 1)}
                      disabled={(params.page || 1) <= 1}
                      className="p-2 text-gray-600 hover:text-[#2ebabc] disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.CurrentPage} of {pagination.TotalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange((params.page || 1) + 1)}
                      disabled={(params.page || 1) >= pagination.TotalPages}
                      className="p-2 text-gray-600 hover:text-[#2ebabc] disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackHistory;