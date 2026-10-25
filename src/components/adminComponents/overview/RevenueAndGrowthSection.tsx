import React, { useState } from 'react';
import { useGetRevenueAndGrowthQuery } from '../../../redux';

function createSpline(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return 'M 0,60 L 100,60';
  if (points.length === 1) return `M 0,${points[0].y.toFixed(1)} L 100,${points[0].y.toFixed(1)}`;
  
  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 3;
    const cp1y = curr.y;
    const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
    const cp2y = next.y;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
  }
  return d;
}

export const RevenueAndGrowthSection: React.FC = () => {
  const [userGrowthTimeframe, setUserGrowthTimeframe] = useState<'7D' | '30D' | '6M' | '12M'>('30D');

  const { data } = useGetRevenueAndGrowthQuery(userGrowthTimeframe, {
    pollingInterval: 15000,
  });

  const revenue = data?.revenue;
  const userGrowth = data?.userGrowth;

  const trendData = revenue?.trend || [];
  const months = trendData.length > 0 
    ? trendData.map((t) => t.month) 
    : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  // 1. Dynamic Revenue Spline & Y-Axis
  const maxRevenueAmount = Math.max(...trendData.map((t) => t.amount), 100);
  const revenuePoints = trendData.map((t, idx) => {
    const x = trendData.length > 1 ? (idx / (trendData.length - 1)) * 100 : 50;
    // Map amount: 0 -> y=78, max -> y=20
    const y = 78 - (t.amount / (maxRevenueAmount || 1)) * 58;
    return { x, y };
  });

  const revenueSpline = revenuePoints.length > 0
    ? createSpline(revenuePoints)
    : 'M0,78 C33,75 66,50 100,20';

  const formatRevenueY = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(1)}k`;
    return `€${Math.round(val)}`;
  };

  const revenueYAxis = [
    formatRevenueY(maxRevenueAmount),
    formatRevenueY(maxRevenueAmount * 0.75),
    formatRevenueY(maxRevenueAmount * 0.5),
    formatRevenueY(maxRevenueAmount * 0.25),
    '€0',
  ];

  // 2. Dynamic User Growth Spline & Y-Axis
  const timelineData = userGrowth?.timeline || [];
  const maxUserCount = Math.max(...timelineData.map((p) => p.count), 4);
  // Scale ceiling to a clean multiple of 4
  const userCeiling = Math.ceil(maxUserCount / 4) * 4;

  const userPoints = timelineData.map((p, idx) => {
    const x = timelineData.length > 1 ? (idx / (timelineData.length - 1)) * 100 : 50;
    // Map count: 0 -> y=76, userCeiling -> y=24
    const y = 76 - (p.count / (userCeiling || 1)) * 52;
    return { x, y };
  });

  const userGrowthSpline = userPoints.length > 0
    ? createSpline(userPoints)
    : 'M0,76 C33,70 66,45 100,24';

  const userYAxis = [
    userCeiling,
    Math.round(userCeiling * 0.75),
    Math.round(userCeiling * 0.5),
    Math.round(userCeiling * 0.25),
    0,
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue & Membership Area Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-tight mb-5">
            Revenue
          </h3>

          {/* Area Chart with Labels */}
          <div className="relative w-full h-44 my-2">
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[11px] text-slate-400">
              {revenueYAxis.map((label, idx) => (
                <span key={idx}>{label}</span>
              ))}
            </div>

            <div className="ml-10 h-36 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0E4F5A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0E4F5A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {/* Subtle Grid Lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Gradient Fill */}
                <path 
                  d={`${revenueSpline} L 100,100 L 0,100 Z`} 
                  fill="url(#revenue-area)" 
                />
                {/* Spline Line */}
                <path 
                  d={revenueSpline} 
                  fill="none" 
                  stroke="#0E4F5A" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>

              {/* X-axis months */}
              <div className="flex justify-between text-[11px] text-slate-400 pt-2">
                {months.map((m, idx) => (
                  <span key={idx}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom KPI Summaries */}
       
      </div>

      {/* User Growth Line Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              User Growth
            </h3>

            {/* Timeframe Filter Pills */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
              {(['7D', '30D', '6M', '12M'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setUserGrowthTimeframe(period)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    userGrowthTimeframe === period 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="relative w-full h-44 my-2">
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[11px] text-slate-400">
              {userYAxis.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))}
            </div>

            <div className="ml-10 h-36 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line x1="0" y1="0" x2="100" y2="0" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Growth Line in Orange */}
                <path 
                  d={userGrowthSpline} 
                  fill="none" 
                  stroke="#F97316" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                />
              </svg>

              {/* X-axis dates */}
              <div className="flex justify-between text-[10px] text-slate-400 pt-2">
                {timelineData.map((item, idx) => (
                  <span key={idx}>{item.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

