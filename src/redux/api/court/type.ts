// @redux/api/court/type.ts
import type { ApiEnvelope } from "@redux/api/auth/type";

/** BE DTO */
export type CourtDto = {
  courtId: number;
  ownerId: number;
  ownerName: string;
  location: string;
  imageurls: string[]; // Array of URLs
  priceperhour: number;
  status?: string | null;
  isactive: boolean;
  priority: number;
  startdate?: string | null; // ISO date
  enddate?: string | null;
};

/** UI type (camelCase, id) */
export type Court = {
  id: number;
  ownerId: number;
  ownerName: string;
  location: string;
  imageUrls: string[];
  pricePerHour: number;
  status?: string | null;
  isActive: boolean;
  priority: number;
  startDate?: string | null;
  endDate?: string | null;
};

/** Create DTO (từ BE, với files) */
export type CreateCourtDto = {
  location: string;
  pricePerHour: number;
  priority?: number;
  startDate?: string;
  endDate?: string;
  images?: File[];
};

/** Update DTO */
export type UpdateCourtDto = Partial<CreateCourtDto> & {
  status?: string | null;
  isActive?: boolean;
};


/** List params (từ BE params) */
export type ListParams = {
  status?: string | null;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
};

// Default params cho trang user (status luôn là active)
export const DEFAULT_COURT_LIST_PARAMS: ListParams = {
  status: "active",
  page: 1,
  pageSize: 10,
  sortOrder: "asc",
};

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number; // Thêm cho UI
};

/** Envelopes */
export type CourtEnvelope = ApiEnvelope<Court>;
export type CourtListEnvelope = ApiEnvelope<Court[] | Paged<Court>>;