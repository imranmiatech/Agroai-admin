import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { AuthState } from '../feature/auth/authType';
import { logout } from '../feature/auth/authSlice';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as { auth?: AuthState })?.auth?.token ||
      localStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = typeof args === 'string' ? args : (args.url || '');
    // Do not automatically log out if 401 is returned from change-password (wrong current password) or login
    if (!url.includes('/change-password') && !url.includes('/login')) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth', 'Profile', 'Order', 'Product', 'Vendor', 'Billing', 'Content', 'Expert', 'Contact', 'Consultation', 'SoilTest'],
  endpoints: () => ({}),
});
