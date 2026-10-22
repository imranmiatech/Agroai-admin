import { baseApi } from '../../baseApi/baseApi';
import type { 
  ConsultationTicket, 
  ConsultationStatus,
  SendMessageDto 
} from './consultationsType';

export const consultationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsultations: builder.query<ConsultationTicket[], void>({
      query: () => '/consultations',
      providesTags: ['Consultation'],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
    }),

    getConsultationById: builder.query<ConsultationTicket, string>({
      query: (id) => `/consultations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Consultation', id }],
      transformResponse: (response: any) => {
        return response?.data || response;
      },
    }),

    sendConsultationMessage: builder.mutation<
      ConsultationTicket,
      SendMessageDto
    >({
      query: ({ ticketId, ...messageData }) => ({
        url: `/consultations/${ticketId}/messages`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['Consultation'],
    }),

    updateConsultationStatus: builder.mutation<
      ConsultationTicket,
      { ticketId: string; status: ConsultationStatus }
    >({
      query: ({ ticketId, status }) => ({
        url: `/consultations/${ticketId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Consultation'],
    }),
  }),
});

export const {
  useGetConsultationsQuery,
  useGetConsultationByIdQuery,
  useSendConsultationMessageMutation,
  useUpdateConsultationStatusMutation,
} = consultationsApi;
