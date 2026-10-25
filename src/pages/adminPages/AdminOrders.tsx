import { useState, useMemo } from 'react';
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation 
} from '../../redux/feature/orders/ordersApi';
import { AdminOrdersListView } from '../../components/adminComponents/orders/AdminOrdersListView';
import { AdminOrderDetailView } from '../../components/adminComponents/orders/AdminOrderDetailView';
import { OrdersModals } from '../../components/adminComponents/orders/OrdersModals';
import { Loader2 } from 'lucide-react';
import type { OrderRecord } from '../../redux/feature/orders/ordersType';

export type OrderStatus = 'New' | 'Processing' | 'Delivery Sent' | 'Completed' | 'Cancelled';

export interface OrderItemProduct {
  id?: string;
  name: string;
  qty: number;
  unitPrice: string;
  totalPrice: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  avatarColor: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: OrderStatus;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  hasActionNeeded?: boolean;
  totalAmount: string;
  rawTotal: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail?: string;
  dateTime: string;
  items: OrderItemProduct[];
  subtotal: string;
  deliveryFee: string;
  discount: string;
  noteFromParent?: string;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  paymentStatus: string;
}

function mapBackendStatusToAdminStatus(status: string): OrderStatus {
  const s = (status || '').toLowerCase();
  if (s === 'processing' || s === 'confirmed') return 'Processing';
  if (s === 'delivery sent' || s === 'delivery_sent' || s === 'shipped' || s === 'in transit') return 'Delivery Sent';
  if (s === 'completed' || s === 'delivered') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  return 'New';
}

