// src/redux/api/ownerPackage/type.ts
import type { ApiEnvelope } from "@redux/api/auth/type";

export type OwnerPackageDto = {
  ownerpackageId: number;
  ownerId: number;
  ownerName?: string;
  packagename: string;
  duration: number;
  startdate: string;
  enddate: string;
  price: number;
  status: string;
  createat: string;
  priority: number;
};

export type OwnerPackage = {
  id: number;
  ownerId: number;
  ownerName?: string;
  name: string;
  duration: number;
  startDate: string;
  endDate: string;
  price: number;
  status: string;
  createdAt: string;
  priority: number;
};

export type OwnerPackageCreateDto = {
  ownerId: number;
  packagename: string;
  duration: number;
  startdate: string;
  enddate: string;
  price: number;
  priority: number;
};

export type OwnerPackageUpdateDto = {
  packagename?: string;
  duration?: number;
  startdate?: string;
  enddate?: string;
  price?: number;
  status?: string;
  priority?: number;
};

export type OwnerPackageFilterParams = {
  ownerId?: number;
  status?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  startCreateDate?: string;
  endCreateDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type OwnerPackagePaymentStatus = {
  ownerPackageId: number;
  status: "Pending" | "Active" | "Expired" | "Cancelled";
  paymentStatus: "PAID" | "CANCELLED" | "PENDING" | "FAILED";
  amountPaid?: number;
  amountRemaining?: number;
};

// ✅ THÊM MỚI
export type OwnerPackageActiveCheckDto = {
  hasActivePackage: boolean;
  ownerId: number;
  packageId: number;
  packageName: string;
  duration: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  price: number;
  priority: number;
  isExpired: boolean;
  ownerName: string;
};

export type OwnerPackageActiveCheckEnvelope = ApiEnvelope<OwnerPackageActiveCheckDto>;

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
};

export type OwnerPackageEnvelope = ApiEnvelope<OwnerPackage>;
export type OwnerPackageListEnvelope = ApiEnvelope<OwnerPackage[] | Paged<OwnerPackage>>;