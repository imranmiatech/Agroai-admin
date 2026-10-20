import { baseApi } from '../../baseApi/baseApi';
import type { UserMetricsResponse } from './usersType';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserMetrics: builder.query<UserMetricsResponse, void>({
      query: () => ({
        url: '/users/metrics',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserMetricsQuery } = usersApi;
