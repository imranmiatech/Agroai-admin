export interface VendorProfile {
  id: string;
  userId?: string;
  businessName: string;
  slug?: string;
  logo?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
  category?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  openingHours?: string | null;
  contactPerson?: string | null;
  contactRole?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  avatar?: string | null;
  vendorProfile?: VendorProfile | null;
}

export interface UserProfileResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: UserProfileData;
}

export interface UpdateProfilePayload {
  name?: string;
  businessName?: string;
  shortDescription?: string;
  description?: string;
  businessPhone?: string;
  category?: string;
  country?: string;
  city?: string;
  address?: string;
  openingHours?: string;
  contactPerson?: string;
  contactRole?: string;
  contactPhone?: string;
  logo?: string | File;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    success?: boolean;
    message?: string;
  };
}
