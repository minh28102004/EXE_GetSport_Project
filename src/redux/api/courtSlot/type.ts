import type { ApiEnvelope } from "@redux/api/auth/type";

export type CourtSlotDto = {
  slotId: number;
  courtId: number;
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type CourtSlot = {
  id: number;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  courtPricePerHour: number;
  ownerId: number;
  ownerName: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type CourtSlotCreateDto = {
  courtId: number;
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type BulkCourtSlotCreateDto = {
  courtId: number;
  startDateTime: string;
  endDateTime: string;
  duration: number;
};

export type CourtSlotUpdateDto = {
  slotNumber?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
};

export type CourtSlotFilterParams = {
  courtId?: number;
  isAvailable?: boolean;
  startDateTime?: string;
  endDateTime?: string;
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

export type CourtSlotEnvelope = ApiEnvelope<CourtSlot>;
export type CourtSlotListEnvelope = ApiEnvelope<CourtSlot[] | Paged<CourtSlot>>;