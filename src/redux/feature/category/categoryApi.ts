import { baseApi } from '../../baseApi/baseApi';
import type {
  GetCategoriesParams,
  GetCategoriesResponse,
  SingleCategoryResponse,
  CreateCategoryPayload,
  CategoryItem,
} from './categoryType';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResponse, GetCategoriesParams | void>({
      query: (params) => ({
        url: '/categories',
        method: 'GET',
        params: params && params.includeCount ? { includeCount: true } : undefined,
      }),
      providesTags: (result) => {
        const list: CategoryItem[] = Array.isArray(result?.data)
          ? result.data
          : (result?.data as { categories?: CategoryItem[] })?.categories || [];
        return [
          { type: 'Category' as const, id: 'LIST' },
          ...list.map(({ id }) => ({ type: 'Category' as const, id })),
        ];
      },
    }),

    getCategoryById: builder.query<SingleCategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: (_res, _err, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<SingleCategoryResponse, FormData | CreateCategoryPayload>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
