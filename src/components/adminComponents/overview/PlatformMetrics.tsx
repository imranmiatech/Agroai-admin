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

export const PlatformMetrics: React.FC = () => {
  const platformMetrics = [
    {
      id: 'total_users',
      value: '962',
      label: 'Total users',
      change: '+5.7%',
      isPositive: true,
      icon: <Users className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'active_users',
      value: '1,458',
      label: 'Active users',
      change: '+5.7%',
      isPositive: true,
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      iconBg: 'bg-rose-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'suspend_users',
      value: '397',
      label: 'Suspend users',
      change: '+5.7%',
      isPositive: true,
      icon: <UserCheck className="w-4 h-4 text-purple-600" />,
      iconBg: 'bg-purple-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'total_vendors',
      value: '244',
      label: 'Total vendors',
      change: '+5.7%',
      isPositive: true,
      icon: <CreditCard className="w-4 h-4 text-cyan-600" />,
      iconBg: 'bg-cyan-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'active_vendors',
      value: '37',
      label: 'Active vendors',
      change: '+5.7%',
      isPositive: true,
      icon: <Store className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-amber-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'suspend_vendors',
      value: '€21.2k',
      label: 'Suspend vendors',
      change: '+9.4%',
      isPositive: true,
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'tickets',
      value: '28',
      label: 'Support Tickets',
      change: '-31.7%',
      isPositive: false,
      icon: <Headphones className="w-4 h-4 text-orange-500" />,
      iconBg: 'bg-orange-50',
      waveColor: '#F97316'
    },
    {
      id: 'monthly_revenue',
      value: '2,678',
      label: 'Monthly revenue',
      change: '+5.7%',
      isPositive: true,
      icon: <DollarSign className="w-4 h-4 text-indigo-500" />,
      iconBg: 'bg-indigo-50',
      waveColor: '#14B8A6'
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
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${item.isPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
                {item.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
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
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 28">
                <defs>
                  <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.waveColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={item.waveColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {item.isPositive ? (
                  <>
                    <path 
                      d="M0,22 Q25,20 50,14 T100,6 L100,28 L0,28 Z" 
                      fill={`url(#grad-${item.id})`} 
                    />
                    <path 
                      d="M0,22 Q25,20 50,14 T100,6" 
                      fill="none" 
                      stroke={item.waveColor} 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                    />
                  </>
                ) : (
                  <>
                    <path 
                      d="M0,8 Q30,12 60,18 T100,24 L100,28 L0,28 Z" 
                      fill={`url(#grad-${item.id})`} 
                    />
                    <path 
                      d="M0,8 Q30,12 60,18 T100,24" 
                      fill="none" 
                      stroke={item.waveColor} 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
