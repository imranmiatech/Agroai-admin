import { useState, useMemo } from 'react';
import { 
  VendorManageDeliveryView, 
  VendorOrderDetailView, 
  VendorOrdersListView 
} from '../../components/vendorComponents/orders';
import { useAppSelector } from '../../redux';
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation 
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
}

function mapBackendStatusToVendorStatus(status: string): OrderStatus {
  const s = (status || '').toLowerCase();
  if (s === 'processing') return 'Processing';
  if (s === 'shipped') return 'Delivery Sent';
  if (s === 'delivered') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'New'; // 'pending' or 'confirmed'
}

export const VendorOrders = () => {
  // Navigation views: 'list' | 'detail' | 'manage_delivery'
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'manage_delivery'>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'All' | OrderStatus>('All');

  // Delivery Fee configuration state
  const [baseFee, setBaseFee] = useState('0.00');
  const [ratePerKm, setRatePerKm] = useState('2.50');
  const [minDistance, setMinDistance] = useState('2.50');
  const [deliverySavedNotice, setDeliverySavedNotice] = useState(false);

  // Current logged in vendor profile
  const { user } = useAppSelector((state) => state.auth);
  const vendorId = user?.vendorProfile?.id;

  // Fetch real orders from backend
  const { data: ordersResponse, isLoading } = useGetOrdersQuery(
    vendorId ? { vendorId, limit: 100 } : { limit: 100 },
    { refetchOnMountOrArgChange: true }
  );

  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();

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
        hasActionNeeded: o.status === 'pending' || o.status === 'confirmed',
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
      };
    });
  }, [rawOrders, vendorId]);

  // Actions
  const handleAcceptOrder = async (orderId: string) => {
    try {
      await updateOrderStatusMutation({ id: orderId, status: 'PROCESSING' }).unwrap();
    } catch (err) {
      console.error('Failed to accept order:', err);
    }
  };

  const handleMarkDeliverySent = async (orderId: string) => {
    try {
      await updateOrderStatusMutation({ id: orderId, status: 'SHIPPED' }).unwrap();
    } catch (err) {
      console.error('Failed to mark delivery sent:', err);
    }
  };

  const handleSaveDeliveryFee = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliverySavedNotice(true);
    setTimeout(() => setDeliverySavedNotice(false), 3000);
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
        <p className="text-sm font-medium">Loading vendor supply orders...</p>
      </div>
    );
  }

  // VIEW 1: MANAGE DELIVERY FEE
  if (currentView === 'manage_delivery') {
    return (
      <VendorManageDeliveryView
        onBack={() => setCurrentView('list')}
        baseFee={baseFee}
        setBaseFee={setBaseFee}
        ratePerKm={ratePerKm}
        setRatePerKm={setRatePerKm}
        minDistance={minDistance}
        setMinDistance={setMinDistance}
        deliverySavedNotice={deliverySavedNotice}
        handleSaveDeliveryFee={handleSaveDeliveryFee}
      />
    );
  }

  // VIEW 2: ORDER DETAIL VIEW
  if (currentView === 'detail' && selectedOrder) {
    return (
      <VendorOrderDetailView
        order={selectedOrder}
        onBack={() => setCurrentView('list')}
        onAcceptOrder={handleAcceptOrder}
        onMarkDeliverySent={handleMarkDeliverySent}
      />
    );
  }

  // VIEW 3: MAIN ORDERS LIST VIEW
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
      onOpenManageDelivery={() => setCurrentView('manage_delivery')}
      onSelectOrder={(id) => {
        setSelectedOrderId(id);
        setCurrentView('detail');
      }}
      onAcceptOrder={handleAcceptOrder}
      onMarkDeliverySent={handleMarkDeliverySent}
    />
  );
};

export default VendorOrders;
