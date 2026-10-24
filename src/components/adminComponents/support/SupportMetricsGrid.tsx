import React from 'react';
import { Inbox, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SupportMetricsGridProps {
  totalCount?: number;
  openCount: number;
  inReviewCount?: number;
  resolvedCount: number;
}

export const SupportMetricsGrid: React.FC<SupportMetricsGridProps> = ({
  totalCount,
  openCount,
  resolvedCount
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Tickets */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Inbox className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {totalCount ?? (openCount + resolvedCount)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            Total Tickets
          </div>
        </div>
      </div>

      {/* Open Tickets */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-[#16A34A] tracking-tight leading-tight">
            {openCount}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            Open Issues
          </div>
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-[#00695C] tracking-tight leading-tight">
            {resolvedCount}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            Resolved
          </div>
        </div>
      </div>
    </div>
  );
};
