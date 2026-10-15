import { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  FileText, 
  Bike, 
  RotateCw, 
  Check, 
  CheckCircle2, 
  Bell, 
  Phone, 
  PartyPopper
} from 'lucide-react';

export type OrderStatus = 'New' | 'Processing' | 'Delivery Sent' | 'Completed' | 'Cancelled';

export interface OrderItemProduct {
  name: string;
  qty: number;
  unitPrice: string;
  totalPrice: string;
}

export interface VendorOrder {
  id: string;
  status: OrderStatus;
  hasActionNeeded?: boolean;
  totalAmount: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  dateTime: string;
  items: OrderItemProduct[];
  subtotal: string;
  deliveryFee: string;
  discount: string;
  noteFromParent?: string;
  confirmationRecipient?: string;
}

export const VendorOrders = () => {
  // Navigation views: 'list' | 'detail' | 'manage_delivery'
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'manage_delivery'>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-20145');
  const [activeTab, setActiveTab] = useState<'All' | OrderStatus>('All');

  // Delivery Fee configuration state (Node 27713:5634)
  const [baseFee, setBaseFee] = useState('15.00');
  const [ratePerKm, setRatePerKm] = useState('2.50');
  const [minDistance, setMinDistance] = useState('2.50');
  const [deliverySavedNotice, setDeliverySavedNotice] = useState(false);

  // Orders list matching Figma node 26759:87848
  const [orders, setOrders] = useState<VendorOrder[]>([
    {
      id: 'ORD-20145',
      status: 'New',
      hasActionNeeded: true,
      totalAmount: 'AED 47.98',
      customerName: 'Emily Hartley',
      customerAddress: 'Hare street, Abu Dhabi, Dubai',
      customerPhone: '+1 (234) 567-890',
      dateTime: '21 Aug 2026, 09:14',
      items: [
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' }
      ],
      subtotal: 'AED 14.00',
      deliveryFee: 'AED 14.00',
      discount: 'AED 14.00',
      noteFromParent: "Please leave with a neighbour if I'm not in.",
      confirmationRecipient: 'Priya Nair'
    },
    {
      id: 'ORD-20146',
      status: 'Processing',
      totalAmount: 'AED 47.98',
      customerName: 'Emily Hartley',
      customerAddress: 'Hare street, Abu Dhabi, Dubai',
      customerPhone: '+1 (234) 567-890',
      dateTime: '21 Aug 2026, 09:14',
      items: [
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Organic Baby Formula', qty: 1, unitPrice: '£18.50', totalPrice: 'AED 33.98' }
      ],
      subtotal: 'AED 47.98',
      deliveryFee: 'AED 0.00',
      discount: 'AED 0.00',
      noteFromParent: 'Call when arriving at the gate.',
      confirmationRecipient: 'Emily Hartley'
    },
    {
      id: 'ORD-20147',
      status: 'Delivery Sent',
      totalAmount: 'AED 47.98',
      customerName: 'Emily Hartley',
      customerAddress: 'Hare street, Abu Dhabi, Dubai',
      customerPhone: '+1 (234) 567-890',
      dateTime: '21 Aug 2026, 09:14',
      items: [
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Organic Baby Formula', qty: 1, unitPrice: '£18.50', totalPrice: 'AED 33.98' }
      ],
      subtotal: 'AED 47.98',
      deliveryFee: 'AED 0.00',
      discount: 'AED 0.00',
      confirmationRecipient: 'Priya Nair'
    },
    {
      id: 'ORD-20148',
      status: 'Completed',
      totalAmount: 'AED 47.98',
      customerName: 'Emily Hartley',
      customerAddress: 'Hare street, Abu Dhabi, Dubai',
      customerPhone: '+1 (234) 567-890',
      dateTime: '21 Aug 2026, 09:14',
      items: [
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Organic Baby Formula', qty: 1, unitPrice: '£18.50', totalPrice: 'AED 33.98' }
      ],
      subtotal: 'AED 47.98',
      deliveryFee: 'AED 0.00',
      discount: 'AED 0.00',
      confirmationRecipient: 'Emily Hartley'
    },
    {
      id: 'ORD-20149',
      status: 'Cancelled',
      totalAmount: 'AED 47.98',
      customerName: 'Emily Hartley',
      customerAddress: 'Hare street, Abu Dhabi, Dubai',
      customerPhone: '+1 (234) 567-890',
      dateTime: '21 Aug 2026, 09:14',
      items: [
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' },
        { name: 'Organic Baby Formula', qty: 1, unitPrice: '£18.50', totalPrice: 'AED 33.98' }
      ],
      subtotal: 'AED 47.98',
      deliveryFee: 'AED 0.00',
      discount: 'AED 0.00'
    }
  ]);

  // Selected Order for Detail View
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  // Actions
  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Processing', hasActionNeeded: false } : o));
  };

  const handleMarkDeliverySent = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Delivery Sent' } : o));
  };

  const handleSaveDeliveryFee = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliverySavedNotice(true);
    setTimeout(() => setDeliverySavedNotice(false), 3000);
  };

  // Counts for Metric Cards & Filter Tabs
  const countNew = orders.filter(o => o.status === 'New').length;
  const countProcessing = orders.filter(o => o.status === 'Processing').length;
  const countInTransit = orders.filter(o => o.status === 'Delivery Sent').length;
  const countCompleted = orders.filter(o => o.status === 'Completed').length;
  const countCancelled = orders.filter(o => o.status === 'Cancelled').length;

  const filteredOrders = orders.filter(o => {
    return activeTab === 'All' || o.status === activeTab;
  });

  /* =========================================================================
     VIEW 1: MANAGE DELIVERY FEE (Figma Node 27713:5634)
     ========================================================================= */
  if (currentView === 'manage_delivery') {
    const calculatedDistance = 5;
    const extraKm = Math.max(0, calculatedDistance - parseFloat(minDistance || '0'));
    const calculatedExtraFee = extraKm * parseFloat(ratePerKm || '0');
    const calculatedTotalFee = (parseFloat(baseFee || '0') + calculatedExtraFee).toFixed(2);

    return (
      <div className="flex flex-col gap-6 w-full font-['Inter'] animate-in fade-in duration-200">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentView('list')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            title="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Manage Delivery Fee
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Configure how delivery fees are calculated for your store.
            </p>
          </div>
        </div>

        {deliverySavedNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Delivery fee settings saved successfully!
          </div>
        )}

        {/* 2-Column Grid matching Node 27713:5634 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Card: Delivery Fee Structure */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900">
              Delivery Fee Structure
            </h2>

            <form onSubmit={handleSaveDeliveryFee} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Base Fee */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Base Fee (AED)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={baseFee}
                      onChange={(e) => setBaseFee(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-1 focus:ring-[#0E4F5A]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      AED
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Applied to all orders before distance calculation.
                  </span>
                </div>

                {/* Rate per Kilometer */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Rate per Kilometer (AED/km)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={ratePerKm}
                      onChange={(e) => setRatePerKm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-1 focus:ring-[#0E4F5A]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      AED/km
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Charge per additional kilometer.
                  </span>
                </div>
              </div>

              {/* Minimum Delivery Distance */}
              <div className="sm:w-1/2 pr-0 sm:pr-2.5">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Minimum Delivery Distance (km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={minDistance}
                    onChange={(e) => setMinDistance(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-1 focus:ring-[#0E4F5A]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    km
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Distance included in the base fee.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Right Card: How it works & Example Calculation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-900">
              How it works
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distance-based delivery calculates the fee based on the straight-line distance between your store location and the customer's delivery address.
            </p>

            {/* Example Calculation Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2.5 mt-2">
              <span className="text-xs font-bold text-slate-900">
                Example Calculation:
              </span>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Base Fee:</span>
                <span className="font-semibold text-slate-900">{parseFloat(baseFee || '0').toFixed(2)} AED</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Distance (5km):</span>
                <span className="font-semibold text-slate-900">+{calculatedExtraFee.toFixed(2)} AED</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Total Fee:</span>
                <span className="font-bold text-slate-900">{calculatedTotalFee} AED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 2: ORDER DETAIL VIEW (Nodes 26767:3067, 26785:86132, 26785:86583, 26785:86842)
     ========================================================================= */
  if (currentView === 'detail') {
    const isNew = selectedOrder.status === 'New';
    const isProcessing = selectedOrder.status === 'Processing';
    const isDeliverySent = selectedOrder.status === 'Delivery Sent';
    const isCompleted = selectedOrder.status === 'Completed';

    return (
      <div className="flex flex-col gap-6 w-full font-['Inter'] animate-in fade-in duration-200">
        {/* Header with Back Button and Status Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              title="Back to Orders"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Order {selectedOrder.id}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed {selectedOrder.dateTime}
              </p>
            </div>
          </div>

          {/* Action Button at Top Right */}
          <div>
            {isNew && (
              <button
                type="button"
                onClick={() => handleAcceptOrder(selectedOrder.id)}
                className="px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Accept order
              </button>
            )}
            {isProcessing && (
              <button
                type="button"
                onClick={() => handleMarkDeliverySent(selectedOrder.id)}
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

        {/* Order Progress Stepper (Figma Stepper) */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-slate-800">
            Order Progress
          </span>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between relative max-w-4xl mx-auto px-4">
              {/* Step 1: New */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isNew 
                    ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A]' 
                    : 'bg-[#10B981] text-white shadow-xs'
                }`}>
                  {isNew ? <FileText className="w-5 h-5" /> : <Check className="w-6 h-6 stroke-[3]" />}
                </div>
                <span className="text-xs font-semibold text-slate-800">New</span>
              </div>

              {/* Connecting line 1 */}
              <div className={`flex-1 h-0.5 mx-2 transition-all ${
                !isNew ? 'bg-[#0E4F5A]' : 'bg-slate-200'
              }`} />

              {/* Step 2: Processing */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isProcessing 
                    ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A]' 
                    : isDeliverySent || isCompleted
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDeliverySent || isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <RotateCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-800">Processing</span>
              </div>

              {/* Connecting line 2 */}
              <div className={`flex-1 h-0.5 mx-2 transition-all ${
                isDeliverySent || isCompleted ? 'bg-[#0E4F5A]' : 'bg-slate-200'
              }`} />

              {/* Step 3: Delivery Sent */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isDeliverySent 
                    ? 'bg-[#E6F4F6] text-[#0E4F5A] border-2 border-[#0E4F5A]' 
                    : isCompleted
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <Bike className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-800">Delivery Sent</span>
              </div>

              {/* Connecting line 3 */}
              <div className={`flex-1 h-0.5 mx-2 transition-all ${
                isCompleted ? 'bg-[#0E4F5A]' : 'bg-slate-200'
              }`} />

              {/* Step 4: Completed */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-[#10B981] text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Callout Banner (Matching Nodes 26785:86583 & 26785:86842) */}
        {isDeliverySent && (
          <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center gap-3 text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-[#4338CA] text-white flex items-center justify-center shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#312E81]">Awaiting Confirmation</div>
              <div className="text-xs text-[#4338CA] mt-0.5">
                Delivery has been sent. Waiting for {selectedOrder.confirmationRecipient || 'Priya Nair'} to confirm receipt in the Alurei app.
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
                {selectedOrder.customerName} confirmed receipt on Just now.
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
                {selectedOrder.items.map((item, idx) => (
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
                  <span className="font-medium text-slate-900">{selectedOrder.subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="font-medium text-slate-900">{selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Discount 5%</span>
                  <span className="font-medium text-slate-900">{selectedOrder.discount}</span>
                </div>
                <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between text-base">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-slate-900">{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Note from Parent Card */}
            {selectedOrder.noteFromParent && (
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col gap-1">
                <span className="text-xs font-bold text-[#B45309]">
                  Note from Parent
                </span>
                <p className="text-sm text-[#92400E]">
                  {selectedOrder.noteFromParent}
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
                  <span className="font-bold text-slate-900 block">{selectedOrder.customerName}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Address</span>
                  <span className="text-slate-700 text-xs leading-relaxed block">
                    {selectedOrder.customerAddress}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Receiver phone number</span>
                  <a 
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="text-xs font-semibold text-[#0E4F5A] flex items-center gap-1.5 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.customerPhone}</span>
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
                    onClick={() => handleAcceptOrder(selectedOrder.id)}
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
                    onClick={() => handleMarkDeliverySent(selectedOrder.id)}
                    className="w-full py-3 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                  >
                    Mark as Delivery sent
                  </button>
                </>
              )}

              {isDeliverySent && (
                <>
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Delivery in transit
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Waiting for {selectedOrder.confirmationRecipient || 'Priya Nair'} to confirm receipt through the Alurei app. You'll receive a notification when they do.
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

              {isCompleted && (
                <>
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Delivery in transit
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Waiting for {selectedOrder.confirmationRecipient || 'Priya Nair'} to confirm receipt through the Alurei app. You'll receive a notification when they do.
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
  }

  /* =========================================================================
     VIEW 3: MAIN ORDERS LIST VIEW (Figma Node 26759:87848)
     ========================================================================= */
  return (
    <div className="flex flex-col gap-6 w-full font-['Inter']">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Orders placed by Alurei parents for your products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('manage_delivery')}
          className="px-4 py-2.5 rounded-xl border border-[#0E4F5A] text-[#0E4F5A] bg-white hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer shadow-2xs"
        >
          Manage delivery fee
        </button>
      </div>

      {/* 2. Four KPI Metric Cards (Figma Grid Layout) */}
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
        {[
          { id: 'All', label: 'All', count: orders.length },
          { id: 'New', label: 'New', count: countNew },
          { id: 'Processing', label: 'Processing', count: countProcessing },
          { id: 'Delivery Sent', label: 'Delivery Sent', count: countInTransit },
          { id: 'Completed', label: 'Completed', count: countCompleted },
          { id: 'Cancelled', label: 'Cancelled', count: countCancelled }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* 4. Orders List Cards matching Figma Node 26759:87848 */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            No orders found under "{activeTab}".
          </div>
        ) : (
          filteredOrders.map((order) => {
            return (
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

                    {/* Blue/Grey New Badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                      New
                    </span>

                    {/* Specific Status Capsule */}
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
                        onClick={() => handleAcceptOrder(order.id)}
                        className="px-5 py-2 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                      >
                        Accept
                      </button>
                    )}

                    {order.status === 'Processing' && (
                      <button
                        type="button"
                        onClick={() => handleMarkDeliverySent(order.id)}
                        className="px-5 py-2 rounded-xl bg-[#47559E] hover:bg-[#3D4988] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
                      >
                        Mark as Delivery sent
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setCurrentView('detail');
                      }}
                      className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
