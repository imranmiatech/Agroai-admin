import { baseApi } from '../../baseApi/baseApi';
import type {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginPayload,
  OtpVerificationPayload,
  RegisterPayload,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendOtpRequest,
  SendOtpResponse,
  User,
  VendorRegisterResponse,
  VerifyForgotOtpRequest,
  VerifyForgotOtpResponse,
  VerifyOtpResponse,
} from './authType';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    registerCustomer: builder.mutation<AuthResponse, { name: string; email: string; password: string }>({
      query: (data) => ({
        url: '/auth/customer/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    sendOtp: builder.mutation<{ success: boolean; data: SendOtpResponse; message: string }, SendOtpRequest>({
      query: (body) => ({
        url: '/auth/vendor/send-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<{ success: boolean; data: VerifyOtpResponse; message: string }, OtpVerificationPayload>({
      query: (payload) => ({
        url: '/auth/vendor/verify-otp',
        method: 'POST',
        body: payload,
      }),
    }),

    resendOtp: builder.mutation<{ success: boolean; data: SendOtpResponse; message: string }, SendOtpRequest>({
      query: (body) => ({
        url: '/auth/vendor/send-otp',
        method: 'POST',
        body,
      }),
    }),

    registerVendor: builder.mutation<{ success: boolean; data: VendorRegisterResponse; message: string }, FormData | RegisterPayload>({
      query: (data) => ({
        url: '/auth/vendor/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshTokens: builder.mutation<{ success: boolean; data: { accessToken: string; refreshToken: string }; message: string }, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body,
      }),
    }),

    forgotPassword: builder.mutation<{ success: boolean; data: ForgotPasswordResponse; message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    verifyForgotOtp: builder.mutation<{ success: boolean; data: VerifyForgotOtpResponse; message: string }, VerifyForgotOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-forgot-otp',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<{ success: boolean; data: ResetPasswordResponse; message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<{ success: boolean; data: User }, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    logoutUser: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterCustomerMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useRegisterVendorMutation,
  useRefreshTokensMutation,
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutUserMutation,
} = authApi;

export const useRegisterMutation = authApi.useRegisterVendorMutation;
