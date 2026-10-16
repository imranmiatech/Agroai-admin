import React from 'react';
import { Inbox, Clock, CheckCircle2 } from 'lucide-react';

interface SupportMetricsGridProps {
  openCount: number;
  waitingCount: number;
  resolvedCount: number;
}

export const SupportMetricsGrid: React.FC<SupportMetricsGridProps> = ({
  openCount,
  waitingCount,
  resolvedCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Open Tickets */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
        <div className="w-13 h-13 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center shrink-0">
          <Inbox className="w-6 h-6" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {openCount}
          </div>
          <div className="text-sm font-medium text-slate-500 mt-0.5">
            Open Tickets
          </div>
        </div>
      </div>

      {/* Waiting for Reply */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
        <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {waitingCount}
          </div>
          <div className="text-sm font-medium text-slate-500 mt-0.5">
            Waiting for Reply
          </div>
        </div>
      </div>

      {/* Resolved Today */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
        <div className="w-13 h-13 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {resolvedCount}
          </div>
          <div className="text-sm font-medium text-slate-500 mt-0.5">
            Resolved Today
          </div>
        </div>
      </div>
    </div>
  );
};
