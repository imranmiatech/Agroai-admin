import { baseApi } from '../../baseApi/baseApi';
import type { PlatformMetricsResponse, RevenueGrowthResponse, VendorOverviewResponse } from './overviewType';

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformMetrics: builder.query<PlatformMetricsResponse, void>({
      query: () => '/admin/overview/platform-metrics',
      providesTags: ['User', 'Vendor', 'Consultation', 'Order'],
      transformResponse: (res: any) => res?.data || res,
    }),

    getRevenueAndGrowth: builder.query<RevenueGrowthResponse, '7D' | '30D' | '6M' | '12M' | void>({
      query: (timeframe = '30D') => `/admin/overview/revenue-growth?timeframe=${timeframe || '30D'}`,
      providesTags: ['User', 'Order', 'Billing'],
      transformResponse: (res: any) => res?.data || res,
    }),

    getVendorOverview: builder.query<VendorOverviewResponse, void>({
      query: () => '/vendor/overview',
      providesTags: ['Order', 'Product', 'Vendor'],
      transformResponse: (res: any) => res?.data || res,
    }),
  }),
});

export const {
  useGetPlatformMetricsQuery,
  useGetRevenueAndGrowthQuery,
  useGetVendorOverviewQuery,
} = overviewApi;