export const AdminOrders = () => {
  // Navigation views: 'list' | 'detail'
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'All' | OrderStatus>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal states for delete confirmation & editing
  const [orderToDelete, setOrderToDelete] = useState<AdminOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Real backend query for all orders across the system
  const { data: ordersResponse, isLoading } = useGetOrdersQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: true }
  );

  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();
  const [deleteOrderMutation] = useDeleteOrderMutation();

  const rawOrders: OrderRecord[] = ordersResponse?.data?.orders || [];

  // Map backend orders to unified AdminOrder format
  const orders: AdminOrder[] = useMemo(() => {
    return rawOrders.map((o) => {
      const subtotalNum = Number(o.subtotal) || 0;
      const deliveryNum = Number(o.deliveryFee) || 0;
      const discountNum = Number(o.discount) || 0;
      const totalNum = Number(o.total) || subtotalNum + deliveryNum - discountNum;

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        status: mapBackendStatusToAdminStatus(o.status),
        hasActionNeeded: o.status === 'pending' || o.status === 'confirmed',
        totalAmount: `৳${totalNum.toFixed(2)}`,
        rawTotal: totalNum,
        customerName: o.customerName || 'Agri Customer',
        customerAddress: `${o.deliveryAddress || ''}${o.city ? ', ' + o.city : ''}${o.district ? ', ' + o.district : ''}`,
        customerPhone: o.customerPhone || 'N/A',
        customerEmail: o.customerEmail || undefined,
        dateTime: o.orderDate || (o.createdAt ? new Date(o.createdAt).toLocaleString('en-GB') : 'Just now'),
        items: (o.items || []).map((it) => ({
          id: it.id,
          name: it.productName,
          qty: it.quantity,
          unitPrice: `৳${Number(it.price).toFixed(2)}`,
          totalPrice: `৳${(Number(it.price) * Number(it.quantity)).toFixed(2)}`,
        })),
        subtotal: `৳${subtotalNum.toFixed(2)}`,
        deliveryFee: `৳${deliveryNum.toFixed(2)}`,
        discount: `৳${discountNum.toFixed(2)}`,
        noteFromParent: o.notes || undefined,
        courierName: o.courierName || undefined,
        trackingNumber: o.trackingNumber || undefined,
        estimatedDelivery: o.estimatedDelivery || undefined,
        paymentMethod: o.paymentMethod || 'Cash on Delivery',
        paymentStatus: o.paymentStatus || 'Pending',
      };
    });
  }, [rawOrders]);

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
        trackingNumber
      }).unwrap();
    } catch (err) {
      console.error('Failed to mark delivery sent:', err);
    }
  };

  const handleMarkCompleted = async (orderId: string) => {
    try {
      await updateOrderStatusMutation({ 
        id: orderId, 
        status: 'Completed',
        paymentStatus: 'SUCCEEDED'
      }).unwrap();
    } catch (err) {
      console.error('Failed to mark order completed:', err);
    }
  };

  const handleChangeStatus = async (orderId: string, status: string) => {
    let backendStatus = 'PENDING';
    if (status === 'Processing') backendStatus = 'PROCESSING';
    if (status === 'Delivery Sent') backendStatus = 'SHIPPED';
    if (status === 'Completed') backendStatus = 'DELIVERED';
    if (status === 'Cancelled') backendStatus = 'CANCELLED';

    try {
      await updateOrderStatusMutation({ id: orderId, status: backendStatus }).unwrap();
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrderMutation({ id: orderToDelete.id, mode: 'hard' }).unwrap();
      if (selectedOrderId === orderToDelete.id) {
        setCurrentView('list');
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    } finally {
      setOrderToDelete(null);
    }
  };

  // Counts for Metric Cards & Filter Tabs
  const countNew = orders.filter((o) => o.status === 'New').length;
  const countProcessing = orders.filter((o) => o.status === 'Processing').length;
  const countInTransit = orders.filter((o) => o.status === 'Delivery Sent').length;
  const countCompleted = orders.filter((o) => o.status === 'Completed').length;
  const countCancelled = orders.filter((o) => o.status === 'Cancelled').length;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-['Inter']">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium">Loading marketplace orders...</p>
      </div>
    );
  }

  // VIEW 1: ORDER DETAIL VIEW (Dedicated Full-Page View matching Vendor)
  if (currentView === 'detail' && selectedOrder) {
    return (
      <>
        <AdminOrderDetailView
          order={selectedOrder}
          onBack={() => setCurrentView('list')}
          onAcceptOrder={handleAcceptOrder}
          onMarkDeliverySent={handleMarkDeliverySent}
          onMarkCompleted={handleMarkCompleted}
          onChangeStatus={handleChangeStatus}
          onDelete={(o) => setOrderToDelete(o)}
        />

        {/* Delete Confirmation Modal */}
        <OrdersModals
          viewingOrder={null}
          setViewingOrder={() => {}}
          editingOrder={null}
          setEditingOrder={() => {}}
          handleSaveEdit={async () => {}}
          orderToHold={null}
          setOrderToHold={() => {}}
          handleToggleHold={async () => {}}
          orderToDelete={orderToDelete ? ({
            id: orderToDelete.id,
            orderNumber: orderToDelete.orderNumber || orderToDelete.id,
            customerName: orderToDelete.customerName,
          } as any) : null}
          setOrderToDelete={(o) => setOrderToDelete(o ? orderToDelete : null)}
          handleConfirmDelete={handleConfirmDelete}
        />
      </>
    );
  }

  // VIEW 2: MAIN ORDERS LIST VIEW (Matching Vendor Orders design)
  return (
    <>
      <AdminOrdersListView
        orders={orders}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        countNew={countNew}
        countProcessing={countProcessing}
        countInTransit={countInTransit}
        countCompleted={countCompleted}
        countCancelled={countCancelled}
        onSelectOrder={(id) => {
          setSelectedOrderId(id);
          setCurrentView('detail');
        }}
        onAcceptOrder={handleAcceptOrder}
        onMarkDeliverySent={handleMarkDeliverySent}
        onMarkCompleted={handleMarkCompleted}
        onDeleteOrder={(o) => setOrderToDelete(o)}
      />

      {/* Delete Confirmation Modal */}
      <OrdersModals
        viewingOrder={null}
        setViewingOrder={() => {}}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        handleSaveEdit={async (e) => {
          e.preventDefault();
          if (!editingOrder) return;
          try {
            await updateOrderStatusMutation({
              id: editingOrder.id,
              status: editingOrder.status,
              courierName: editingOrder.carrier,
              trackingNumber: editingOrder.trackingNumber,
            }).unwrap();
          } finally {
            setEditingOrder(null);
          }
        }}
        orderToHold={null}
        setOrderToHold={() => {}}
        handleToggleHold={async () => {}}
        orderToDelete={orderToDelete ? ({
          id: orderToDelete.id,
          orderNumber: orderToDelete.orderNumber || orderToDelete.id,
          customerName: orderToDelete.customerName,
        } as any) : null}
        setOrderToDelete={(o) => setOrderToDelete(o ? orderToDelete : null)}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default AdminOrders;
