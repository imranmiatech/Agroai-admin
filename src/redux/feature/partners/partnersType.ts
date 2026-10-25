export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface PartnerDivisionItem {
  name: string;
  count: number;
  color: string;
  percentage?: number;
  percentWidth?: number;
}

export type PartnerCategoryItem = PartnerDivisionItem;

export interface MetricTrend {
  change: string;
  percentage: number;
  isPositive: boolean;
  timeframe: string;
}

export interface PartnerMetricCard {
  id: string;
  title: string;
  label: string;
  value: number;
  formattedValue: string;
  change: string;
  changePercentage: number;
  isPositive: boolean;
  accentColor: string;
  icon: string;
}

export interface PartnerMetricsData {
  totalPartners: number;
  approvedPartners: number;
  activeOffers?: number;
  partnersTrend: MetricTrend;
  approvedTrend: MetricTrend;
  cards: PartnerMetricCard[];
}

export interface PartnerMetricsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PartnerMetricsData;
}

export interface PartnerDivisionsData {
  title: string;
  totalPartners: number;
  divisions: PartnerDivisionItem[];
  countsByDivision: Record<string, number>;
}

export interface PartnerDivisionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PartnerDivisionsData;
}

export interface AttentionRequiredAction {
  label: string;
  targetTab: string;
  link: string;
}

export interface PartnershipRequest {
  id: string;
  businessName: string;
  description: string;
  location: string;
  category?: string;
  ownerName: string;
  email: string;
  phone: string;
  status: RequestStatus;
  submittedDate: string;
  createdAt?: string;
}

export interface PartnerAttentionRequiredData {
  title: string;
  hasAttentionRequired: boolean;
  pendingRequestsCount: number;
  message: string;
  alertType: string;
  severity: string;
  action: AttentionRequiredAction;
  recentRequests: PartnershipRequest[];
}

export interface PartnerAttentionRequiredResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PartnerAttentionRequiredData;
}

export interface GetPartnershipRequestsParams {
  search?: string;
  location?: string;
  status?: RequestStatus | string;
  page?: number;
  limit?: number;
}

export interface PartnershipRequestsData {
  items: PartnershipRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PartnershipRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PartnershipRequestsData;
}

export interface UpdatePartnerStatusPayload {
  id: string;
  status: RequestStatus;
  reason?: string;
}

export interface UpdatePartnerStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PartnershipRequest;
}
