import React from 'react';
import { Package, CheckCircle2, AlertCircle, Ban, TrendingUp, TrendingDown } from 'lucide-react';

interface ProductMetricsGridProps {
  totalCount: number;
  activeCount: number;
  outOfStockCount: number;
  suspendedCount: number;
  growthText?: string;
  isPositive?: boolean;
}

export const ProductMetricsGrid: React.FC<ProductMetricsGridProps> = ({
  totalCount,
  activeCount,
  outOfStockCount,
  suspendedCount,
  growthText,
  isPositive = true,
}) => {
  const displayGrowth =
    growthText ??
    (totalCount === 0
      ? '+0% from last month'
      : totalCount === 1
      ? '+1 new item this month'
      : `+${totalCount} active items`);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Products */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Total Products</span>
          <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {totalCount}
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold mt-2 text-[#16A34A]">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{displayGrowth}</span>
        </div>
      </div>

      {/* Active & In Stock */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Active & In Stock</span>
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {activeCount}
        </div>
        <div className="text-xs font-medium text-slate-400 mt-2">
          Available on customer store
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Out of Stock</span>
          <div className="w-8 h-8 rounded-xl bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {outOfStockCount}
        </div>
        <div className="text-xs font-semibold text-[#D92D20] mt-2">
          Needs inventory restock
        </div>
      </div>

      {/* Suspended Items */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Suspended</span>
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Ban className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {suspendedCount}
        </div>
        <div className="text-xs font-medium text-slate-400 mt-2">
          Moderated or compliance hold
        </div>
      </div>
    </div>
  );
};
