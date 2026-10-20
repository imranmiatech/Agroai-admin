import { baseApi } from '../../baseApi/baseApi';
import type {
  CardsResponse,
  SaveCardPayload,
  SingleCardResponse,
} from './settingsType';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedCards: builder.query<CardsResponse, void>({
      query: () => ({
        url: '/billing/cards',
        method: 'GET',
      }),
      providesTags: ['Billing'],
    }),

    saveCard: builder.mutation<SingleCardResponse, SaveCardPayload>({
      query: (body) => ({
        url: '/billing/cards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),

    setDefaultCard: builder.mutation<SingleCardResponse, string>({
      query: (cardId) => ({
        url: `/billing/cards/${cardId}/default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Billing'],
    }),

    deleteCard: builder.mutation<{ statusCode: number; message: string }, string>({
      query: (cardId) => ({
        url: `/billing/cards/${cardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSavedCardsQuery,
  useSaveCardMutation,
  useSetDefaultCardMutation,
  useDeleteCardMutation,
} = settingsApi;
