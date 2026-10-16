import React from 'react';
import { CheckCircle2, Zap, AlertCircle } from 'lucide-react';

export const GoodMorningBanner: React.FC = () => {
  return (
    <div 
      className="rounded-2xl p-6 sm:p-7 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #062E35 0%, #0A434D 100%)'
      }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Good morning 👋
        </h1>
        <p className="text-[#9DB9BF] text-sm mt-1">
          Here's a snapshot of your platform today.
        </p>
      </div>

      {/* 3 Status Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Platform Healthy */}
        <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white leading-tight">Platform Healthy</span>
            <span className="text-[11px] text-[#A2C2C8]">99.9% uptime</span>
          </div>
        </div>

        {/* AI Services Active */}
        <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white leading-tight">AI Services Active</span>
            <span className="text-[11px] text-[#A2C2C8]">All systems go</span>
          </div>
        </div>

        {/* 3 Urgent Tasks */}
        <div className="flex items-center gap-3 bg-[#69291D]/80 hover:bg-[#69291D] backdrop-blur-xs px-4 py-2.5 rounded-xl border border-red-500/30 transition-colors">
          <div className="w-6 h-6 rounded-full bg-red-500/30 text-rose-300 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white leading-tight">3 Urgent Tasks</span>
            <span className="text-[11px] text-rose-200">Needs attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};
