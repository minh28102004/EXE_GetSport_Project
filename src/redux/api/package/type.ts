import type { ApiEnvelope } from "@redux/api/auth/type";

export type PackageDto = {
  packageId: number;
  name: string;
  description?: string | null;
  price: number;
  durationdays: number;
  isactive: boolean;
  createat: string;
  updateat?: string | null;
};

export type Package = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

export type PackageCreateDto = {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
};

export type PackageUpdateDto = Partial<PackageCreateDto> & {
  isActive?: boolean;
};

export type PackageFilterParams = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minDurationDays?: number;
  maxDurationDays?: number;
  isActive?: boolean;
  startCreateDate?: string;
  endCreateDate?: string;
  startUpdateDate?: string;
  endUpdateDate?: string;
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

export type PackageEnvelope = ApiEnvelope<Package>;
export type PackageListEnvelope = ApiEnvelope<Package[] | Paged<Package>>;