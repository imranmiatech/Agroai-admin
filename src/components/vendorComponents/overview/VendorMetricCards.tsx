import React from 'react';
import { LayoutGrid, Sparkles, Target } from 'lucide-react';

export const VendorMetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Products */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-medium">Products</span>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-700">
            <LayoutGrid className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold text-slate-900 tracking-tight">128</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="font-semibold text-[#0B5460]">+12</span>
            <span>vs last month</span>
          </div>
        </div>
      </div>

      {/* Card 2: Active Offers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-medium">Active Offers</span>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-700">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold text-slate-900 tracking-tight">6</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="font-semibold text-[#0B5460]">+2</span>
            <span>vs last month</span>
          </div>
        </div>
      </div>

      {/* Card 3: Redemptions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-medium">Redemptions</span>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-700">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold text-slate-900 tracking-tight">342</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="font-semibold text-[#0B5460]">+38</span>
            <span>vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
