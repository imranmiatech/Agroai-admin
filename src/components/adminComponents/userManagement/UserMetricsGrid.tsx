import React from 'react';
import { 
  Users, 
  Activity, 
  UserPlus, 
  Clock, 
  Ban, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

export const UserMetricsGrid: React.FC = () => {
  const userMetrics = [
    {
      id: 'total-users',
      value: '1,372',
      label: 'Total Users',
      change: '+1.85%',
      isPositive: true,
      icon: <Users className="w-4 h-4 text-slate-700" />,
      iconBg: 'bg-slate-100',
      waveColor: '#14B8A6'
    },
    {
      id: 'active-today',
      value: '394',
      label: 'Active Today',
      change: '+3.4%',
      isPositive: true,
      icon: <Activity className="w-4 h-4 text-teal-600" />,
      iconBg: 'bg-teal-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'new-this-week',
      value: '47',
      label: 'New This Week',
      change: '+7.3%',
      isPositive: true,
      icon: <UserPlus className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'new-this-month',
      value: '178',
      label: 'New This Month',
      change: '+5.9%',
      isPositive: true,
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      iconBg: 'bg-indigo-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'suspended',
      value: '16',
      label: 'Suspended Users',
      change: '-12.5%',
      isPositive: false,
      icon: <Ban className="w-4 h-4 text-rose-500" />,
      iconBg: 'bg-rose-50',
      waveColor: '#F43F5E'
    }
  ];

  return (
    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {userMetrics.map((card) => (
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
      ))}
    </div>
  );
};
