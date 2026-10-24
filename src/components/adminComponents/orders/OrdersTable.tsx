import React from 'react';
import { Eye, Edit3, Ban, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { OrderItem } from '../../../pages/adminPages/AdminOrders';

interface OrdersTableProps {
  orders: OrderItem[];
  startIndex: number;
  itemsPerPage: number;
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onView: (order: OrderItem) => void;
  onEdit: (order: OrderItem) => void;
  onHold: (order: OrderItem) => void;
  onDelete: (order: OrderItem) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  startIndex,
  itemsPerPage,
  totalFiltered,
  currentPage,
  totalPages,
  setCurrentPage,
  onView,
  onEdit,
  onHold,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Purchased Items</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No orders found matching your search.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Order ID & Date */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span 
                        onClick={() => onView(order)}
                        className="font-bold text-slate-900 text-sm font-mono hover:text-[#062E35] cursor-pointer"
                      >
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {order.date}
                      </span>
                    </div>
                  </td>

                  {/* Customer with Initials Circle */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 select-none shadow-2xs"
                        style={{ backgroundColor: order.avatarColor }}
                      >
                        {order.customerInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-900 text-sm leading-tight truncate">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                          {order.customerEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col max-w-xs">
                      <span className="text-xs font-semibold text-slate-800">
                        {order.items.reduce((sum: number, i: any) => sum + i.qty, 0)} items
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 truncate" title={order.items.map((i: any) => `${i.qty}x ${i.name}`).join(', ')}>
                        {order.items.map((i: any) => `${i.qty}x ${i.name}`).join(', ')}
                      </span>
                    </div>
                  </td>

                  {/* Total Amount & Payment Badge */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">
                        €{order.totalAmount.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        via {order.paymentMethod}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    {order.status === 'New' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#475569]" />
                        <span>New</span>
                      </span>
                    )}
                    {order.status === 'Processing' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                        <span>Processing</span>
                      </span>
                    )}
                    {order.status === 'Delivery Sent' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#6366F1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                        <span>Delivery Sent</span>
                      </span>
                    )}
                    {order.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span>Completed</span>
                      </span>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#E11D48]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                        <span>Cancelled</span>
                      </span>
                    )}
                  </td>

                  {/* 4 Action Icons: View, Edit, Suspend/Hold, Delete */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onView(order)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit({ ...order })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#062E35] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit order status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onHold(order)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          (order.status as any) === 'On Hold'
                            ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                            : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                        title={(order.status as any) === 'On Hold' ? 'Release hold' : 'Put on fulfillment hold'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(order)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete / Cancel order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{totalFiltered === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + itemsPerPage, totalFiltered)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{totalFiltered}</span> orders
        </div>

        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#062E35] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
