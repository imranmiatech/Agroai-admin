import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authType';

const getInitialUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const getInitialToken = (): string | null => {
  try {
    return localStorage.getItem('token') || null;
  } catch {
    return null;
  }
};

const getInitialRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('refreshToken') || null;
  } catch {
    return null;
  }
};

const initialToken = getInitialToken();
const initialRefreshToken = getInitialRefreshToken();
const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialToken),
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;

      try {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.error('Failed to save auth state to localStorage', err);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      try {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } catch (err) {
        console.error('Failed to update user in localStorage', err);
      }
    },
    setToken: (state, action: PayloadAction<{ token: string; refreshToken?: string } | string>) => {
      const token = typeof action.payload === 'string' ? action.payload : action.payload.token;
      const refreshToken = typeof action.payload === 'object' ? action.payload.refreshToken : undefined;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;
      try {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      } catch (err) {
        console.error('Failed to save token to localStorage', err);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      try {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } catch (err) {
        console.error('Failed to remove auth state from localStorage', err);
      }
    },
  },
});

export const { setCredentials, setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
