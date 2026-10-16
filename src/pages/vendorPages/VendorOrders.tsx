import { useState } from 'react';
import { 
  VendorManageDeliveryView, 
  VendorOrderDetailView, 
  VendorOrdersListView 
} from '../../components/vendorComponents/orders';

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

  // Delivery Fee configuration state
  const [baseFee, setBaseFee] = useState('15.00');
  const [ratePerKm, setRatePerKm] = useState('2.50');
  const [minDistance, setMinDistance] = useState('2.50');
  const [deliverySavedNotice, setDeliverySavedNotice] = useState(false);

  // Orders list
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
        { name: 'Pure Oat Cereal 200g', qty: 2, unitPrice: '£4.20', totalPrice: 'AED 20.00' }
      ],
      subtotal: 'AED 34.00',
      deliveryFee: 'AED 13.98',
      discount: 'AED 0.00',
      noteFromParent: "Ring doorbell twice upon arrival.",
      confirmationRecipient: 'Priya Nair'
    },
    {
      id: 'ORD-20148',
      status: 'Completed',
      totalAmount: 'AED 47.98',
      customerName: 'Emily Hartley',
      customerAddress: 'Hare street, Abu Dhabi, Dubai',
      customerPhone: '+1 (234) 567-890',
      dateTime: '20 Aug 2026, 14:30',
      items: [
        { name: 'Baby Organic Yogurt', qty: 4, unitPrice: '£3.50', totalPrice: 'AED 14.00' }
      ],
      subtotal: 'AED 14.00',
      deliveryFee: 'AED 10.00',
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
      dateTime: '19 Aug 2026, 11:20',
      items: [
        { name: 'Organic Puree Pouch (Apple)', qty: 6, unitPrice: '£2.00', totalPrice: 'AED 28.00' }
      ],
      subtotal: 'AED 28.00',
      deliveryFee: 'AED 10.00',
      discount: 'AED 0.00'
    }
  ]);

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

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

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
  if (currentView === 'detail') {
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
