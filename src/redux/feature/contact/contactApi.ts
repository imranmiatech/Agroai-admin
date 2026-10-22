import { baseApi } from '../../baseApi/baseApi';
import type {
  GetContactInquiriesParams,
  GetContactInquiriesResponse,
  GetContactMetricsResponse,
  SingleContactResponse,
  UpdateContactStatusPayload,
  DeleteContactResponse,
} from './contactType';

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactInquiries: builder.query<GetContactInquiriesResponse, GetContactInquiriesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.set('search', params.search);
          if (params.status && params.status !== 'All') {
            queryParams.set('status', params.status);
          }
          if (params.page) queryParams.set('page', String(params.page));
          if (params.limit) queryParams.set('limit', String(params.limit));
        }

        const queryString = queryParams.toString();
        return {
          url: `/contact${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Contact'],
    }),

    getContactMetrics: builder.query<GetContactMetricsResponse, void>({
      query: () => ({
        url: '/contact/metrics',
        method: 'GET',
      }),
      providesTags: ['Contact'],
    }),

    getContactInquiryById: builder.query<SingleContactResponse, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Contact', id }],
    }),

    updateContactStatus: builder.mutation<SingleContactResponse, UpdateContactStatusPayload>({
      query: ({ id, status, replyMessage }) => ({
        url: `/contact/${id}/status`,
        method: 'PATCH',
        body: { status, replyMessage },
      }),
      invalidatesTags: ['Contact'],
    }),

    deleteContactInquiry: builder.mutation<DeleteContactResponse, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useGetContactInquiriesQuery,
  useGetContactMetricsQuery,
  useGetContactInquiryByIdQuery,
  useUpdateContactStatusMutation,
  useDeleteContactInquiryMutation,
} = contactApi;
