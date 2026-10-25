import { useState, useMemo } from 'react';
import { 
  VendorOrderDetailView, 
  VendorOrdersListView 
} from '../../components/vendorComponents/orders';
import { useAppSelector } from '../../redux';
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useRestoreOrderMutation,
} from '../../redux/feature/orders/ordersApi';
import { Loader2 } from 'lucide-react';

export type OrderStatus = 'New' | 'Processing' | 'Delivery Sent' | 'Completed' | 'Cancelled';

export interface OrderItemProduct {
  name: string;
  qty: number;
  unitPrice: string;
  totalPrice: string;
}

export interface VendorOrder {
  id: string;
  orderNumber?: string;
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
  courierName?: string;
  trackingNumber?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

function mapBackendStatusToVendorStatus(status: string): OrderStatus {
  const s = (status || '').toLowerCase();
  if (s === 'processing' || s === 'confirmed') return 'Processing';
  if (s === 'delivery sent' || s === 'delivery_sent' || s === 'shipped' || s === 'in transit') return 'Delivery Sent';
  if (s === 'completed' || s === 'delivered') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  return 'New';
}

export const VendorOrders = () => {
  // Navigation views: 'list' | 'detail'
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'All' | OrderStatus | 'Archived'>('All');

  // Current logged in vendor profile
  const { user } = useAppSelector((state) => state.auth);
  const vendorId = user?.vendorProfile?.id;

  // Fetch real orders from backend (including soft-deleted for full control)
  const { data: ordersResponse, isLoading } = useGetOrdersQuery(
    vendorId
      ? { vendorId, limit: 200, includeDeleted: 'true' }
      : { limit: 200, includeDeleted: 'true' },
    { refetchOnMountOrArgChange: true }
  );

  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();
  const [deleteOrderMutation] = useDeleteOrderMutation();
  const [restoreOrderMutation] = useRestoreOrderMutation();

  const rawOrders = ordersResponse?.data?.orders || [];

  // Map backend orders to VendorOrder format
  const orders: VendorOrder[] = useMemo(() => {
    return rawOrders.map((o) => {
      // If vendorId is present, filter items for this vendor; otherwise show all order items
      const vendorItems = vendorId
        ? (o.items || []).filter((it) => it.vendorId === vendorId)
        : (o.items || []);
      const itemsToUse = vendorItems.length > 0 ? vendorItems : (o.items || []);

      const vendorSubtotal = itemsToUse.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const vendorDelivery = itemsToUse.reduce((max, it) => Math.max(max, it.deliveryCharge || 0), 0);
      const calculatedTotal = vendorSubtotal + vendorDelivery;

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        status: mapBackendStatusToVendorStatus(o.status),
        hasActionNeeded: !o.isDeleted && (o.status === 'pending' || o.status === 'confirmed'),
        totalAmount: `৳${(o.total || calculatedTotal).toFixed(2)}`,
        customerName: o.customerName || 'Agri Customer',
        customerAddress: `${o.deliveryAddress || ''}${o.city ? ', ' + o.city : ''}${o.district ? ', ' + o.district : ''}`,
        customerPhone: o.customerPhone || 'N/A',
        dateTime: o.orderDate || (o.createdAt ? new Date(o.createdAt).toLocaleString('en-GB') : 'Just now'),
        items: itemsToUse.map((it) => ({
          name: it.productName,
          qty: it.quantity,
          unitPrice: `৳${it.price.toFixed(2)}`,
          totalPrice: `৳${(it.price * it.quantity).toFixed(2)}`,
        })),
        subtotal: `৳${(o.subtotal || vendorSubtotal).toFixed(2)}`,
        deliveryFee: `৳${(o.deliveryFee || vendorDelivery).toFixed(2)}`,
        discount: `৳${(o.discount || 0).toFixed(2)}`,
        noteFromParent: o.notes || undefined,
        confirmationRecipient: o.customerName,
        courierName: o.courierName || undefined,
        trackingNumber: o.trackingNumber || undefined,
        isDeleted: Boolean(o.isDeleted),
        deletedAt: o.deletedAt || null,
      };
    });
  }, [rawOrders, vendorId]);

