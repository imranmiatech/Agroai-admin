import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  CalendarClock, 
  Star, 
  ArrowUpRight 
} from 'lucide-react';

interface ExpertMetricCardsProps {
  pendingCount?: number;
  urgentCount?: number;
  resolvedCount?: number;
  upcomingCallsCount?: number;
  rating?: number;
}

export const ExpertMetricCards: React.FC<ExpertMetricCardsProps> = ({
  pendingCount = 3,
  urgentCount = 1,
  resolvedCount = 186,
  upcomingCallsCount = 3,
  rating = 4.95,
}) => {
  const metrics = [
    {
      label: 'Pending Farmer Inquiries',
      value: pendingCount.toString(),
      subtext: `${urgentCount} marked High / Urgent`,
      badge: 'Immediate Action',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-100/80',
    },
    {
      label: 'Consultations Resolved',
      value: resolvedCount.toString(),
      subtext: '+24 this week',
      badge: '+14% MoM',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100/80',
    },
    {
      label: 'Upcoming Consultations',
      value: upcomingCallsCount.toString(),
      subtext: 'Next at 03:30 PM (Video)',
      badge: 'Today',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: <CalendarClock className="w-5 h-5 text-sky-600" />,
      iconBg: 'bg-sky-100/80',
    },
    {
      label: 'Farmer Satisfaction Rating',
      value: `${rating} / 5.0`,
      subtext: 'Based on 218 farmer reviews',
      badge: '98% Positive',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Star className="w-5 h-5 text-amber-500 fill-amber-400" />,
      iconBg: 'bg-amber-100/80',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {metrics.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 group"
        >
          {/* Top Row: Icon + Badge */}
          <div className="flex items-center justify-between">
            <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
              {card.icon}
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>

          {/* Metric Value & Label */}
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight block">
              {card.value}
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              {card.label}
            </p>
          </div>

          {/* Subtext */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate">{card.subtext}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0E4F5A] transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
};
