import React from 'react';
import { Package, TrendingUp, ShoppingBag } from 'lucide-react';
import type { VendorOverviewResponse } from '../../../redux/feature/overview/overviewType';

interface VendorMetricCardsProps {
  metrics?: VendorOverviewResponse['metrics'];
  isLoading?: boolean;
}

export const VendorMetricCards: React.FC<VendorMetricCardsProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
            </div>
            <div className="mt-4">
              <div className="h-9 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-100 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const productsVal = metrics?.products?.formattedValue ?? (metrics?.products?.value !== undefined ? metrics.products.value.toLocaleString() : '0');
  const productsChange = metrics?.products?.change ?? '+0 vs last month';

  const salesVal = metrics?.totalSales?.formattedValue ?? (metrics?.totalSales?.value !== undefined ? metrics.totalSales.value.toLocaleString() : '0');
  const salesCurrency = metrics?.totalSales?.currency ?? 'BDT';
  const salesChange = metrics?.totalSales?.change ?? '+0.0% vs last month';

  const ordersVal = metrics?.totalOrders?.formattedValue ?? (metrics?.totalOrders?.value !== undefined ? metrics.totalOrders.value.toLocaleString() : '0');
  const ordersChange = metrics?.totalOrders?.change ?? '+0 vs last month';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-['Inter']">
      {/* Card 1: Products */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-medium">Products</span>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-[#0B5460]">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold text-slate-900 tracking-tight">{productsVal}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="font-semibold text-[#0B5460]">{productsChange.split(' ')[0]}</span>
            <span>{productsChange.split(' ').slice(1).join(' ')}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Sales */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-medium">Total Sales</span>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-[#0B5460]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
            {salesVal} <span className="text-lg font-semibold text-slate-500">{salesCurrency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="font-semibold text-[#0B5460]">{salesChange.split(' ')[0]}</span>
            <span>{salesChange.split(' ').slice(1).join(' ')}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Total Orders */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-medium">Total Orders</span>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-[#0B5460]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold text-slate-900 tracking-tight">{ordersVal}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="font-semibold text-[#0B5460]">{ordersChange.split(' ')[0]}</span>
            <span>{ordersChange.split(' ').slice(1).join(' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
