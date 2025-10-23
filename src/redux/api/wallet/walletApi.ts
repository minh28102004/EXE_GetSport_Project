import { baseApi } from '@redux/api/baseApi';
import type { 
  WalletCreateDto, 
  WalletAddFundsDto, 
  WalletWithdrawFundsDto, 
  WalletDepositDto,
  WalletTransactionsEnvelope,
} from './types';
import { 
  mapWalletResponseToUi,
  mapWalletTransactionResponseToUi,
  mapWalletDepositResponseToUi,
  mapWalletCreateDto,
  mapWalletAddFundsDto,
  mapWalletWithdrawFundsDto,
  mapWalletDepositDto
} from './map';

const WALLET_PATH = 'Wallet';

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentWallet: builder.query({
      query: () => `${WALLET_PATH}/current`,
      transformResponse: (response: any) => ({
        ...response,
        data: mapWalletResponseToUi(response.data)
      }),
      providesTags: [{ type: 'Wallet', id: 'CURRENT' }],
    }),

    getWalletByUserId: builder.query({
      query: (userId: number) => `${WALLET_PATH}/${userId}`,
      transformResponse: (response: any) => ({
        ...response,
        data: mapWalletResponseToUi(response.data)
      }),
      providesTags: (result, error, userId) => [{ type: 'Wallet', id: userId }],
    }),

    createWallet: builder.mutation({
      query: (dto: WalletCreateDto) => ({
        url: WALLET_PATH,
        method: 'POST',
        body: mapWalletCreateDto(dto),
      }),
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),

    addFunds: builder.mutation({
      query: ({ userId, ...dto }: { userId: number } & WalletAddFundsDto) => ({
        url: `${WALLET_PATH}/${userId}/add-funds`,
        method: 'POST',
        body: mapWalletAddFundsDto(dto),
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Wallet', id: userId },
        { type: 'Wallet', id: 'CURRENT' }
      ],
    }),

    withdrawFunds: builder.mutation({
      query: ({ userId, ...dto }: { userId: number } & WalletWithdrawFundsDto) => ({
        url: `${WALLET_PATH}/${userId}/withdraw-funds`,
        method: 'POST',
        body: mapWalletWithdrawFundsDto(dto),
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Wallet', id: userId },
        { type: 'Wallet', id: 'CURRENT' }
      ],
    }),

    getWalletTransactions: builder.query<WalletTransactionsEnvelope, number>({
      query: (userId: number) => `${WALLET_PATH}/${userId}/transactions`,
      transformResponse: (response: any) => ({
        ...response,
        data: response.data.map(mapWalletTransactionResponseToUi)
      }),
      providesTags: (result, error, userId) => [
        { type: 'WalletTransaction', id: userId }
      ],
    }),

    depositToWallet: builder.mutation({
      query: ({ userId, ...dto }: { userId: number } & WalletDepositDto) => ({
        url: `${WALLET_PATH}/deposit`,
        method: 'POST',
        body: mapWalletDepositDto(dto),
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: mapWalletDepositResponseToUi(response.data)
      }),
      invalidatesTags: [{ type: 'Wallet', id: 'CURRENT' }],
    }),

    checkDepositStatus: builder.query({
      query: (orderCode: number) => `${WALLET_PATH}/${orderCode}/deposit-status`,
      transformResponse: (response: any) => ({
        ...response,
        data: response.data ? mapWalletResponseToUi(response.data) : response.data
      }),
      providesTags: [{ type: 'Wallet', id: 'CURRENT' }],
    }),

    getAllWallets: builder.query({
      query: ({ userId, minBalance }: { userId?: number; minBalance?: number } = {}) => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId.toString());
        if (minBalance) params.append('minBalance', minBalance.toString());
        return { url: WALLET_PATH, params };
      },
      transformResponse: (response: any) => ({
        ...response,
        data: response.data.map(mapWalletResponseToUi)
      }),
      providesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCurrentWalletQuery,
  useGetWalletByUserIdQuery,
  useGetWalletTransactionsQuery,
  useCheckDepositStatusQuery,
  useGetAllWalletsQuery,

  useCreateWalletMutation,
  useAddFundsMutation,
  useWithdrawFundsMutation,
  useDepositToWalletMutation,
} = walletApi;