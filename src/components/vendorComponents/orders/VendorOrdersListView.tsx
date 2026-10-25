import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Clock, 
  RotateCcw, 
  Archive, 
  Check, 
  X
} from 'lucide-react';
import type { VendorOrder, OrderStatus } from '../../../pages/vendorPages/VendorOrders';

interface VendorOrdersListViewProps {
  orders: VendorOrder[];
  activeTab: 'All' | OrderStatus | 'Archived';
  setActiveTab: (tab: 'All' | OrderStatus | 'Archived') => void;
  countNew: number;
  countProcessing: number;
  countInTransit: number;
  countCompleted: number;
  countCancelled: number;
  countArchived: number;
  onSelectOrder: (orderId: string) => void;
  onAcceptOrder: (orderId: string) => void;
  onMarkDeliverySent: (orderId: string) => void;
  onMarkCompleted?: (orderId: string) => void;
  onDeleteOrder: (orderId: string, mode: 'soft' | 'hard') => Promise<void>;
  onRestoreOrder: (orderId: string) => Promise<void>;
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
  countArchived,
  onSelectOrder,
  onAcceptOrder,
  onMarkDeliverySent,
  onMarkCompleted,
  onDeleteOrder,
  onRestoreOrder,
}) => {
  // Modal states for delete/archive
  const [targetOrder, setTargetOrder] = useState<VendorOrder | null>(null);
  const [deleteMode, setDeleteMode] = useState<'soft' | 'hard'>('soft');
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Active orders (not soft-deleted)
  const activeOrders = orders.filter((o) => !o.isDeleted);

  // Filtered orders according to the current tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Archived') {
      return Boolean(o.isDeleted);
    }
    // For active tabs, exclude soft-deleted orders
    if (o.isDeleted) return false;
    if (activeTab === 'All') return true;
    return o.status === activeTab;
  });

  const filterTabs = [
    { id: 'All', label: 'All Active', count: activeOrders.length },
    { id: 'New', label: 'New', count: countNew },
    { id: 'Processing', label: 'Processing', count: countProcessing },
    { id: 'Delivery Sent', label: 'Delivery Sent', count: countInTransit },
    { id: 'Completed', label: 'Completed', count: countCompleted },
    { id: 'Cancelled', label: 'Cancelled', count: countCancelled },
    { id: 'Archived', label: 'Archived / Trash', count: countArchived },
  ] as const;

  const handleConfirmDelete = async () => {
    if (!targetOrder) return;
    setIsDeleting(true);
    try {
      await onDeleteOrder(targetOrder.id, deleteMode);
      const msg = deleteMode === 'soft' 
        ? `Order #${targetOrder.orderNumber || targetOrder.id} archived and hidden from active list.` 
        : `Order #${targetOrder.orderNumber || targetOrder.id} permanently deleted.`;
      setActionSuccessMsg(msg);
      setTimeout(() => setActionSuccessMsg(null), 4000);
      setTargetOrder(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (orderId: string, orderNumber?: string) => {
    try {
      await onRestoreOrder(orderId);
      setActionSuccessMsg(`Order #${orderNumber || orderId} restored to active list.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter'] relative">
      {/* Action Notification Toast */}
      {actionSuccessMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#0E4F5A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{actionSuccessMsg}</span>
          <button 
            type="button" 
            onClick={() => setActionSuccessMsg(null)}
            className="text-white/60 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Orders Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store supply orders, delivery dispatch, and clean up completed lists safely without affecting sales metrics.
          </p>
        </div>

        {/* Quick Archive / Deleted Orders toggle button */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'Archived' ? 'All' : 'Archived')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0 ${
            activeTab === 'Archived'
              ? 'bg-[#0E4F5A] text-white ring-2 ring-[#0E4F5A]/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Archive className="w-4 h-4 text-amber-500" />
          <span>Archived Orders</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'Archived' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {countArchived}
          </span>
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
          <div className="text-xs font-medium text-slate-500 mt-2">Delivery Sent</div>
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
          const isArchivedTab = tab.id === 'Archived';
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'All' | OrderStatus | 'Archived')}
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? isArchivedTab 
                    ? 'bg-amber-50 text-amber-900 font-semibold shadow-xs border border-amber-200'
                    : 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : 'bg-white/60 hover:bg-white text-slate-600 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                isActive 
                  ? isArchivedTab ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-900'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3.1 Banner when viewing Archived tab */}
      {activeTab === 'Archived' && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950">
                Archived / Deleted Orders ({filteredOrders.length})
              </h3>
              <p className="text-[11px] text-amber-800">
                Hidden from active order lists. Click "Restore Order" to return any order to your active list.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('All')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            Back to Active Orders
          </button>
        </div>
      )}

      {/* 4. Orders List Cards */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            {activeTab === 'Archived' 
              ? 'No archived orders found.' 
              : `No orders found under "${activeTab}".`}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-3.5 ${
                order.isDeleted ? 'border-amber-200/80 bg-amber-50/15' : 'border-slate-200/80'
              }`}
            >
              {/* Top Row: Order ID + Status Badges + Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">
                    {order.orderNumber || order.id}
                  </span>

                  {order.isDeleted ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Archive className="w-3 h-3" />
                      <span>Archived (Hidden)</span>
                    </span>
                  ) : (
                    <>
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
                    </>
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

                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                  {/* Actions for ARCHIVED orders */}
                  {order.isDeleted ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(order.id, order.orderNumber);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore to Active List</span>
                    </button>
                  ) : (
                    /* Actions for ACTIVE orders */
                    <>
                      {order.status === 'New' && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcceptOrder(order.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkDeliverySent(order.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                          >
                            Delivery sent
                          </button>
                        </>
                      )}

                      {order.status === 'Processing' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkDeliverySent(order.id);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                        >
                          Mark as Delivery sent
                        </button>
                      )}

                      {order.status === 'Delivery Sent' && onMarkCompleted && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkCompleted(order.id);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                        >
                          Mark as Completed
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectOrder(order.id)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        View
                      </button>

                      {/* Archive button to clean up list */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetOrder(order);
                          setDeleteMode('soft');
                        }}
                        title="Archive order from active list"
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Archive Modal */}
      {targetOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0E4F5A]/10 text-[#0E4F5A]">
                  <Archive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Archive Order
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    #{targetOrder.orderNumber || targetOrder.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTargetOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clean Pill */}
            <div className="py-4 flex flex-col gap-2">
              <div className="p-3.5 rounded-2xl bg-[#0E4F5A]/5 border border-[#0E4F5A]/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Archive (Soft Delete)
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                  Preserves Metrics
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTargetOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-98 bg-[#0E4F5A] hover:bg-[#0A3D46]"
              >
                {isDeleting ? 'Archiving...' : 'Archive Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
