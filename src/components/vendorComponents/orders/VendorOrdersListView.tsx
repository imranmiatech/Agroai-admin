import React from 'react';
import { User, MapPin, Clock } from 'lucide-react';
import type { VendorOrder, OrderStatus } from '../../../pages/vendorPages/VendorOrders';

interface VendorOrdersListViewProps {
  orders: VendorOrder[];
  activeTab: 'All' | OrderStatus;
  setActiveTab: (tab: 'All' | OrderStatus) => void;
  countNew: number;
  countProcessing: number;
  countInTransit: number;
  countCompleted: number;
  countCancelled: number;
  onOpenManageDelivery: () => void;
  onSelectOrder: (orderId: string) => void;
  onAcceptOrder: (orderId: string) => void;
  onMarkDeliverySent: (orderId: string) => void;
}

export const VendorOrdersListView: React.FC<VendorOrdersListViewProps> = ({
  orders,
  activeTab,
  setActiveTab,
  countNew,
  countProcessing,
  countInTransit,
  countCompleted,
  countCancelled,
  onOpenManageDelivery,
  onSelectOrder,
  onAcceptOrder,
  onMarkDeliverySent
}) => {
  const filteredOrders = orders.filter(o => activeTab === 'All' || o.status === activeTab);

  const filterTabs = [
    { id: 'All', label: 'All', count: orders.length },
    { id: 'New', label: 'New', count: countNew },
    { id: 'Processing', label: 'Processing', count: countProcessing },
    { id: 'Delivery Sent', label: 'Delivery Sent', count: countInTransit },
    { id: 'Completed', label: 'Completed', count: countCompleted },
    { id: 'Cancelled', label: 'Cancelled', count: countCancelled }
  ] as const;

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter']">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Orders placed by Krisikunjo customers for your products.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenManageDelivery}
          className="px-4 py-2.5 rounded-xl border border-[#0E4F5A] text-[#0E4F5A] bg-white hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer shadow-2xs"
        >
          Manage delivery fee
        </button>
      </div>

      {/* 2. Four KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{countNew}</div>
          <div className="text-xs font-medium text-slate-500 mt-2">New Orders</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{countProcessing}</div>
          <div className="text-xs font-medium text-slate-500 mt-2">Processing</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{countInTransit}</div>
          <div className="text-xs font-medium text-slate-500 mt-2">In Transit</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{countCompleted}</div>
          <div className="text-xs font-medium text-slate-500 mt-2">Completed</div>
        </div>
      </div>

      {/* 3. Filter Status Tabs with Capsule Counters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'All' | OrderStatus)}
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : 'bg-white/60 hover:bg-white text-slate-600 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                isActive ? 'bg-slate-100 text-slate-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Orders List Cards */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            No orders found under "{activeTab}".
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-3.5"
            >
              {/* Top Row: Order ID + Status Badges + Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">
                    {order.id}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                    New
                  </span>

                  {order.status === 'New' && order.hasActionNeeded && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#D97706]">
                      Action needed
                    </span>
                  )}

                  {order.status === 'Processing' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0F2FE] text-[#0284C7]">
                      Processing
                    </span>
                  )}

                  {order.status === 'Delivery Sent' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDE9FE] text-[#6366F1]">
                      Delivery Sent
                    </span>
                  )}

                  {order.status === 'Completed' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                      Completed
                    </span>
                  )}

                  {order.status === 'Cancelled' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#E11D48]">
                      Cancelled
                    </span>
                  )}
                </div>

                <span className="text-sm font-bold text-slate-900">
                  {order.totalAmount}
                </span>
              </div>

              {/* Middle Info Row: Customer, Address, Time */}
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customerName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customerAddress}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.dateTime}</span>
                </div>
              </div>

              {/* Bottom Row: Item Pills & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {order.items.map((it, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                    >
                      {it.name} ×{it.qty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {order.status === 'New' && (
                    <button
                      type="button"
                      onClick={() => onAcceptOrder(order.id)}
                      className="px-5 py-2 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                    >
                      Accept
                    </button>
                  )}

                  {order.status === 'Processing' && (
                    <button
                      type="button"
                      onClick={() => onMarkDeliverySent(order.id)}
                      className="px-5 py-2 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                    >
                      Mark as Delivery sent
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
