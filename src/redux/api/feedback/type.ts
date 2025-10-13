import type { ApiEnvelope } from "@redux/api/auth/type";

export type FeedbackDto = {
  feedbackId: number;
  bookingId: number;
  bookingDate: string;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export interface AverageRatingResponse {
  AverageRating: number;
  TotalFeedbacks: number;
  Feedbacks: Feedback[];
  Pagination: {
    TotalCount: number;
    PageSize: number;
    CurrentPage: number;
    TotalPages: number;
  };
}

export type Feedback = {
  id: number;
  bookingId: number;
  bookingDate: string;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type FeedbackCreateDto = {
  bookingId: number;
  rating: number;
  comment: string;
};

export type FeedbackUpdateDto = {
  rating?: number;
  comment?: string;
};

export type FeedbackFilterParams = {
  bookingId?: number;
  userId?: number;
  minRating?: number;
  maxRating?: number;
  startCreateDate?: string;
  endCreateDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
};

export type FeedbackEnvelope = ApiEnvelope<Feedback>;
export type FeedbackListEnvelope = ApiEnvelope<Feedback[] | Paged<Feedback>>;