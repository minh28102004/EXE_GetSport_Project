import type { 
  WithdrawalRequestDto, 
  WithdrawalActionDto, 
  WalletTransactionResponseDto,
} from './type';
import type { WalletTransaction } from './type';

export const mapWithdrawalRequestDto = (data: WithdrawalRequestDto): WithdrawalRequestDto => ({
  amount: data.amount,
  bankName: data.bankName,
  bankAccount: data.bankAccount,
  note: data.note,
});

export const mapWithdrawalActionDto = (data: WithdrawalActionDto): WithdrawalActionDto => ({
  status: data.status,
  adminNote: data.adminNote,
});

export const mapWalletTransactionResponseToUi = (dto: WalletTransactionResponseDto): WalletTransaction => ({
  id: dto.transactionId,
  walletId: dto.walletId,
  userId: dto.userId,
  userName: dto.userName,
  amount: Number(dto.amount),
  direction: dto.direction,
  type: dto.type,
  relatedId: dto.relatedid,
  createdAt: dto.createdat,
  bankInfo: dto.bankinfo,
  comment: dto.comment?.split(';')[0],
  status: dto.status || dto.comment?.split(';').pop(),
  walletBalance: Number(dto.walletBalance),
});