import { baseApi } from '../../baseApi/baseApi';
import type {
  GetOrdersResponse,
  SingleOrderResponse,
  QueryOrderParams,
  UpdateOrderStatusPayload,
} from './ordersType';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<GetOrdersResponse, QueryOrderParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          if (params.search?.trim()) queryParams.search = params.search.trim();
          if (params.status && params.status !== 'All') queryParams.status = params.status;
          if (params.paymentStatus && params.paymentStatus !== 'All') queryParams.paymentStatus = params.paymentStatus;
          if (params.email?.trim()) queryParams.email = params.email.trim();
          if (params.phone?.trim()) queryParams.phone = params.phone.trim();
          if (params.vendorId?.trim()) queryParams.vendorId = params.vendorId.trim();
        }

        return {
          url: '/orders',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.orders
          ? [
              ...result.data.orders.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrderById: builder.query<SingleOrderResponse, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    updateOrderStatus: builder.mutation<SingleOrderResponse, UpdateOrderStatusPayload>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    deleteOrder: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  usePrefetch: useOrdersPrefetch,
} = ordersApi;
