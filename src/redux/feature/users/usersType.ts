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
