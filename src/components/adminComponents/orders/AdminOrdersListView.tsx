import React from 'react';
import { User, MapPin, Clock, Search, Trash2 } from 'lucide-react';
import type { AdminOrder, OrderStatus } from '../../../pages/adminPages/AdminOrders';

interface AdminOrdersListViewProps {
  orders: AdminOrder[];
  activeTab: 'All' | OrderStatus;
  setActiveTab: (tab: 'All' | OrderStatus) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  countNew: number;
  countProcessing: number;
  countInTransit: number;
  countCompleted: number;
  countCancelled: number;
  onSelectOrder: (orderId: string) => void;
  onAcceptOrder: (orderId: string) => void;
  onMarkDeliverySent: (orderId: string) => void;
  onMarkCompleted: (orderId: string) => void;
  onDeleteOrder: (order: AdminOrder) => void;
}

export const AdminOrdersListView: React.FC<AdminOrdersListViewProps> = ({
  orders,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  countNew,
  countProcessing,
  countInTransit,
  countCompleted,
  countCancelled,
  onSelectOrder,
  onAcceptOrder,
  onMarkDeliverySent,
  onMarkCompleted,
  onDeleteOrder,
}) => {
  // Filter by active status tab and search term
  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    if (!matchesTab) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const orderNum = (o.orderNumber || o.id || '').toLowerCase();
    const custName = (o.customerName || '').toLowerCase();
    const custEmail = (o.customerEmail || '').toLowerCase();
    const custPhone = (o.customerPhone || '').toLowerCase();
    const itemsMatch = o.items.some((it) => it.name.toLowerCase().includes(term));

    return (
      orderNum.includes(term) ||
      custName.includes(term) ||
      custEmail.includes(term) ||
      custPhone.includes(term) ||
      itemsMatch
    );
  });

  const filterTabs = [
    { id: 'All', label: 'All', count: orders.length },
    { id: 'New', label: 'New', count: countNew },
    { id: 'Processing', label: 'Processing', count: countProcessing },
    { id: 'Delivery Sent', label: 'Delivery Sent', count: countInTransit },
    { id: 'Completed', label: 'Completed', count: countCompleted },
    { id: 'Cancelled', label: 'Cancelled', count: countCancelled },
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
            Orders placed by Krisikunjo customers across all marketplace vendors.
          </p>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards (Identical design to Vendor) */}
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

      {/* 3. Filter Controls: Capsule Status Tabs & Live Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Status Tabs with Capsule Counters */}
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
                <span
                  className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isActive ? 'bg-slate-100 text-slate-900' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order ID, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* 4. Orders List Cards */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            No orders found under "{activeTab}"{searchTerm ? ` matching "${searchTerm}"` : ''}.
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
                    {order.orderNumber || order.id}
                  </span>

                  {order.status === 'New' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                      New
                    </span>
                  )}

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
                  <span className="font-medium text-slate-700">{order.customerName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-xs">{order.customerAddress}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.dateTime}</span>
                </div>
              </div>

              {/* Bottom Row: Item Pills & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {order.items.map((it, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                    >
                      {it.name} × {it.qty}
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

                  {order.status === 'Delivery Sent' && (
                    <button
                      type="button"
                      onClick={() => onMarkCompleted(order.id)}
                      className="px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                    >
                      Mark as Completed
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    View
                  </button>

                  {/* Delete button on order card */}
                  <button
                    type="button"
                    onClick={() => onDeleteOrder(order)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
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
