import { baseApi } from '../../baseApi/baseApi';
import type { UpdateProfilePayload, VendorProfile } from './profileType';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<{ success: boolean; data: VendorProfile }, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<
      { success: boolean; data: VendorProfile },
      UpdateProfilePayload | FormData
    >({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
