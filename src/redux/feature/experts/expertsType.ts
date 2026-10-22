import type { ExpertItem, CreateExpertPayload } from '../../../components/adminComponents/experts/expertTypes';

export interface GetExpertsParams {
  search?: string;
  specialization?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetExpertsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: ExpertItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetExpertMetricsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    totalExperts: number;
    activeSupport: number;
    totalTickets: number;
    averageRating: number;
  };
}

export interface GetSingleExpertResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ExpertItem;
}

export interface UpdateExpertPayload {
  id: string;
  data: Partial<CreateExpertPayload>;
}

export interface UpdateExpertStatusPayload {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface DeleteExpertResponse {
  success: boolean;
  message: string;
}
