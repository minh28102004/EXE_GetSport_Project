import type { ApiEnvelope } from "@redux/api/auth/type";

export type CourtBookingDto = {
  bookingId: number;
  userId: number;
  courtId: number;
  slotId: number;
  bookingdate: Date;
  status: string;
  amount: number;
  createAt: Date;
  paymentMethod: 'PayOS' | 'Wallet';
};

export type CourtBooking = {
  id: number;
  userId: number;
  userName: string;
  courtId: number;
  courtOwnerId: number | null;
  courtOwnerName: string | null;
  courtLocation: string | null;
  courtImageUrls: string[];
  courtPricePerHour: number;
  slotId: number;
  slotStartTime: Date;
  slotEndTime: Date;
  bookingDate: Date;
  status: string;
  amount: number;
  createAt: Date;
  voucherCode: string | null;
  discountPercent: number | null;
  discountedAmount: number | null;
};

export type CourtBookingCreateDto = {
  courtId: number;
  slotId: number;
  bookingDate: Date;
  amount: number;
  voucherCode?: string;
};

export type CourtBookingUpdateDto = {
  status?: string;
};

export type CourtBookingFilterParams = {
  status?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  startBookingDate?: Date;
  endBookingDate?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type Paged<T> = {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type CourtBookingEnvelope = ApiEnvelope<CourtBooking>;
export type CourtBookingListEnvelope = ApiEnvelope<CourtBooking[] | Paged<CourtBooking>>;