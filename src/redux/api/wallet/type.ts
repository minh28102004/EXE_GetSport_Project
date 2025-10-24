import type { ApiEnvelope } from '@redux/api/auth/type';

export type WalletCreateDto = {
  userId: number;
  initialBalance: number;
};

export type WalletAddFundsDto = {
  amount: number;
  relatedId?: string;
  bankInfo?: string;
  comment?: string;
};

export type WalletWithdrawFundsDto = {
  amount: number;
  relatedId?: string;
  bankInfo?: string;
  comment?: string;
};

export type WalletDepositDto = {
  orderCode: number;
  amount: number;
  bankInfo?: string;
};

export type WalletResponseDto = {
  walletId: number;
  userId: number;
  userName: string;
  balance: number;
  createdat: string;
  updatedat?: string;
};

export type WalletTransactionResponseDto = {
  transactionId: number;
  walletId: number;
  amount: number;
  direction: number;
  type: 'Deposit' | 'Withdrawal';
  relatedId?: string;
  createdat: string;
  bankInfo?: string;
  comment?: string;
};

export type WalletDepositResponseDto = {
  orderCode: number;
  amount: number;
  walletBalance: number;
  paymentLink: string;
  bankInfo: string;
};

export type Wallet = {
  id: number;
  userId: number;
  userName: string;
  balance: number;
  createdAt: string;
  updatedAt?: string;
};

export type WalletTransaction = {
  id: number;
  walletId: number;
  amount: number;
  direction: number;
  type: 'Deposit' | 'Withdrawal';
  relatedId?: string;
  createdAt: string;
  bankInfo?: string;
  comment?: string;
};

export type WalletEnvelope = ApiEnvelope<WalletResponseDto>;
export type WalletsEnvelope = ApiEnvelope<WalletResponseDto[]>;
export type WalletTransactionsEnvelope = ApiEnvelope<WalletTransactionResponseDto[]>;
export type WalletDepositEnvelope = ApiEnvelope<WalletDepositResponseDto>;