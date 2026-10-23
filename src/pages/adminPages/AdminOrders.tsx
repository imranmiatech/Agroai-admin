import { useState, useMemo } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { 
  OrdersMetricsGrid, 
  OrdersFilters, 
  OrdersTable, 
  OrdersModals 
} from '../../components/adminComponents/orders';
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation 
} from '../../redux/feature/orders/ordersApi';
import type { OrderRecord } from '../../redux/feature/orders/ordersType';

export type OrderStatus = 'Processing' | 'In Transit' | 'Delivered' | 'On Hold' | 'Cancelled';

export interface OrderProduct {
  name: string;
  qty: number;
  price: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  avatarColor: string;
  items: OrderProduct[];
  totalAmount: number;
  paymentMethod: 'Stripe' | 'Apple Pay' | 'Credit Card' | 'PayPal' | string;
  date: string;
  status: OrderStatus;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
}

const AVATAR_COLORS = [
  '#062E35', '#0E7A6B', '#2563EB', '#D97706', '#4F46E5', '#DC2626', '#059669', '#7C3AED'
];

function getInitials(name: string): string {
  if (!name) return 'CU';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function mapBackendStatusToAdminStatus(status: string): OrderStatus {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 'Delivered';
  if (s === 'shipped') return 'In Transit';
  if (s === 'cancelled') return 'Cancelled';
  if (s === 'on hold') return 'On Hold';
  return 'Processing'; // 'pending', 'confirmed', 'processing'
}

function mapAdminStatusToBackend(status: OrderStatus): string {
  if (status === 'Delivered') return 'DELIVERED';
  if (status === 'In Transit') return 'SHIPPED';
  if (status === 'Cancelled') return 'CANCELLED';
  if (status === 'On Hold') return 'PENDING';
  return 'PROCESSING';
}

export const AdminOrders = () => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Real API integration
  const { data: ordersResponse, isLoading } = useGetOrdersQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: true }
  );

  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();
  const [deleteOrderMutation] = useDeleteOrderMutation();

  const rawOrders: OrderRecord[] = ordersResponse?.data?.orders || [];

  // Map backend orders to OrderItem format
  const orders: OrderItem[] = useMemo(() => {
    return rawOrders.map((o, idx) => {
      const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
      const initials = getInitials(o.customerName);

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName || 'Customer',
        customerEmail: o.customerEmail || '',
        customerInitials: initials,
        avatarColor: color,
        items: (o.items || []).map((it) => ({
          name: it.productName,
          qty: it.quantity,
          price: it.price,
        })),
        totalAmount: Number(o.total) || 0,
        paymentMethod: o.paymentMethod || 'Cash on Delivery',
        date: o.orderDate || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Today'),
        status: mapBackendStatusToAdminStatus(o.status),
        shippingAddress: `${o.deliveryAddress || ''}${o.city ? ', ' + o.city : ''}${o.district ? ', ' + o.district : ''}`,
        trackingNumber: o.trackingNumber || undefined,
        carrier: o.courierName || undefined,
      };
    });
  }, [rawOrders]);

  // Modals
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [orderToHold, setOrderToHold] = useState<OrderItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);

  // Dynamic counts for top cards
  const totalOrdersCount = orders.length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const inTransitCount = orders.filter((o) => o.status === 'In Transit').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.customerEmail.toLowerCase().includes(term) ||
      order.items.some((i) => i.name.toLowerCase().includes(term));
    const matchesStatus =
      selectedStatusTab === 'All' || order.status === selectedStatusTab;
    return matchesSearch && matchesStatus;
  });

  // Pagination slicing
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Status toggle (Hold / Release)
  const handleToggleHold = async (order: OrderItem) => {
    const nextAdminStatus: OrderStatus = order.status === 'On Hold' ? 'Processing' : 'On Hold';
    const backendStatus = mapAdminStatusToBackend(nextAdminStatus);
    try {
      await updateOrderStatusMutation({
        id: order.id,
        status: backendStatus,
      }).unwrap();
    } catch (err) {
      console.error('Failed to toggle order hold status:', err);
    }
    setOrderToHold(null);
  };

  // Delete / Cancel order
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrderMutation(orderToDelete.id).unwrap();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
    setOrderToDelete(null);
  };

  // Save edit order
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await updateOrderStatusMutation({
        id: editingOrder.id,
        status: mapAdminStatusToBackend(editingOrder.status),
        courierName: editingOrder.carrier,
        trackingNumber: editingOrder.trackingNumber,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
    setEditingOrder(null);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-['Inter']">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium">Loading all system orders...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Header Section */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review customer purchases, marketplace shipments, and transaction fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const csv = orders
              .map((o) => `${o.orderNumber},"${o.customerName}",${o.totalAmount},${o.status},"${o.date}"`)
              .join('\n');
            const blob = new Blob(
              [`OrderNumber,Customer,Amount,Status,Date\n${csv}`],
              { type: 'text/csv' }
            );
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'krishikunjo_all_orders.csv';
            a.click();
          }}
          className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4 text-slate-700" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <OrdersMetricsGrid
        totalOrdersCount={totalOrdersCount}
        processingCount={processingCount}
        inTransitCount={inTransitCount}
        deliveredCount={deliveredCount}
      />

      {/* 3. Filter Bar (Search + Status Capsule Tabs) */}
      <OrdersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatusTab={selectedStatusTab}
        setSelectedStatusTab={setSelectedStatusTab}
        onFilterChange={() => setCurrentPage(1)}
      />

      {/* 4. Orders Table Container */}
      <OrdersTable
        orders={currentOrders}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalFiltered={filteredOrders.length}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onView={(o) => setViewingOrder(o)}
        onEdit={(o) => setEditingOrder(o)}
        onHold={(o) => setOrderToHold(o)}
        onDelete={(o) => setOrderToDelete(o)}
      />

      {/* 5. Modals (View, Edit, Hold, Delete) */}
      <OrdersModals
        viewingOrder={viewingOrder}
        setViewingOrder={setViewingOrder}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        handleSaveEdit={handleSaveEdit}
        orderToHold={orderToHold}
        setOrderToHold={setOrderToHold}
        handleToggleHold={handleToggleHold}
        orderToDelete={orderToDelete}
        setOrderToDelete={setOrderToDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminOrders;
