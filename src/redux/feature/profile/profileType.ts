export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  logo?: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  openingHours?: string;
  contactPerson?: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  businessName?: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  openingHours?: string;
  contactPerson?: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  logo?: string | File;
}
