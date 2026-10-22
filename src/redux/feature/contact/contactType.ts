export type ContactStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface ContactInquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  replyMessage?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetContactInquiriesParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetContactInquiriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: ContactInquiryItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetContactMetricsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    totalInquiries: number;
    pendingCount: number;
    inProgressCount: number;
    resolvedCount: number;
  };
}

export interface UpdateContactStatusPayload {
  id: string;
  status: ContactStatus;
  replyMessage?: string;
}

export interface SingleContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ContactInquiryItem;
}

export interface DeleteContactResponse {
  success: boolean;
  message: string;
}
