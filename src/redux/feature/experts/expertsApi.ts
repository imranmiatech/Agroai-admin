import { baseApi } from '../../baseApi/baseApi';
import type { CreateExpertPayload } from '../../../components/adminComponents/experts/expertTypes';
import type {
  GetExpertsParams,
  GetExpertsResponse,
  GetExpertMetricsResponse,
  GetSingleExpertResponse,
  UpdateExpertPayload,
  UpdateExpertStatusPayload,
  DeleteExpertResponse,
} from './expertsType';

export const expertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperts: builder.query<GetExpertsResponse, GetExpertsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.set('search', params.search);
          if (params.specialization && params.specialization !== 'All') {
            queryParams.set('specialization', params.specialization);
          }
          if (params.status && params.status !== 'All') {
            queryParams.set('status', params.status);
          }
          if (params.page) queryParams.set('page', String(params.page));
          if (params.limit) queryParams.set('limit', String(params.limit));
        }

        const queryString = queryParams.toString();
        return {
          url: `/experts${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Expert'],
    }),

    getExpertMetrics: builder.query<GetExpertMetricsResponse, void>({
      query: () => ({
        url: '/experts/metrics',
        method: 'GET',
      }),
      providesTags: ['Expert'],
    }),

    getExpertById: builder.query<GetSingleExpertResponse, string>({
      query: (id) => ({
        url: `/experts/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Expert', id }],
    }),

    createExpert: builder.mutation<GetSingleExpertResponse, CreateExpertPayload>({
      query: (payload) => ({
        url: '/experts',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Expert'],
    }),

    updateExpert: builder.mutation<GetSingleExpertResponse, UpdateExpertPayload>({
      query: ({ id, data }) => ({
        url: `/experts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Expert', { type: 'Expert', id }],
    }),

    updateExpertStatus: builder.mutation<GetSingleExpertResponse, UpdateExpertStatusPayload>({
      query: ({ id, status }) => ({
        url: `/experts/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Expert', { type: 'Expert', id }],
    }),

    getExpertOverviewMetrics: builder.query<{
      totalConsultations: number;
      waitingConsultations: number;
      resolvedConsultations: number;
      totalSoilTests: number;
      pendingSoilTests: number;
      completedSoilTests: number;
    }, void>({
      query: () => '/expert/overview/metrics',
      transformResponse: (res: any) => res?.data || res,
      providesTags: ['Expert', 'Consultation', 'SoilTest'],
    }),

    getExpertRecentConsultations: builder.query<any[], void>({
      query: () => '/expert/overview/recent-consultations',
      transformResponse: (res: any) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []),
      providesTags: ['Consultation'],
    }),

    getExpertRecentSoilTests: builder.query<any[], void>({
      query: () => '/expert/overview/recent-soil-tests',
      transformResponse: (res: any) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []),
      providesTags: ['SoilTest'],
    }),

    deleteExpert: builder.mutation<DeleteExpertResponse, string>({
      query: (id) => ({
        url: `/experts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expert'],
    }),
  }),
});

export const {
  useGetExpertsQuery,
  useGetExpertMetricsQuery,
  useGetExpertByIdQuery,
  useCreateExpertMutation,
  useUpdateExpertMutation,
  useUpdateExpertStatusMutation,
  useDeleteExpertMutation,
  useGetExpertOverviewMetricsQuery,
  useGetExpertRecentConsultationsQuery,
  useGetExpertRecentSoilTestsQuery,
} = expertsApi;
