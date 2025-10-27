import { baseApi } from '@redux/api/baseApi';
import type { 
  WithdrawalRequestDto, 
  WithdrawalActionDto, 
  WalletTransactionFilterParams,
  WalletTransactionsEnvelope,
} from './type';
import { 
  mapWithdrawalRequestDto,
  mapWithdrawalActionDto,
  mapWalletTransactionResponseToUi,
} from './map';

const WALLET_TRANSACTION_PATH = 'WalletTransaction';

export const walletTransactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWithdrawalRequest: builder.mutation({
      query: (dto: WithdrawalRequestDto) => ({
        url: `${WALLET_TRANSACTION_PATH}/withdraw-request`,
        method: 'POST',
        body: mapWithdrawalRequestDto(dto),
      }),
      invalidatesTags: [{ type: 'WalletTransaction', id: 'LIST' }, { type: 'Wallet', id: 'CURRENT' }],
    }),

    processWithdrawalRequest: builder.mutation({
      query: ({ transactionId, ...dto }: { transactionId: number } & WithdrawalActionDto) => ({
        url: `${WALLET_TRANSACTION_PATH}/withdraw-request/${transactionId}/process`,
        method: 'POST',
        body: mapWithdrawalActionDto(dto),
      }),
      invalidatesTags: [{ type: 'WalletTransaction', id: 'LIST' }, { type: 'Wallet', id: 'CURRENT' }],
    }),

    getUserTransactionHistory: builder.query<WalletTransactionsEnvelope, WalletTransactionFilterParams>({
      query: (params: WalletTransactionFilterParams) => ({
        url: `${WALLET_TRANSACTION_PATH}/history`,
        params,
      }),
      transformResponse: (response: WalletTransactionsEnvelope) => ({
        ...response,
        data: response.data.map(mapWalletTransactionResponseToUi),
        pagination: response.pagination,
      }),
      providesTags: [{ type: 'WalletTransaction', id: 'LIST' }],
    }),

    getAllWithdrawalRequests: builder.query<WalletTransactionsEnvelope, WalletTransactionFilterParams>({
      query: (params: WalletTransactionFilterParams) => ({
        url: `${WALLET_TRANSACTION_PATH}/withdraw-requests`,
        params,
      }),
      transformResponse: (response: WalletTransactionsEnvelope) => ({
        ...response,
        data: response.data.map(mapWalletTransactionResponseToUi),
        pagination: response.pagination,
      }),
      providesTags: [{ type: 'WalletTransaction', id: 'ADMIN_LIST' }],
    }),
  }),
});

export const {
  useCreateWithdrawalRequestMutation,
  useProcessWithdrawalRequestMutation,
  useGetUserTransactionHistoryQuery,
  useGetAllWithdrawalRequestsQuery,
} = walletTransactionApi;