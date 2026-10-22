import React from 'react';
import { TrendingUp, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import {
  useGetPartnerMetricsQuery,
  useGetPartnerDivisionsQuery,
  useGetPartnerAttentionRequiredQuery,
} from '../../../redux';

interface PartnersOverviewViewProps {
  onNavigateToRequests: () => void;
}

export const PartnersOverviewView: React.FC<PartnersOverviewViewProps> = ({
  onNavigateToRequests,
}) => {
  const { data: metricsRes, isLoading: isMetricsLoading } = useGetPartnerMetricsQuery();
  const { data: divisionsRes, isLoading: isDivisionsLoading } = useGetPartnerDivisionsQuery();
  const { data: attentionRes } = useGetPartnerAttentionRequiredQuery();

  const metrics = metricsRes?.data;
  const divisionStats = divisionsRes?.data;
  const categories = divisionStats?.divisions || [];
  const totalCategoryCount = divisionStats?.totalPartners ?? 0;

  // SVG donut segments for overview
  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top 2 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Total Partners */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics?.partnersTrend?.change || '+0.0%'}</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mt-2 flex items-center gap-2">
              {isMetricsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              ) : (
                metrics?.totalPartners ?? 0
              )}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              Total Partners
            </div>
          </div>
          <div className="w-full h-1 bg-[#16A34A] rounded-full mt-6" />
        </div>

        {/* Card 2: Approved partners */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics?.approvedTrend?.change || '+0.0%'}</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mt-2 flex items-center gap-2">
              {isMetricsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              ) : (
                metrics?.approvedPartners ?? 0
              )}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              Approved partners
            </div>
          </div>
          <div className="w-full h-1 bg-[#16A34A] rounded-full mt-6" />
        </div>
      </div>

      {/* Middle Card: Partners by Division (Donut Chart & Breakdown) */}
      <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6">
          Partners by Division
        </h2>

        {isDivisionsLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Donut Chart Ring */}
            <div className="lg:col-span-4 flex items-center justify-center py-4">
              <div className="relative w-52 h-52 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                  {totalCategoryCount === 0 ? (
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth={strokeWidth}
                    />
                  ) : (
                    categories.map((cat, idx) => {
                      if (cat.count === 0) return null;
                      const segmentLength = (cat.count / totalCategoryCount) * circumference;
                      const strokeDasharray = `${Math.max(segmentLength - 3, 1)} ${circumference - Math.max(segmentLength - 3, 1)}`;
                      const offset = accumulatedOffset;
                      accumulatedOffset += segmentLength;

                      return (
                        <circle
                          key={idx}
                          cx="90"
                          cy="90"
                          r={radius}
                          fill="transparent"
                          stroke={cat.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                        />
                      );
                    })
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-900 leading-none">
                    {totalCategoryCount}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Partners
                  </span>
                </div>
              </div>
            </div>

            {/* Category Breakdown Rows */}
            <div className="lg:col-span-8 flex flex-col gap-3.5">
              {categories.map((item, idx) => {
                const maxCount = Math.max(...categories.map((c) => c.count), 1);
                const percentWidth = totalCategoryCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;

                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-800">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-700 text-xs">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden ml-4.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentWidth}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Card: Attention Required */}
      {attentionRes?.data?.hasAttentionRequired && (
        <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
            Attention Required
          </h2>

          <div className="flex flex-col gap-3.5">
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/80 text-[#EF4444] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {attentionRes.data.message}
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateToRequests}
                    className="text-xs font-semibold text-[#EF4444] hover:text-rose-700 flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>{attentionRes.data.action?.label || 'Review requests'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
