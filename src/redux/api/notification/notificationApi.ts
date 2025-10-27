import { baseApi } from '@redux/api/baseApi';
import type { 
  NotificationFilterParams, 
  NotificationsEnvelope 
} from './type';
import { mapNotificationResponseToUi } from './map';

const NOTIFICATION_PATH = 'Notification';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTotalNotifications: builder.query({
      query: (params: NotificationFilterParams) => ({
        url: `${NOTIFICATION_PATH}/total`,
        params,
      }),
      providesTags: [{ type: 'Notification', id: 'TOTAL' }],
    }),

    getUserNotifications: builder.query<NotificationsEnvelope, NotificationFilterParams>({
      query: (params: NotificationFilterParams) => ({
        url: `${NOTIFICATION_PATH}/user`,
        params,
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: response.data.map(mapNotificationResponseToUi),
      }),
      providesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    markNotificationRead: builder.mutation({
      query: ({ notificationId, dto }: { notificationId: number, dto: { isRead: boolean } }) => ({
        url: `${NOTIFICATION_PATH}/${notificationId}/read`,
        method: 'PUT',
        body: dto,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }, { type: 'Notification', id: 'TOTAL' }],
    }),
  }),
});

export const {
  useGetTotalNotificationsQuery,
  useGetUserNotificationsQuery,
  useMarkNotificationReadMutation,
} = notificationApi;