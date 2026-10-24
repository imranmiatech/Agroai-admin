import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  RotateCw, 
  Bike, 
  CheckCircle2, 
  FileText, 
  Phone, 
  Mail, 
  Trash2, 
  PartyPopper,
  CreditCard,
  MapPin,
  Calendar
} from 'lucide-react';
import type { AdminOrder, OrderStatus } from '../../../pages/adminPages/AdminOrders';

interface AdminOrderDetailViewProps {
  order: AdminOrder;
  onBack: () => void;
  onAcceptOrder: (orderId: string) => void;
  onMarkDeliverySent: (orderId: string, courierName?: string, trackingNumber?: string) => void;
  onMarkCompleted: (orderId: string) => void;
  onChangeStatus: (orderId: string, status: string) => void;
  onDelete: (order: AdminOrder) => void;
}

export const AdminOrderDetailView: React.FC<AdminOrderDetailViewProps> = ({
  order,
  onBack,
  onAcceptOrder,
  onMarkDeliverySent,
  onMarkCompleted,
  onChangeStatus,
  onDelete,
}) => {
  const isNew = order.status === 'New';
  const isProcessing = order.status === 'Processing';
  const isDeliverySent = order.status === 'Delivery Sent';
  const isCompleted = order.status === 'Completed';
  const isCancelled = order.status === 'Cancelled';

  // Dispatch details state for Admin
  const [courierName, setCourierName] = useState(order.courierName || 'KrishiKunjo Cold-Chain Logistics');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || `KK-TRK-${order.orderNumber?.replace(/[^0-9]/g, '') || '9921'}`);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter'] animate-in fade-in duration-200 pb-12">
      {/* 1. Header with Back Button, Order Info, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            title="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Order {order.orderNumber || order.id}
              </h1>

              {isNew && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                  New
                </span>
              )}
              {isNew && order.hasActionNeeded && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#D97706]">
                  Action needed
                </span>
              )}
              {isProcessing && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0F2FE] text-[#0284C7]">
                  Processing
                </span>
              )}
              {isDeliverySent && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDE9FE] text-[#6366F1]">
                  Delivery Sent
                </span>
              )}
              {isCompleted && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                  Completed
                </span>
              )}
              {isCancelled && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#E11D48]">
                  Cancelled
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Placed {order.dateTime}</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons: Context Action + Delete Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isNew && (
            <button
              type="button"
              onClick={() => onAcceptOrder(order.id)}
              className="px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Accept order
            </button>
          )}

          {isProcessing && (
            <button
              type="button"
              onClick={() => onMarkDeliverySent(order.id, courierName, trackingNumber)}
              className="px-5 py-2.5 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Mark as Delivery sent
            </button>
          )}

          {isDeliverySent && (
            <button
              type="button"
              onClick={() => onMarkCompleted(order.id)}
              className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Mark as Completed
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(order)}
            className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Order</span>
          </button>
        </div>
      </div>

      {/* 2. Order Progress Stepper */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">
            Order Progress
          </span>
          {isCancelled ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
              Order Cancelled
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              Current: <span className="font-semibold text-slate-800">{order.status}</span>
            </span>
          )}
        </div>

        {isCancelled ? (
          <div className="bg-rose-50/70 rounded-2xl border border-rose-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-lg">
                  ✕
                </div>
                <div>
                  <h4 className="font-bold text-sm text-rose-900">Order Cancelled</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    This order was registered on {order.dateTime} and has been cancelled. Active delivery and processing are stopped.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onChangeStatus(order.id, 'New')}
                className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              >
                Reopen as New
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between relative max-w-4xl mx-auto px-1 sm:px-4 min-w-[280px]">
              {[
                {
                  idx: 0,
                  id: 'New' as OrderStatus,
                  label: 'New',
                  sublabel: order.dateTime || 'Order Placed',
                  icon: FileText,
                },
                {
                  idx: 1,
                  id: 'Processing' as OrderStatus,
                  label: 'Processing',
                  sublabel: isProcessing ? 'In Progress' : (isDeliverySent || isCompleted) ? 'Confirmed' : 'Pending',
                  icon: RotateCw,
                },
                {
                  idx: 2,
                  id: 'Delivery Sent' as OrderStatus,
                  label: 'Delivery Sent',
                  sublabel: isDeliverySent ? (order.courierName ? `Via ${order.courierName}` : 'In Transit') : isCompleted ? 'Dispatched' : 'Pending',
                  icon: Bike,
                },
                {
                  idx: 3,
                  id: 'Completed' as OrderStatus,
                  label: 'Completed',
                  sublabel: isCompleted ? 'Delivered' : 'Pending',
                  icon: CheckCircle2,
                },
              ].map((step, i, arr) => {
                const currentIdx = isCompleted ? 3 : isDeliverySent ? 2 : isProcessing ? 1 : 0;
                const isStepCompleted = currentIdx > step.idx || (step.idx === 3 && isCompleted);
                const isStepActive = currentIdx === step.idx && !isCompleted;
                const IconComp = step.icon;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Circle & Label */}
                    <div 
                      onClick={() => onChangeStatus(order.id, step.id)}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 relative z-10 select-none cursor-pointer group"
                      title={`Click to set status to ${step.label}`}
                    >
                      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                        isStepCompleted 
                          ? 'bg-[#10B981] text-white shadow-xs group-hover:bg-[#059669]' 
                          : isStepActive
                            ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A] ring-4 ring-[#E6F4F6] shadow-xs'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                      }`}>
                        {isStepCompleted ? (
                          <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />
                        ) : isStepActive && step.id === 'Processing' ? (
                          <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#0E4F5A]" />
                        ) : (
                          <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>

                      <span className={`text-[10px] sm:text-xs text-center transition-colors ${
                        isStepActive
                          ? 'font-bold text-[#0E4F5A]'
                          : isStepCompleted
                            ? 'font-semibold text-slate-900'
                            : 'font-medium text-slate-400'
                      }`}>
                        {step.label}
                      </span>

                      <span className={`text-[9px] sm:text-[10px] text-center whitespace-nowrap mt-0.5 ${
                        isStepActive
                          ? 'text-[#0E4F5A] font-semibold'
                          : isStepCompleted
                            ? 'text-slate-500 font-normal'
                            : 'text-slate-300'
                      }`}>
                        {step.sublabel}
                      </span>
                    </div>

                    {/* Connecting Line */}
                    {i < arr.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${
                        currentIdx > step.idx ? 'bg-[#10B981]' : 'bg-slate-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Status Notification Banners */}
      {isDeliverySent && (
        <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-[#4338CA] text-white flex items-center justify-center shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#312E81]">Delivery in Transit</div>
            <div className="text-xs text-[#4338CA] mt-0.5">
              Dispatched with {order.courierName || 'logistics partner'}. Tracking #{order.trackingNumber || 'KK-TRK-PENDING'}.
            </div>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-emerald-900">Order Completed</div>
            <div className="text-xs text-emerald-700 mt-0.5">
              Customer {order.customerName} confirmed receipt and order is fully fulfilled.
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-rose-900">Order Cancelled</div>
            <div className="text-xs text-rose-700 mt-0.5">
              This order has been cancelled and is no longer being fulfilled.
            </div>
          </div>
        </div>
      )}

      {/* 4. 2-Column Content Grid: Items (Left) & Delivery/Fulfillment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Items Ordered & Price Breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-800">
              Items ordered ({order.items.reduce((s, it) => s + it.qty, 0)})
            </span>

            {/* Items List */}
            <div className="divide-y divide-slate-100 flex flex-col">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Qty: {item.qty} × {item.unitPrice}
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="border-t border-slate-200/80 pt-4 flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{order.subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-medium text-slate-900">{order.deliveryFee}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Discount</span>
                <span className="font-medium text-slate-900">{order.discount}</span>
              </div>
              <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Note from Customer */}
          {order.noteFromParent && (
            <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col gap-1">
              <span className="text-xs font-bold text-[#B45309]">
                Customer Delivery Note
              </span>
              <p className="text-sm text-[#92400E]">
                {order.noteFromParent}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Delivery Details & Fulfillment Actions */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Delivery Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">
              Delivery Details
            </span>

            <div className="flex flex-col gap-3.5 text-sm">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Customer</span>
                <span className="font-bold text-slate-900 block">{order.customerName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Shipping Address</span>
                <div className="flex items-start gap-1.5 text-slate-700 text-xs leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{order.customerAddress}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Receiver phone number</span>
                <a 
                  href={`tel:${order.customerPhone}`}
                  className="text-xs font-semibold text-[#0E4F5A] flex items-center gap-1.5 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order.customerPhone}</span>
                </a>
              </div>

              {order.customerEmail && (
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Email</span>
                  <a 
                    href={`mailto:${order.customerEmail}`}
                    className="text-xs font-semibold text-[#0E4F5A] flex items-center gap-1.5 hover:underline truncate"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{order.customerEmail}</span>
                  </a>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Payment</span>
                </span>
                <span className="font-semibold text-slate-800">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Admin Fulfillment & Dispatch Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">
              Fulfillment Controls
            </span>

            {isNew && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900">
                  New Order Received
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Accept this order to confirm items and begin packaging at the regional agro depot.
                </p>
                <button
                  type="button"
                  onClick={() => onAcceptOrder(order.id)}
                  className="w-full py-3 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Accept Order
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="flex flex-col gap-3.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Ready to dispatch?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter the courier and tracking details before marking as dispatched.
                </p>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold text-slate-600">Courier / Logistics Partner</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. KrishiKunjo Logistics / Pathao"
                    className="p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E4F5A]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold text-slate-600">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. KK-TRK-88001"
                    className="p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E4F5A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onMarkDeliverySent(order.id, courierName, trackingNumber)}
                  className="w-full py-3 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Mark as Delivery sent
                </button>
              </div>
            )}

            {isDeliverySent && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Delivery in transit
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The order is with courier <span className="font-semibold text-slate-700">{order.courierName || courierName}</span> (Tracking #{order.trackingNumber || trackingNumber}).
                </p>
                <button
                  type="button"
                  onClick={() => onMarkCompleted(order.id)}
                  className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Mark as Completed
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>This order has been completed and verified.</span>
              </div>
            )}

            {/* Admin Manual Status Override */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-slate-500">
                Change Status Directly (Admin)
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E4F5A] bg-white cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivery Sent">Delivery Sent</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  type="button"
                  onClick={() => onChangeStatus(order.id, selectedStatus)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Delete button in Fulfillment Controls */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onDelete(order)}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete this order permanently</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
