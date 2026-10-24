import { Edit3, Ban, Trash2, X, MapPin, Truck } from 'lucide-react';
import type { OrderItem } from '../../../pages/adminPages/AdminOrders';

interface OrdersModalsProps {
  viewingOrder: OrderItem | null;
  setViewingOrder: (o: OrderItem | null) => void;
  editingOrder: OrderItem | null;
  setEditingOrder: (o: OrderItem | null) => void;
  handleSaveEdit: (e: React.FormEvent) => void;
  orderToHold: OrderItem | null;
  setOrderToHold: (o: OrderItem | null) => void;
  handleToggleHold: (o: OrderItem) => void;
  orderToDelete: OrderItem | null;
  setOrderToDelete: (o: OrderItem | null) => void;
  handleConfirmDelete: () => void;
}

export const OrdersModals: React.FC<OrdersModalsProps> = ({
  viewingOrder,
  setViewingOrder,
  editingOrder,
  setEditingOrder,
  handleSaveEdit,
  orderToHold,
  setOrderToHold,
  handleToggleHold,
  orderToDelete,
  setOrderToDelete,
  handleConfirmDelete
}) => {
  return (
    <>
      {/* MODAL 1: VIEW ORDER RECEIPT & DETAILS */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs text-white font-bold"
                  style={{ backgroundColor: viewingOrder.avatarColor }}
                >
                  {viewingOrder.customerInitials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {viewingOrder.orderNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{viewingOrder.customerName}</span>
                    <span>·</span>
                    <span>{viewingOrder.date}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Items Table */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Ordered Items</span>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 flex flex-col gap-2">
                {viewingOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/50 last:border-none">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                        {item.qty}x
                      </span>
                      <span className="font-medium text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="text-sm text-[#062E35]">€{viewingOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {viewingOrder.shippingAddress}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tracking & Fulfillment</span>
                </div>
                <p className="text-slate-800 font-medium">
                  {viewingOrder.carrier || 'Standard Courier'}
                </p>
                <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                  {viewingOrder.trackingNumber || 'Tracking ID Pending'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingOrder;
                  setViewingOrder(null);
                  setEditingOrder({ ...toEdit });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Update Status
              </button>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#062E35] text-white text-xs font-semibold hover:bg-[#0A434D] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ORDER / UPDATE STATUS */}
      {editingOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Update Order</h3>
                  <p className="text-xs text-slate-400 font-mono">{editingOrder.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Order Status:
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivery Sent">Delivery Sent</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Carrier Name:
                  </label>
                  <input
                    type="text"
                    value={editingOrder.carrier || ''}
                    placeholder="e.g. DPD Express"
                    onChange={(e) => setEditingOrder({ ...editingOrder, carrier: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tracking Number:
                  </label>
                  <input
                    type="text"
                    value={editingOrder.trackingNumber || ''}
                    placeholder="e.g. DPD-IE-892144"
                    onChange={(e) => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Shipping Address:
                </label>
                <textarea
                  rows={2}
                  value={editingOrder.shippingAddress}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shippingAddress: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: HOLD / SUSPEND CONFIRMATION */}
      {orderToHold && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5 shrink-0">
              <Ban className="w-6 h-6 text-purple-600" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {(orderToHold.status as any) === 'On Hold' ? 'Release Order Hold?' : 'Place Order on Hold?'}
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              {(orderToHold.status as any) === 'On Hold'
                ? `Order #${orderToHold.orderNumber} will be resumed for fulfillment.`
                : `Placing #${orderToHold.orderNumber} on hold will pause dispatch until verification completes.`}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setOrderToHold(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleToggleHold(orderToHold)}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: (orderToHold.status as any) === 'On Hold' ? '#062E35' : '#7C3AED',
                  borderRadius: '16px' 
                }}
              >
                {(orderToHold.status as any) === 'On Hold' ? 'Release Hold' : 'Confirm Hold'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FIGMA DELETE CONFIRMATION MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete Order?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete order <span className="font-semibold text-slate-700">#{orderToDelete.orderNumber}</span> for {orderToDelete.customerName}? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ borderRadius: '16px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: '#B42318', 
                  borderRadius: '16px' 
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
