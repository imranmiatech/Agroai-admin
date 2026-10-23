import { baseApi } from '../../baseApi/baseApi';
import type { 
  SoilTestRequest, 
  SoilTestStatus, 
  PublishReportDto 
} from './soilTestsType';

export const soilTestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSoilTests: builder.query<SoilTestRequest[], void>({
      query: () => '/soil-tests',
      providesTags: ['SoilTest'],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
    }),

    getSoilTestById: builder.query<SoilTestRequest, string>({
      query: (id) => `/soil-tests/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SoilTest', id }],
      transformResponse: (response: any) => {
        return response?.data || response;
      },
    }),

    updateSoilTestStatus: builder.mutation<
      SoilTestRequest,
      { id: string; status: SoilTestStatus }
    >({
      query: ({ id, status }) => ({
        url: `/soil-tests/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['SoilTest'],
    }),

    publishSoilReport: builder.mutation<
      SoilTestRequest,
      PublishReportDto
    >({
      query: ({ id, ...reportData }) => ({
        url: `/soil-tests/${id}/publish-report`,
        method: 'POST',
        body: reportData,
      }),
      invalidatesTags: ['SoilTest'],
    }),

    deleteSoilTest: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/soil-tests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SoilTest'],
    }),
  }),
});

export const {
  useGetSoilTestsQuery,
  useGetSoilTestByIdQuery,
  useUpdateSoilTestStatusMutation,
  usePublishSoilReportMutation,
  useDeleteSoilTestMutation,
} = soilTestsApi;
