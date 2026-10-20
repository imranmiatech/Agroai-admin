import React, { memo } from 'react';
import { 
  Users, 
  Activity, 
  UserPlus, 
  Clock, 
  Ban, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { useGetUserMetricsQuery } from '../../../redux/feature/users/usersApi';

export const UserMetricsGrid: React.FC = memo(() => {
  const { data: metricsResponse, isLoading } = useGetUserMetricsQuery(undefined, {
    // Keep cached metrics fresh without re-fetching on every tiny tab blur
    pollingInterval: 0,
  });

  const metricsData = metricsResponse?.data;

  const defaultMetrics = [
    {
      id: 'total-users',
      value: metricsData?.totalUsers !== undefined ? String(metricsData.totalUsers) : '0',
      label: 'Total Users',
      change: '0%',
      isPositive: true,
      icon: <Users className="w-4 h-4 text-slate-700" />,
      iconBg: 'bg-slate-100',
      waveColor: '#14B8A6'
    },
    {
      id: 'active-today',
      value: metricsData?.activeToday !== undefined ? String(metricsData.activeToday) : '0',
      label: 'Active Today',
      change: '0%',
      isPositive: true,
      icon: <Activity className="w-4 h-4 text-teal-600" />,
      iconBg: 'bg-teal-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'new-this-week',
      value: metricsData?.newThisWeek !== undefined ? String(metricsData.newThisWeek) : '0',
      label: 'New This Week',
      change: '0%',
      isPositive: true,
      icon: <UserPlus className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'new-this-month',
      value: metricsData?.newThisMonth !== undefined ? String(metricsData.newThisMonth) : '0',
      label: 'New This Month',
      change: '0%',
      isPositive: true,
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      iconBg: 'bg-indigo-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'suspended',
      value: metricsData?.suspendedUsers !== undefined ? String(metricsData.suspendedUsers) : '0',
      label: 'Suspended Users',
      change: '0%',
      isPositive: false,
      icon: <Ban className="w-4 h-4 text-rose-500" />,
      iconBg: 'bg-rose-50',
      waveColor: '#F43F5E'
    }
  ];

  // Map backend card data dynamically if available
  const userMetrics = defaultMetrics.map((defaultCard) => {
    const liveCard = metricsData?.cards?.find((c) => c.id === defaultCard.id);
    if (!liveCard) return defaultCard;

    return {
      ...defaultCard,
      value: liveCard.value ?? defaultCard.value,
      change: liveCard.change ?? defaultCard.change,
      isPositive: liveCard.isPositive ?? defaultCard.isPositive,
      waveColor: liveCard.waveColor ?? defaultCard.waveColor,
    };
  });

  return (
    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {isLoading && !metricsData ? (
        Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs animate-pulse flex flex-col justify-between h-[116px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-slate-200" />
              <div className="w-10 h-3 bg-slate-200 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-16 h-5 bg-slate-200 rounded" />
              <div className="w-20 h-2.5 bg-slate-100 rounded" />
            </div>
            <div className="w-full h-2 bg-slate-100 rounded" />
          </div>
        ))
      ) : (
        userMetrics.map((card) => (
          <div 
            key={card.id}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden min-w-0 min-[380px]:max-sm:last:col-span-2"
          >
            {/* Icon & Trend */}
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${card.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{card.change}</span>
              </div>
            </div>

            {/* Metric Value & Label */}
            <div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                {card.label}
              </div>
            </div>

            {/* Sparkline curve */}
            <div className="w-full h-5 mt-2 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <defs>
                  <linearGradient id={`spark-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.waveColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={card.waveColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <path 
                  d={card.isPositive ? "M0,16 Q30,14 60,8 T100,2 L100,20 L0,20 Z" : "M0,4 Q30,8 60,14 T100,18 L100,20 L0,20 Z"} 
                  fill={`url(#spark-${card.id})`} 
                />
                <path 
                  d={card.isPositive ? "M0,16 Q30,14 60,8 T100,2" : "M0,4 Q30,8 60,14 T100,18"} 
                  fill="none" 
                  stroke={card.waveColor} 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>
        ))
      )}
    </div>
  );
});

UserMetricsGrid.displayName = 'UserMetricsGrid';

export default UserMetricsGrid;
