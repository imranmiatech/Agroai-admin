import React from 'react';
import { ShoppingBag, Clock, Truck, CheckCircle2, TrendingUp } from 'lucide-react';

interface OrdersMetricsGridProps {
  totalOrdersCount: number;
  processingCount: number;
  inTransitCount: number;
  deliveredCount: number;
}

export const OrdersMetricsGrid: React.FC<OrdersMetricsGridProps> = ({
  totalOrdersCount,
  processingCount,
  inTransitCount,
  deliveredCount
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Orders */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Total Orders</span>
          <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {totalOrdersCount}
        </div>
        <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold mt-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+18% from last month</span>
        </div>
      </div>

      {/* Processing */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Processing</span>
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {processingCount}
        </div>
        <div className="text-xs font-semibold text-[#D97706] mt-2">
          Awaiting vendor dispatch
        </div>
      </div>

      {/* In Transit */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>In Transit</span>
          <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {inTransitCount}
        </div>
        <div className="text-xs font-medium text-slate-400 mt-2">
          On route with courier
        </div>
      </div>

      {/* Delivered */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Delivered</span>
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          {deliveredCount}
        </div>
        <div className="text-xs font-medium text-slate-400 mt-2">
          Fulfilled successfully
        </div>
      </div>
    </div>
  );
};
