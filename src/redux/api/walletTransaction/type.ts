import type { ApiEnvelope } from "../auth/type";

export type WithdrawalRequestDto = {
  amount: number;
  bankName: string;
  bankAccount: string;
  note?: string;
};

export type WithdrawalActionDto = {
  status: string;
  adminNote?: string;
};

export type WalletTransactionResponseDto = {
  transactionId: number;
  walletId: number;
  userId: number;
  userName: string;
  amount: number;
  direction: number;
  type: string;
  relatedid?: number;
  createdat: string;
  bankinfo?: string;
  comment?: string;
  status?: string;
  walletBalance: number;
};

export type WalletTransactionFilterParams = {
  userId?: number;
  type?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
};

export type Pagination = {
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type WalletTransaction = {
  id: number;
  walletId: number;
  userId: number;
  userName: string;
  amount: number;
  direction: number;
  type: string;
  relatedId?: number;
  createdAt: string;
  bankInfo?: string;
  comment?: string;
  status?: string;
  walletBalance: number;
};

export type WalletTransactionEnvelope = ApiEnvelope<WalletTransactionResponseDto>;
export type WalletTransactionsEnvelope = ApiEnvelope<WalletTransactionResponseDto[]> & { pagination?: Pagination };