import React from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Headphones, 
  Star 
} from 'lucide-react';
import type { ExpertItem } from './expertTypes';

interface ExpertMetricsGridProps {
  experts: ExpertItem[];
  metrics?: {
    totalExperts?: number;
    activeSupport?: number;
    totalTickets?: number;
    averageRating?: number;
  };
}

export const ExpertMetricsGrid: React.FC<ExpertMetricsGridProps> = ({ experts, metrics }) => {
  const total = metrics?.totalExperts ?? experts.length;
  const activeCount = experts.filter((e) => e.status?.toUpperCase() === 'ACTIVE').length;
  const availableForSupport = metrics?.activeSupport ?? experts.filter(
    (e) => e.status?.toUpperCase() === 'ACTIVE' && e.isAvailableForSupport !== false
  ).length;

  const totalAssignedTickets = metrics?.totalTickets ?? experts.reduce(
    (acc, curr) => acc + (Number(curr.assignedTicketsCount) || 0),
    0
  );

  const ratedExperts = experts.filter((e) => typeof e.rating === 'number' && e.rating > 0);
  const calculatedAvg = ratedExperts.length > 0
    ? (ratedExperts.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedExperts.length)
    : 0;

  const averageRating = metrics?.averageRating !== undefined && metrics.averageRating > 0 
    ? metrics.averageRating 
    : calculatedAvg;

  const ratingDisplay = averageRating > 0 ? `${averageRating.toFixed(1)} / 5.0` : '0.0 / 5.0';
  const ratingSubtext = averageRating > 0
    ? `Average rating across ${ratedExperts.length > 0 ? ratedExperts.length : 'all'} experts`
    : 'No farmer reviews recorded yet';

  const cards = [
    {
      label: 'Total Agri Experts',
      value: total,
      subtext: `${activeCount} active in system`,
      icon: <GraduationCap className="w-5 h-5 text-[#062E35]" />,
      bg: 'bg-[#E2ECEE]',
      border: 'border-slate-200/80',
    },
    {
      label: 'Active on Live Support',
      value: availableForSupport,
      subtext: `${availableForSupport} ready to assist farmers`,
      icon: <Headphones className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Support Tickets Handled',
      value: totalAssignedTickets,
      subtext: `${totalAssignedTickets} resolved inquiries`,
      icon: <CheckCircle2 className="w-5 h-5 text-sky-700" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
    {
      label: 'Farmer Satisfaction',
      value: ratingDisplay,
      subtext: ratingSubtext,
      icon: <Star className="w-5 h-5 text-amber-600 fill-amber-400" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-2xl p-5 border ${card.border} shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {card.value}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {card.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
