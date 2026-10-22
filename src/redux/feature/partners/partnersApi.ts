import { baseApi } from '../../baseApi/baseApi';
import type {
  GetPartnershipRequestsParams,
  PartnerAttentionRequiredResponse,
  PartnerDivisionsResponse,
  PartnerMetricsResponse,
  PartnershipRequestsResponse,
  UpdatePartnerStatusPayload,
  UpdatePartnerStatusResponse,
} from './partnersType';

export const partnersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerMetrics: builder.query<PartnerMetricsResponse, void>({
      query: () => ({
        url: '/partners/metrics',
        method: 'GET',
      }),
      providesTags: ['Vendor'],
    }),

    getPartnerDivisions: builder.query<PartnerDivisionsResponse, void>({
      query: () => ({
        url: '/partners/by-division',
        method: 'GET',
      }),
      providesTags: ['Vendor'],
    }),

    getPartnerAttentionRequired: builder.query<PartnerAttentionRequiredResponse, void>({
      query: () => ({
        url: '/partners/attention-required',
        method: 'GET',
      }),
      providesTags: ['Vendor'],
    }),

    getPartnershipRequests: builder.query<
      PartnershipRequestsResponse,
      GetPartnershipRequestsParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          if (params.search?.trim()) {
            queryParams.search = params.search.trim();
          }
          if (params.location && params.location !== 'All' && params.location !== 'All Locations') {
            queryParams.location = params.location;
          }
          if (params.status && params.status !== 'All') {
            queryParams.status = params.status;
          }
        }

        return {
          url: '/partners/requests',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['Vendor'],
    }),

    updatePartnerStatus: builder.mutation<
      UpdatePartnerStatusResponse,
      UpdatePartnerStatusPayload
    >({
      query: ({ id, status, reason }) => ({
        url: `/partners/requests/${id}/status`,
        method: 'PATCH',
        body: { status, reason },
      }),
      invalidatesTags: ['Vendor'],
    }),
  }),
});

export const {
  useGetPartnerMetricsQuery,
  useGetPartnerDivisionsQuery,
  useGetPartnerAttentionRequiredQuery,
  useGetPartnershipRequestsQuery,
  useUpdatePartnerStatusMutation,
} = partnersApi;
