import { baseApi } from '../../baseApi/baseApi';
import type {
  GetArticlesParams,
  GetArticlesResponse,
  GetSingleArticleResponse,
  CreateArticlePayload,
  UpdateArticlePayload,
  UpdateArticleStatusPayload,
  DeleteArticleResponse,
} from './contentType';

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<GetArticlesResponse, GetArticlesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.set('search', params.search);
          if (params.category && params.category !== 'All' && params.category !== 'All Categories') {
            queryParams.set('category', params.category);
          }
          if (params.status && params.status !== 'All') {
            queryParams.set('status', params.status);
          }
          if (params.page) queryParams.set('page', String(params.page));
          if (params.limit) queryParams.set('limit', String(params.limit));
        }

        const queryString = queryParams.toString();
        return {
          url: `/content${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Content'],
    }),

    getArticleById: builder.query<GetSingleArticleResponse, string>({
      query: (id) => ({
        url: `/content/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Content', id }],
    }),

    createArticle: builder.mutation<GetSingleArticleResponse, CreateArticlePayload>({
      query: (payload) => ({
        url: '/content',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Content'],
    }),

    updateArticle: builder.mutation<GetSingleArticleResponse, UpdateArticlePayload>({
      query: ({ id, data }) => ({
        url: `/content/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Content', { type: 'Content', id }],
    }),

    updateArticleStatus: builder.mutation<GetSingleArticleResponse, UpdateArticleStatusPayload>({
      query: ({ id, status }) => ({
        url: `/content/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Content', { type: 'Content', id }],
    }),

    deleteArticle: builder.mutation<DeleteArticleResponse, string>({
      query: (id) => ({
        url: `/content/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Content'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useUpdateArticleStatusMutation,
  useDeleteArticleMutation,
} = contentApi;
