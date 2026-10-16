import React from 'react';
import { ArrowLeft, Check, RotateCw, Bike, CheckCircle2, FileText, Phone, Bell, PartyPopper } from 'lucide-react';
import type { VendorOrder } from '../../../pages/vendorPages/VendorOrders';

interface VendorOrderDetailViewProps {
  order: VendorOrder;
  onBack: () => void;
  onAcceptOrder: (orderId: string) => void;
  onMarkDeliverySent: (orderId: string) => void;
}

export const VendorOrderDetailView: React.FC<VendorOrderDetailViewProps> = ({
  order,
  onBack,
  onAcceptOrder,
  onMarkDeliverySent
}) => {
  const isNew = order.status === 'New';
  const isProcessing = order.status === 'Processing';
  const isDeliverySent = order.status === 'Delivery Sent';
  const isCompleted = order.status === 'Completed';

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter'] animate-in fade-in duration-200">
      {/* Header with Back Button and Status Action Button */}
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Order {order.id}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed {order.dateTime}
            </p>
          </div>
        </div>

        {/* Action Button at Top Right */}
        <div>
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
              onClick={() => onMarkDeliverySent(order.id)}
              className="px-5 py-2.5 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Mark as Delivery sent
            </button>
          )}
          {(isDeliverySent || isCompleted) && (
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-[#EDE9FE] text-[#6366F1]">
              Delivery sent
            </span>
          )}
        </div>
      </div>

      {/* Order Progress Stepper */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-slate-800">
          Order Progress
        </span>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between relative max-w-4xl mx-auto px-1 sm:px-4 min-w-[280px]">
            {/* Step 1: New */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 relative z-10">
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                isNew 
                  ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A]' 
                  : 'bg-[#10B981] text-white shadow-xs'
              }`}>
                {isNew ? <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> : <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center">New</span>
            </div>

            {/* Connecting line 1 */}
            <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${
              !isNew ? 'bg-[#0E4F5A]' : 'bg-slate-200'
            }`} />

            {/* Step 2: Processing */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 relative z-10">
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                isProcessing 
                  ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A]' 
                  : isDeliverySent || isCompleted
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {isDeliverySent || isCompleted ? (
                  <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />
                ) : (
                  <RotateCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center">Processing</span>
            </div>

            {/* Connecting line 2 */}
            <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${
              isDeliverySent || isCompleted ? 'bg-[#0E4F5A]' : 'bg-slate-200'
            }`} />

            {/* Step 3: Delivery Sent */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 relative z-10">
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                isDeliverySent 
                  ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A]' 
                  : isCompleted
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />
                ) : (
                  <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center">Delivery Sent</span>
            </div>

            {/* Connecting line 3 */}
            <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${
              isCompleted ? 'bg-[#0E4F5A]' : 'bg-slate-200'
            }`} />

            {/* Step 4: Completed */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 relative z-10">
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                isCompleted 
                  ? 'bg-[#10B981] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Callout Banner */}
      {isDeliverySent && (
        <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-[#4338CA] text-white flex items-center justify-center shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#312E81]">Awaiting Confirmation</div>
            <div className="text-xs text-[#4338CA] mt-0.5">
              Delivery has been sent. Waiting for {order.confirmationRecipient || 'Priya Nair'} to confirm receipt in the Krisikunjo app.
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
              {order.customerName} confirmed receipt on Just now.
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Content Grid: Items Ordered (Left) & Delivery Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Items Ordered & Price Breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-800">
              Items ordered
            </span>

            {/* Items List */}
            <div className="divide-y divide-slate-100 flex flex-col">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Qty: {item.qty} × {item.unitPrice}</div>
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
                <span>Delivery</span>
                <span className="font-medium text-slate-900">{order.deliveryFee}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Discount 5%</span>
                <span className="font-medium text-slate-900">{order.discount}</span>
              </div>
              <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Note from Parent Card */}
          {order.noteFromParent && (
            <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col gap-1">
              <span className="text-xs font-bold text-[#B45309]">
                Note from Parent
              </span>
              <p className="text-sm text-[#92400E]">
                {order.noteFromParent}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Delivery Details & Context Action Card */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Delivery Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">
              Delivery Details
            </span>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="font-bold text-slate-900 block">{order.customerName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Address</span>
                <span className="text-slate-700 text-xs leading-relaxed block">
                  {order.customerAddress}
                </span>
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
            </div>
          </div>

          {/* Card 2: Interactive Context State Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            {isNew && (
              <>
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  New Order Received
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review the items above and accept this order to begin preparing the delivery.
                </p>
                <button
                  type="button"
                  onClick={() => onAcceptOrder(order.id)}
                  className="w-full py-3 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Accept Order
                </button>
              </>
            )}

            {isProcessing && (
              <>
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Ready to dispatch?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Once you've packed and dispatched the order, tap below. The parent will be notified to expect their delivery.
                </p>
                <button
                  type="button"
                  onClick={() => onMarkDeliverySent(order.id)}
                  className="w-full py-3 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Mark as Delivery sent
                </button>
              </>
            )}

            {(isDeliverySent || isCompleted) && (
              <>
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Delivery in transit
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Waiting for {order.confirmationRecipient || 'Priya Nair'} to confirm receipt through the Krisikunjo app. You'll receive a notification when they do.
                </p>
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-xl bg-[#F1F5F9] text-slate-500 text-xs font-semibold flex items-center justify-center gap-2 cursor-default"
                >
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>You'll be notified on completion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
