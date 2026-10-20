export interface VendorProfileSummary {
  id: string;
  businessName: string;
  slug?: string;
  logo?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isEmailVerified?: boolean;
  avatar?: string | null;
  vendorProfile?: VendorProfileSummary;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export type LoginRequest = LoginPayload;

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    user?: User;
    [key: string]: any;
  };
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}
export type LoginResponse = AuthResponse;

export interface OtpVerificationPayload {
  email: string;
  otpCode: string;
}
export type VerifyOtpRequest = OtpVerificationPayload;

export interface RegisterPayload {
  businessName: string;
  shortDescription?: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  category?: string;
  logo?: any;
  country: string;
  city: string;
  address?: string;
  openingHours?: string;
  contactPerson: string;
  contactRole?: string;
  contactEmail: string;
  contactPhone: string;
}
export type VendorRegisterPayload = RegisterPayload;

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  email: string;
  expiresInSeconds: number;
  debugOtp?: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
}

export interface VendorRegisterResponse {
  message: string;
  vendorId: string;
  businessName: string;
  status: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
  expiresInSeconds: number;
  debugOtp?: string;
}

export interface VerifyForgotOtpRequest {
  email: string;
  otpCode: string;
}

export interface VerifyForgotOtpResponse {
  verified: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
