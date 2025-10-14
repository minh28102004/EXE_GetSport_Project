import type { FeedbackDto, Feedback, FeedbackCreateDto, FeedbackUpdateDto } from "./type";

export const mapDtoToUi = (d: FeedbackDto): Feedback => ({
  id: d.feedbackId,
  bookingId: d.bookingId,
  bookingDate: d.bookingdate,
  courtId: d.courtId,
  courtName: d.courtName ?? "",
  courtLocation: d.courtLocation ?? "",
  courtImageUrls: d.courtImageUrls ?? [],
  userId: d.userId,
  userName: d.userName ?? "",
  rating: d.rating,
  comment: d.comment,
  createat: d.createat,
});

export const mapUiToCreateDto = (s: Partial<Feedback>): FeedbackCreateDto => ({
  bookingId: s.bookingId ?? 0,
  rating: s.rating ?? 0,
  comment: s.comment ?? "",
});

export const mapUiToUpdateDto = (s: Partial<Feedback>): FeedbackUpdateDto => ({
  rating: s.rating,
  comment: s.comment,
});