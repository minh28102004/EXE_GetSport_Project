import type { CourtBookingDto, CourtBooking, CourtBookingCreateDto, CourtBookingUpdateDto } from "./type";

export const mapDtoToUi = (dto: CourtBookingDto & {
  userName: string;
  courtOwnerId?: number;
  courtOwnerName?: string;
  courtLocation?: string;
  courtImageUrls: string[];
  courtPricePerHour: number;
  slotStartTime: Date;
  slotEndTime: Date;
  voucherCode?: string;
  discountPercent?: number;
  discountedAmount?: number;
}): CourtBooking => ({
  id: dto.bookingId,
  userId: dto.userId,
  userName: dto.userName,
  courtId: dto.courtId,
  courtOwnerId: dto.courtOwnerId ?? null,
  courtOwnerName: dto.courtOwnerName ?? null,
  courtLocation: dto.courtLocation ?? null,
  courtImageUrls: dto.courtImageUrls,
  courtPricePerHour: dto.courtPricePerHour,
  slotId: dto.slotId,
  slotStartTime: dto.slotStartTime,
  slotEndTime: dto.slotEndTime,
  bookingDate: dto.bookingdate,
  status: dto.status,
  amount: dto.amount,
  createAt: dto.createAt,
  voucherCode: dto.voucherCode ?? null,
  discountPercent: dto.discountPercent ?? null,
  discountedAmount: dto.discountedAmount ?? null,
});

export const mapUiToCreateDto = (booking: Partial<CourtBooking>): CourtBookingCreateDto => ({
  courtId: booking.courtId ?? 0,
  slotId: booking.slotId ?? 0,
  bookingDate: booking.bookingDate ?? new Date(),
  amount: booking.amount ?? 0,
  voucherCode: booking.voucherCode,
});

export const mapUiToUpdateDto = (booking: Partial<CourtBooking>): CourtBookingUpdateDto => ({
  Status: booking.status,
});