export interface MetricItem {
  value: number | string;
  change: string;
  isPositive: boolean;
  direction?: 'up' | 'equal' | 'down';
}

export interface RecentActivityItem {
  id: string;
  dot: string;
  title: string;
  detail: string;
  time: string;
}

export interface PlatformMetricsResponse {
  totalUsers: MetricItem;
  activeUsers: MetricItem;
  suspendedUsers: MetricItem;
  totalVendors: MetricItem;
  activeVendors: MetricItem;
  suspendedVendors: MetricItem;
  supportTickets: MetricItem;
  monthlyRevenue: MetricItem;
  urgentTasks?: number;
  recentActivity?: RecentActivityItem[];
}

export interface RevenueMonthTrend {
  month: string;
  amount: number;
  label: string;
}

export interface UserGrowthPoint {
  label: string;
  count: number;
}

export interface RevenueGrowthResponse {
  revenue: {
    mrr: string;
    mrrValue: number;
    arr: string;
    arrValue: number;
    avgPlan: string;
    avgPlanValue: number;
    trend: RevenueMonthTrend[];
  };
  userGrowth: {
    timeframe: '7D' | '30D' | '6M' | '12M';
    timeline: UserGrowthPoint[];
  };
}

export interface VendorMetricItem {
  value: number;
  formattedValue: string;
  change: string;
  isPositive: boolean;
  currency?: string;
}

export interface VendorRevenueTrendPoint {
  month: string;
  amount: number;
}

export interface VendorRecentActivityItem {
  id: string;
  type: 'order' | 'catalog' | 'delivery' | 'updated' | 'low_stock';
  title: string;
  productName?: string;
  time: string;
  badge: string;
  badgeType: 'emerald' | 'slate' | 'teal' | 'amber' | 'rose';
}

export interface VendorOverviewResponse {
  vendor: {
    id: string;
    businessName: string;
    status: string;
  };
  metrics: {
    products: VendorMetricItem;
    totalSales: VendorMetricItem;
    totalOrders: VendorMetricItem;
  };
  revenueChart: {
    currencySymbol: string;
    maxAmount: number;
    trend: VendorRevenueTrendPoint[];
  };
  recentActivity: VendorRecentActivityItem[];
}
