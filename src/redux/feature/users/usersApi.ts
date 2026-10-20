import { baseApi } from '../../baseApi/baseApi';
import type {
  GetUsersParams,
  GetUsersResponse,
  UpdateUserStatusPayload,
  UpdateUserStatusResponse,
  UserMetricsResponse,
} from './usersType';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserMetrics: builder.query<UserMetricsResponse, void>({
      query: () => ({
        url: '/users/metrics',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getUsers: builder.query<GetUsersResponse, GetUsersParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          if (params.search?.trim()) {
            queryParams.search = params.search.trim();
          }
          if (params.role && params.role !== 'All') {
            queryParams.role = params.role.toUpperCase();
          }
          if (params.status && params.status !== 'All') {
            queryParams.status = params.status.toUpperCase();
          }
        }

        return {
          url: '/users',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.users
          ? [
              ...result.data.users.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    updateUserStatus: builder.mutation<
      UpdateUserStatusResponse,
      UpdateUserStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        'User',
      ],
    }),

    deleteUser: builder.mutation<
      { success: boolean; message: string },
      string | number
    >({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        'User',
      ],
    }),
  }),
});

export const {
  useGetUserMetricsQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  usePrefetch,
} = usersApi;