  // Actions
  const handleAcceptOrder = async (orderId: string) => {
    try {
      await updateOrderStatusMutation({ id: orderId, status: 'Processing' }).unwrap();
    } catch (err) {
      console.error('Failed to accept order:', err);
    }
  };

  const handleMarkDeliverySent = async (
    orderId: string,
    courierName?: string,
    trackingNumber?: string
  ) => {
    try {
      await updateOrderStatusMutation({
        id: orderId,
        status: 'Delivery Sent',
        courierName,
        trackingNumber,
      }).unwrap();
    } catch (err) {
      console.error('Failed to mark delivery sent:', err);
    }
  };

  const handleMarkCompleted = async (orderId: string) => {
    try {
      await updateOrderStatusMutation({ id: orderId, status: 'Completed' }).unwrap();
    } catch (err) {
      console.error('Failed to mark completed:', err);
    }
  };

  const handleChangeStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusMutation({ id: orderId, status }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Archive Order (Always Soft Delete for vendor to preserve data & metrics)
  const handleDeleteOrder = async (orderId: string, _mode: 'soft' | 'hard' = 'soft') => {
    try {
      await deleteOrderMutation({ id: orderId, mode: 'soft' }).unwrap();
      if (currentView === 'detail' && selectedOrderId === orderId) {
        setCurrentView('list');
      }
    } catch (err) {
      console.error('Failed to archive order:', err);
      throw err;
    }
  };

  // Restore Order
  const handleRestoreOrder = async (orderId: string) => {
    try {
      await restoreOrderMutation(orderId).unwrap();
    } catch (err) {
      console.error('Failed to restore order:', err);
      throw err;
    }
  };

  // Active (non-deleted) orders for primary metric cards
  const activeOrders = useMemo(() => orders.filter((o) => !o.isDeleted), [orders]);

  // Counts for Metric Cards & Filter Tabs
  const countNew = activeOrders.filter((o) => o.status === 'New').length;
  const countProcessing = activeOrders.filter((o) => o.status === 'Processing').length;
  const countInTransit = activeOrders.filter((o) => o.status === 'Delivery Sent').length;
  const countCompleted = activeOrders.filter((o) => o.status === 'Completed').length;
  const countCancelled = activeOrders.filter((o) => o.status === 'Cancelled').length;
  const countArchived = orders.filter((o) => o.isDeleted).length;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-['Inter']">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium">Loading vendor supply orders...</p>
      </div>
    );
  }

  // VIEW 1: ORDER DETAIL VIEW
  if (currentView === 'detail' && selectedOrder) {
    return (
      <VendorOrderDetailView
        order={selectedOrder}
        onBack={() => setCurrentView('list')}
        onAcceptOrder={handleAcceptOrder}
        onMarkDeliverySent={handleMarkDeliverySent}
        onMarkCompleted={handleMarkCompleted}
        onChangeStatus={handleChangeStatus}
        onDeleteOrder={handleDeleteOrder}
        onRestoreOrder={handleRestoreOrder}
      />
    );
  }

  // VIEW 2: MAIN ORDERS LIST VIEW
  return (
    <VendorOrdersListView
      orders={orders}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      countNew={countNew}
      countProcessing={countProcessing}
      countInTransit={countInTransit}
      countCompleted={countCompleted}
      countCancelled={countCancelled}
      countArchived={countArchived}
      onSelectOrder={(id) => {
        setSelectedOrderId(id);
        setCurrentView('detail');
      }}
      onAcceptOrder={handleAcceptOrder}
      onMarkDeliverySent={handleMarkDeliverySent}
      onMarkCompleted={handleMarkCompleted}
      onDeleteOrder={handleDeleteOrder}
      onRestoreOrder={handleRestoreOrder}
    />
  );
};

export default VendorOrders;
