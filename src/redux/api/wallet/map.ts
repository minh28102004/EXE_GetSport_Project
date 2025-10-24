import type { 
  WalletResponseDto, 
  WalletTransactionResponseDto, 
  WalletDepositResponseDto 
} from './types';
import type { Wallet, WalletTransaction } from './types';

export const mapWalletResponseToUi = (dto: WalletResponseDto): Wallet => ({
  id: dto.walletId,
  userId: dto.userId,
  userName: dto.userName,
  balance: Number(dto.balance),
  createdAt: dto.createdat,
  updatedAt: dto.updatedat,
});

export const mapWalletTransactionResponseToUi = (dto: WalletTransactionResponseDto): WalletTransaction => ({
  id: dto.transactionId,
  walletId: dto.walletId,
  amount: Number(dto.amount),
  direction: dto.direction,
  type: dto.type as 'Deposit' | 'Withdrawal',
  relatedId: dto.relatedid,
  createdAt: dto.createdat,
  bankInfo: dto.bankinfo,
  comment: dto.comment,
});

export const mapWalletDepositResponseToUi = (dto: WalletDepositResponseDto): WalletDepositResponseDto => ({
  ...dto,
  amount: Number(dto.amount),
  walletBalance: Number(dto.walletBalance),
});

export const mapWalletCreateDto = (data: { userId: number; initialBalance: number }): WalletCreateDto => ({
  userId: data.userId,
  initialBalance: data.initialBalance,
});

export const mapWalletAddFundsDto = (data: { 
  amount: number; 
  relatedId?: string; 
  bankInfo?: string; 
  comment?: string; 
}): WalletAddFundsDto => ({
  amount: data.amount,
  relatedid: data.relatedId,
  bankinfo: data.bankInfo,
  comment: data.comment,
});

export const mapWalletWithdrawFundsDto = (data: { 
  amount: number; 
  relatedId?: string; 
  bankInfo?: string; 
  comment?: string; 
}): WalletWithdrawFundsDto => ({
  amount: data.amount,
  relatedid: data.relatedId,
  bankinfo: data.bankInfo,
  comment: data.comment,
});

export const mapWalletDepositDto = (data: { 
  orderCode: number; 
  amount: number; 
  bankInfo?: string; 
}): WalletDepositDto => ({
  orderCode: data.orderCode,
  amount: data.amount,
  bankInfo: data.bankInfo || 'PayOS',
});