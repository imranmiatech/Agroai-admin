import React from 'react';
import { 
  Users, 
  Heart, 
  UserCheck, 
  CreditCard, 
  Store, 
  DollarSign, 
  Headphones, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { useGetPlatformMetricsQuery } from '../../../redux';

export const PlatformMetrics: React.FC = () => {
  const { data: metrics } = useGetPlatformMetricsQuery(undefined, {
    pollingInterval: 10000,
  });

  const platformMetrics = [
    {
      id: 'total_users',
      value: metrics?.totalUsers?.value !== undefined 
        ? Number(metrics.totalUsers.value).toLocaleString() 
        : '0',
      label: 'Total users',
      change: metrics?.totalUsers?.change || '+0.0%',
      isPositive: metrics?.totalUsers?.isPositive ?? true,
      direction: metrics?.totalUsers?.direction || 'up',
      icon: <Users className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
    },
    {
      id: 'active_users',
      value: metrics?.activeUsers?.value !== undefined 
        ? Number(metrics.activeUsers.value).toLocaleString() 
        : '0',
      label: 'Active users',
      change: metrics?.activeUsers?.change || '+0.0%',
      isPositive: metrics?.activeUsers?.isPositive ?? true,
      direction: metrics?.activeUsers?.direction || 'up',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      iconBg: 'bg-rose-50',
    },
    {
      id: 'suspend_users',
      value: metrics?.suspendedUsers?.value !== undefined 
        ? Number(metrics.suspendedUsers.value).toLocaleString() 
        : '0',
      label: 'Suspend users',
      change: metrics?.suspendedUsers?.change || '+0.0%',
      isPositive: metrics?.suspendedUsers?.isPositive ?? true,
      direction: metrics?.suspendedUsers?.direction || 'up',
      icon: <UserCheck className="w-4 h-4 text-purple-600" />,
      iconBg: 'bg-purple-50',
    },
    {
      id: 'total_vendors',
      value: metrics?.totalVendors?.value !== undefined 
        ? Number(metrics.totalVendors.value).toLocaleString() 
        : '0',
      label: 'Total vendors',
      change: metrics?.totalVendors?.change || '+0.0%',
      isPositive: metrics?.totalVendors?.isPositive ?? true,
      direction: metrics?.totalVendors?.direction || 'up',
      icon: <CreditCard className="w-4 h-4 text-cyan-600" />,
      iconBg: 'bg-cyan-50',
    },
    {
      id: 'active_vendors',
      value: metrics?.activeVendors?.value !== undefined 
        ? Number(metrics.activeVendors.value).toLocaleString() 
        : '0',
      label: 'Active vendors',
      change: metrics?.activeVendors?.change || '+0.0%',
      isPositive: metrics?.activeVendors?.isPositive ?? true,
      direction: metrics?.activeVendors?.direction || 'equal',
      icon: <Store className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-amber-50',
    },
    {
      id: 'suspend_vendors',
      value: metrics?.suspendedVendors?.value !== undefined 
        ? Number(metrics.suspendedVendors.value).toLocaleString() 
        : '0',
      label: 'Suspend vendors',
      change: metrics?.suspendedVendors?.change || '+0.0%',
      isPositive: metrics?.suspendedVendors?.isPositive ?? true,
      direction: metrics?.suspendedVendors?.direction || 'up',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'tickets',
      value: metrics?.supportTickets?.value !== undefined 
        ? Number(metrics.supportTickets.value).toLocaleString() 
        : '0',
      label: 'Support Tickets',
      change: metrics?.supportTickets?.change || '+0.0%',
      isPositive: metrics?.supportTickets?.isPositive ?? true,
      direction: metrics?.supportTickets?.direction || 'up',
      icon: <Headphones className="w-4 h-4 text-orange-500" />,
      iconBg: 'bg-orange-50',
    },
    {
      id: 'monthly_revenue',
      value: metrics?.monthlyRevenue?.value !== undefined 
        ? Number(metrics.monthlyRevenue.value).toLocaleString() 
        : '0',
      label: 'Monthly revenue',
      change: metrics?.monthlyRevenue?.change || '+0.0%',
      isPositive: metrics?.monthlyRevenue?.isPositive ?? true,
      direction: metrics?.monthlyRevenue?.direction || 'up',
      icon: <DollarSign className="w-4 h-4 text-indigo-500" />,
      iconBg: 'bg-indigo-50',
    }
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
        Platform Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformMetrics.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Card Top: Icon & Trend */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${item.direction === 'down' ? 'text-orange-600' : 'text-emerald-600'}`}>
                {item.direction === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                <span>{item.change}</span>
              </div>
            </div>

            {/* Metric Value & Label */}
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {item.value}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">
                {item.label}
              </div>
            </div>

            {/* Sparkline Wave Chart */}
            <div className="w-full h-8 mt-3 relative">
              {(() => {
                const direction = item.direction;
                const strokeColor = direction === 'down' ? '#F97316' : '#14B8A6';

                let wavePath = "M0,22 Q25,20 50,14 T100,6";
                let areaPath = "M0,22 Q25,20 50,14 T100,6 L100,28 L0,28 Z";

                if (direction === 'equal') {
                  wavePath = "M0,16 Q25,14 50,16 T100,16";
                  areaPath = "M0,16 Q25,14 50,16 T100,16 L100,28 L0,28 Z";
                } else if (direction === 'down') {
                  wavePath = "M0,8 Q30,12 60,18 T100,24";
                  areaPath = "M0,8 Q30,12 60,18 T100,24 L100,28 L0,28 Z";
                }

                return (
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 28">
                    <defs>
                      <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill={`url(#grad-${item.id})`} />
                    <path d={wavePath} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
