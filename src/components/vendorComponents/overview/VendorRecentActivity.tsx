import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, CheckCircle2, Edit3, AlertTriangle, ArrowRight } from 'lucide-react';
import type { VendorRecentActivityItem } from '../../../redux/feature/overview/overviewType';

interface VendorRecentActivityProps {
  activities?: VendorRecentActivityItem[];
  isLoading?: boolean;
}

export const VendorRecentActivity: React.FC<VendorRecentActivityProps> = ({
  activities = [],
  isLoading = false
}) => {
  const navigate = useNavigate();

  const renderIcon = (type: VendorRecentActivityItem['type']) => {
    switch (type) {
      case 'order':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case 'catalog':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4" />
          </div>
        );
      case 'delivery':
        return (
          <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'updated':
        return (
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Edit3 className="w-4 h-4" />
          </div>
        );
      case 'low_stock':
        return (
          <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
    }
  };

  const renderBadge = (item: VendorRecentActivityItem) => {
    switch (item.badgeType) {
      case 'emerald':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
            {item.badge}
          </span>
        );
      case 'teal':
        return (
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full shrink-0">
            {item.badge}
          </span>
        );
      case 'amber':
        return (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
            {item.badge}
          </span>
        );
      case 'rose':
        return (
          <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full shrink-0">
            {item.badge}
          </span>
        );
      case 'slate':
      default:
        return (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
            {item.badge}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between font-['Inter']">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent Activity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time updates on your store orders and catalog
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/vendor/orders')}
          className="text-xs font-semibold text-[#0B5460] hover:text-[#063841] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View all orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 flex flex-col mt-1">
        {isLoading && (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-[#0B5460] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400">Loading live activity...</span>
          </div>
        )}

        {!isLoading && activities.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-slate-600">No recent store activity</p>
            <p className="text-xs text-slate-400 mt-1">
              Customer orders, product changes, and stock alerts will appear here in real time.
            </p>
          </div>
        )}

        {!isLoading &&
          activities.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all"
            >
              {renderIcon(item.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.title}
                </p>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
              {renderBadge(item)}
            </div>
          ))}
      </div>
    </div>
  );
};
