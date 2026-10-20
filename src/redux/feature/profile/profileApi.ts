import { baseApi } from '../../baseApi/baseApi';
import type {
  UpdateProfilePayload,
  UserProfileResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from './profileType';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Profile', 'User'],
    }),

    updateProfile: builder.mutation<
      UserProfileResponse,
      UpdateProfilePayload | FormData
    >({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordPayload
    >({
      query: (body) => ({
        url: '/profile/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
