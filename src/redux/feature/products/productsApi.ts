import { baseApi } from '../../baseApi/baseApi';
import type {
  CreateProductPayload,
  GetProductsResponse,
  QueryProductParams,
  SingleProductResponse,
  UpdateProductStatusPayload,
} from './productsType';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, QueryProductParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          if (params.search?.trim()) queryParams.search = params.search.trim();
          if (params.category && params.category !== 'All') queryParams.category = params.category;
          if (params.status && params.status !== 'All') queryParams.status = params.status;
          if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
          if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
          if (params.vendorId) queryParams.vendorId = params.vendorId;
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        }

        return {
          url: '/products',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query<SingleProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<
      SingleProductResponse,
      FormData | CreateProductPayload
    >({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<
      SingleProductResponse,
      { id: string; data: FormData | Partial<CreateProductPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    updateProductStatus: builder.mutation<
      SingleProductResponse,
      UpdateProductStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/products/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<
      { statusCode?: number; message?: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
  usePrefetch: useProductsPrefetch,
} = productsApi;
