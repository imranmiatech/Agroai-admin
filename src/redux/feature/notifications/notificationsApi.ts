import { baseApi } from '../../baseApi/baseApi';
import type {
  QueryNotificationsParams,
  GetNotificationsResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
  DeleteNotificationResponse,
  DeleteAllNotificationsResponse,
} from './notificationsType';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      GetNotificationsResponse,
      QueryNotificationsParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          if (params.isRead) queryParams.isRead = params.isRead;
          if (params.type) queryParams.type = params.type;
        }
        return {
          url: '/notifications',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.notifications
          ? [
              ...result.data.notifications.map(({ id }) => ({
                type: 'Notification' as const,
                id,
              })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    markNotificationAsRead: builder.mutation<
      MarkNotificationReadResponse,
      string
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    markAllNotificationsAsRead: builder.mutation<
      MarkAllNotificationsReadResponse,
      void
    >({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    deleteNotification: builder.mutation<DeleteNotificationResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    deleteAllNotifications: builder.mutation<
      DeleteAllNotificationsResponse,
      void
    >({
      query: () => ({
        url: '/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationsApi;
