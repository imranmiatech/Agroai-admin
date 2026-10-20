export interface MetricCard {
  id: string;
  value: string;
  label: string;
  change: string;
  isPositive: boolean;
  waveColor: string;
}

export interface UserMetricsData {
  totalUsers: number;
  activeToday: number;
  newThisWeek: number;
  newThisMonth: number;
  suspendedUsers: number;
  cards: MetricCard[];
  byRole: {
    customer: number;
    vendor: number;
    admin: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
  byVerification: {
    verified: number;
    unverified: number;
  };
}

export interface UserMetricsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserMetricsData;
}

export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserVendorProfile {
  id: string;
  businessName: string;
  logo?: string | null;
  category?: string | null;
  businessPhone?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  status: UserStatus | string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  vendorProfile?: UserVendorProfile | null;
  phone?: string | null;
  joinedDate?: string;
  lastLogin?: string;
  avatar?: string | null;
  avatarBg?: string;
}

export interface UsersPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersListData {
  users: UserItem[];
  meta: UsersPaginationMeta;
}

export interface GetUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UsersListData;
  timestamp?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UpdateUserStatusPayload {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | string;
}

export interface UpdateUserStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    updatedAt: string;
  };
  timestamp?: string;
}

