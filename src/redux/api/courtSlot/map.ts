import type { CourtSlotDto, CourtSlot, CourtSlotCreateDto, BulkCourtSlotCreateDto, CourtSlotUpdateDto } from "./type";

export const mapDtoToUi = (d: CourtSlotDto): CourtSlot => ({
  id: d.slotId,
  courtId: d.courtId,
  courtName: d.courtName ?? "",
  courtLocation: d.courtLocation ?? "",
  courtImageUrls: d.courtImageUrls ?? [],
  courtPricePerHour: d.courtPricePerHour ?? 0,
  ownerId: d.ownerId ?? 0,
  ownerName: d.ownerName ?? "",
  slotNumber: d.slotNumber,
  startTime: d.startTime,
  endTime: d.endTime,
  isAvailable: d.isAvailable,
});

export const mapUiToCreateDto = (s: Partial<CourtSlot>): CourtSlotCreateDto => ({
  courtId: s.courtId ?? 0,
  slotNumber: s.slotNumber ?? 0,
  startTime: s.startTime ?? "",
  endTime: s.endTime ?? "",
  isAvailable: s.isAvailable ?? true,
});

export const mapUiToBulkCreateDto = (s: Partial<CourtSlot>): BulkCourtSlotCreateDto => ({
  courtId: s.courtId ?? 0,
  startDateTime: s.startTime ?? "",
  endDateTime: s.endTime ?? "",
  duration: (new Date(s.endTime ?? "") - new Date(s.startTime ?? "")) / 60000,
});

export const mapUiToUpdateDto = (s: Partial<CourtSlot>): CourtSlotUpdateDto => ({
  slotNumber: s.slotNumber,
  startTime: s.startTime,
  endTime: s.endTime,
  isAvailable: s.isAvailable,
});