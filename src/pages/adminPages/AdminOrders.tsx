import { useState } from 'react';
import { Download } from 'lucide-react';
import { 
  OrdersMetricsGrid, 
  OrdersFilters, 
  OrdersTable, 
  OrdersModals 
} from '../../components/adminComponents/orders';

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
  paymentMethod: 'Stripe' | 'Apple Pay' | 'Credit Card' | 'PayPal';
  date: string;
  status: OrderStatus;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
}

export const AdminOrders = () => {
  // 24 realistic orders for multi-page pagination demo
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ord-01',
      orderNumber: 'ORD-99824',
      customerName: 'Sarah O’Brien',
      customerEmail: 'sarah.ahmed@gmail.com',
      customerInitials: 'SO',
      avatarColor: '#062E35',
      items: [
        { name: 'Organic Bamboo Baby Swaddle Wraps', qty: 2, price: 28.50 },
        { name: 'Natural Chamomile Baby Balm', qty: 1, price: 14.50 }
      ],
      totalAmount: 71.50,
      paymentMethod: 'Stripe',
      date: 'Oct 15, 2026',
      status: 'Processing',
      shippingAddress: '42 Fitzwilliam Square, Dublin 2, D02 X285',
      trackingNumber: 'DPD-IE-892144',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-02',
      orderNumber: 'ORD-99823',
      customerName: 'Liam O’Connor',
      customerEmail: 'liam.oc@outlook.ie',
      customerInitials: 'LO',
      avatarColor: '#0E7A6B',
      items: [
        { name: 'Smart HD WiFi Baby Monitor with Night Vision', qty: 1, price: 139.99 }
      ],
      totalAmount: 139.99,
      paymentMethod: 'Apple Pay',
      date: 'Oct 15, 2026',
      status: 'In Transit',
      shippingAddress: '15 Highfield Road, Rathgar, Dublin 6',
      trackingNumber: 'ANP-8841920',
      carrier: 'An Post'
    },
    {
      id: 'ord-03',
      orderNumber: 'ORD-99822',
      customerName: 'Emma Watson',
      customerEmail: 'emma.watson@caregroup.ie',
      customerInitials: 'EW',
      avatarColor: '#4F46E5',
      items: [
        { name: 'Montessori Wooden Sensory Stacking Blocks', qty: 1, price: 34.00 },
        { name: 'Hand-Knitted Cotton Teething Rattle', qty: 2, price: 16.00 }
      ],
      totalAmount: 66.00,
      paymentMethod: 'Credit Card',
      date: 'Oct 14, 2026',
      status: 'Delivered',
      shippingAddress: '88 Clontarf Road, Dublin 3',
      trackingNumber: 'DHL-EU-992102',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-04',
      orderNumber: 'ORD-99821',
      customerName: 'Jack Reynolds',
      customerEmail: 'jack.reynolds@yahoo.com',
      customerInitials: 'JR',
      avatarColor: '#D97706',
      items: [
        { name: 'Convertible Wooden Crib & Toddler Bed 3-in-1', qty: 1, price: 320.00 }
      ],
      totalAmount: 320.00,
      paymentMethod: 'Stripe',
      date: 'Oct 14, 2026',
      status: 'In Transit',
      shippingAddress: '34 Castleknock Wood, Dublin 15',
      trackingNumber: 'DPD-IE-332918',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-05',
      orderNumber: 'ORD-99820',
      customerName: 'Chloe Gallagher',
      customerEmail: 'chloe.g@gmail.com',
      customerInitials: 'CG',
      avatarColor: '#DC2626',
      items: [
        { name: 'Anti-Colic Glass Baby Bottles Duo', qty: 2, price: 32.50 },
        { name: 'Organic Silicone Baby Feeding Set', qty: 1, price: 24.99 }
      ],
      totalAmount: 89.99,
      paymentMethod: 'PayPal',
      date: 'Oct 13, 2026',
      status: 'Processing',
      shippingAddress: '12 Pembroke Street Upper, Dublin 2'
    },
    {
      id: 'ord-06',
      orderNumber: 'ORD-99819',
      customerName: 'David Kelly',
      customerEmail: 'david.kelly@lifestyle.ie',
      customerInitials: 'DK',
      avatarColor: '#059669',
      items: [
        { name: 'Natural Baby Multivitamin Liquid Drops 50ml', qty: 3, price: 18.75 }
      ],
      totalAmount: 56.25,
      paymentMethod: 'Credit Card',
      date: 'Oct 13, 2026',
      status: 'Delivered',
      shippingAddress: '5 The Crescent, Malahide, Co. Dublin',
      trackingNumber: 'ANP-9912034',
      carrier: 'An Post'
    },
    {
      id: 'ord-07',
      orderNumber: 'ORD-99818',
      customerName: 'Aoife Maguire',
      customerEmail: 'aoife.maguire@krisikunjo.com',
      customerInitials: 'AM',
      avatarColor: '#2563EB',
      items: [
        { name: 'Calming Chamomile & Oat Baby Wash & Shampoo', qty: 2, price: 16.50 },
        { name: 'Zinc Oxide Diaper Rash Barrier Cream', qty: 2, price: 11.50 }
      ],
      totalAmount: 56.00,
      paymentMethod: 'Apple Pay',
      date: 'Oct 12, 2026',
      status: 'Delivered',
      shippingAddress: '97 Sandymount Road, Dublin 4',
      trackingNumber: 'DHL-EU-448102',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-08',
      orderNumber: 'ORD-99817',
      customerName: 'Conor Fitzpatrick',
      customerEmail: 'conor.fitz@fitzgerald.ie',
      customerInitials: 'CF',
      avatarColor: '#9333EA',
      items: [
        { name: 'Auto-Close Extra Wide Baby Safety Gate', qty: 1, price: 79.99 }
      ],
      totalAmount: 79.99,
      paymentMethod: 'Stripe',
      date: 'Oct 12, 2026',
      status: 'On Hold',
      shippingAddress: '6 Strand Road, Bray, Co. Wicklow'
    },
    {
      id: 'ord-09',
      orderNumber: 'ORD-99816',
      customerName: 'Grainne Murphy',
      customerEmail: 'grainne.m@healthmail.ie',
      customerInitials: 'GM',
      avatarColor: '#062E35',
      items: [
        { name: 'Breathable Dual-Sided Crib Mattress', qty: 1, price: 189.00 }
      ],
      totalAmount: 189.00,
      paymentMethod: 'Credit Card',
      date: 'Oct 11, 2026',
      status: 'In Transit',
      shippingAddress: '23 Churchtown Rise, Churchtown, Dublin 14',
      trackingNumber: 'DPD-IE-661203',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-10',
      orderNumber: 'ORD-99815',
      customerName: 'Niall Kavanagh',
      customerEmail: 'niall.kavanagh@purebotanica.io',
      customerInitials: 'NK',
      avatarColor: '#0E7A6B',
      items: [
        { name: 'Organic Prune & Apple Gentle Digest Puree Pouch', qty: 12, price: 3.20 }
      ],
      totalAmount: 38.40,
      paymentMethod: 'Stripe',
      date: 'Oct 11, 2026',
      status: 'Processing',
      shippingAddress: '14 Rathmines Park, Rathmines, Dublin 6'
    },
    {
      id: 'ord-11',
      orderNumber: 'ORD-99814',
      customerName: 'Roisin Egan',
      customerEmail: 'roisin.egan@dublin.com',
      customerInitials: 'RE',
      avatarColor: '#4F46E5',
      items: [
        { name: 'Electric Gentle Baby Nail Trimmer with LED', qty: 1, price: 22.00 },
        { name: 'Corner & Edge Proofing Foam Guards (16pk)', qty: 1, price: 14.50 }
      ],
      totalAmount: 36.50,
      paymentMethod: 'PayPal',
      date: 'Oct 10, 2026',
      status: 'Delivered',
      shippingAddress: '78 Vernon Avenue, Clontarf, Dublin 3',
      trackingNumber: 'ANP-8819024',
      carrier: 'An Post'
    },
    {
      id: 'ord-12',
      orderNumber: 'ORD-99813',
      customerName: 'Patrick Higgins',
      customerEmail: 'patrick.h@omnigadget.com',
      customerInitials: 'PH',
      avatarColor: '#D97706',
      items: [
        { name: 'Smart Sound Machine & Programmable Night Light', qty: 1, price: 68.00 }
      ],
      totalAmount: 68.00,
      paymentMethod: 'Apple Pay',
      date: 'Oct 10, 2026',
      status: 'Delivered',
      shippingAddress: '55 Ailesbury Road, Ballsbridge, Dublin 4',
      trackingNumber: 'DHL-EU-884102',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-13',
      orderNumber: 'ORD-99812',
      customerName: 'Tara McDonnell',
      customerEmail: 'tara.mcdonnell@little-sprout.ie',
      customerInitials: 'TM',
      avatarColor: '#DC2626',
      items: [
        { name: 'Portable Baby Food Warm & Cool Insulated Flask', qty: 1, price: 27.99 }
      ],
      totalAmount: 27.99,
      paymentMethod: 'Stripe',
      date: 'Oct 09, 2026',
      status: 'Cancelled',
      shippingAddress: '21 Monkstown Road, Blackrock, Co. Dublin'
    },
    {
      id: 'ord-14',
      orderNumber: 'ORD-99811',
      customerName: 'Sean Brennan',
      customerEmail: 'sean.b@brennanlegal.ie',
      customerInitials: 'SB',
      avatarColor: '#059669',
      items: [
        { name: 'Natural Rubber Teething Giraffe', qty: 2, price: 21.00 }
      ],
      totalAmount: 42.00,
      paymentMethod: 'Apple Pay',
      date: 'Oct 09, 2026',
      status: 'Processing',
      shippingAddress: '14 Sandyford Industrial Estate, Dublin 18'
    },
    {
      id: 'ord-15',
      orderNumber: 'ORD-99810',
      customerName: 'Barry Nolan',
      customerEmail: 'barry.nolan@kidspace.ie',
      customerInitials: 'BN',
      avatarColor: '#D97706',
      items: [
        { name: 'Magnetic Child Safety Cupboard Locks (10pk)', qty: 2, price: 22.50 }
      ],
      totalAmount: 45.00,
      paymentMethod: 'Credit Card',
      date: 'Oct 08, 2026',
      status: 'Delivered',
      shippingAddress: '8 Butterfield Avenue, Rathfarnham, Dublin 14',
      trackingNumber: 'ANP-9912044',
      carrier: 'An Post'
    },
    {
      id: 'ord-16',
      orderNumber: 'ORD-99809',
      customerName: 'Ciara Doyle',
      customerEmail: 'ciara.doyle@woodentoy.ie',
      customerInitials: 'CD',
      avatarColor: '#2563EB',
      items: [
        { name: 'Hand-Knitted Cotton Teething Rattle', qty: 1, price: 16.00 }
      ],
      totalAmount: 16.00,
      paymentMethod: 'Stripe',
      date: 'Oct 08, 2026',
      status: 'In Transit',
      shippingAddress: '109 Griffith Avenue, Glasnevin, Dublin 9',
      trackingNumber: 'DHL-EU-118492',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-17',
      orderNumber: 'ORD-99808',
      customerName: 'Gemma Lynch',
      customerEmail: 'gemma.lynch@teddys.ie',
      customerInitials: 'GL',
      avatarColor: '#BE123C',
      items: [
        { name: 'Organic Bamboo Baby Swaddle Wraps', qty: 1, price: 28.50 },
        { name: 'Breathing White Noise Sound Machine', qty: 1, price: 36.99 }
      ],
      totalAmount: 65.49,
      paymentMethod: 'PayPal',
      date: 'Oct 07, 2026',
      status: 'Delivered',
      shippingAddress: '4 George’s Street Upper, Dun Laoghaire',
      trackingNumber: 'DPD-IE-772910',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-18',
      orderNumber: 'ORD-99807',
      customerName: 'Aidan Burke',
      customerEmail: 'aidan.burke@juniorexplorers.ie',
      customerInitials: 'AB',
      avatarColor: '#062E35',
      items: [
        { name: 'Montessori Wooden Sensory Stacking Blocks', qty: 2, price: 34.00 }
      ],
      totalAmount: 68.00,
      paymentMethod: 'Credit Card',
      date: 'Oct 07, 2026',
      status: 'Delivered',
      shippingAddress: '18 Palmerston Park, Dartry, Dublin 6',
      trackingNumber: 'ANP-3341902',
      carrier: 'An Post'
    },
    {
      id: 'ord-19',
      orderNumber: 'ORD-99806',
      customerName: 'Sinead Flanagan',
      customerEmail: 'sinead.f@dunnes.ie',
      customerInitials: 'SF',
      avatarColor: '#059669',
      items: [
        { name: 'Organic Wool Mattress Topper for Cot', qty: 1, price: 64.00 }
      ],
      totalAmount: 64.00,
      paymentMethod: 'Apple Pay',
      date: 'Oct 06, 2026',
      status: 'On Hold',
      shippingAddress: '2 Cornelscourt Village, Foxrock, Dublin 18'
    },
    {
      id: 'ord-20',
      orderNumber: 'ORD-99805',
      customerName: 'Mark Prendergast',
      customerEmail: 'mark.p@odeon.ie',
      customerInitials: 'MP',
      avatarColor: '#D97706',
      items: [
        { name: 'No-Touch Digital Infrared Thermometer', qty: 1, price: 42.00 }
      ],
      totalAmount: 42.00,
      paymentMethod: 'Stripe',
      date: 'Oct 06, 2026',
      status: 'Delivered',
      shippingAddress: '28 Point Square, North Wall Quay, Dublin 1',
      trackingNumber: 'DHL-EU-449102',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-21',
      orderNumber: 'ORD-99804',
      customerName: 'Eoin McCarthy',
      customerEmail: 'eoin.mccarthy@jumpzone.ie',
      customerInitials: 'EM',
      avatarColor: '#4F46E5',
      items: [
        { name: 'Smart HD WiFi Baby Monitor', qty: 1, price: 139.99 },
        { name: 'Compact Foldable Travel High Chair', qty: 1, price: 52.00 }
      ],
      totalAmount: 191.99,
      paymentMethod: 'Credit Card',
      date: 'Oct 05, 2026',
      status: 'In Transit',
      shippingAddress: '71 Stillorgan Road, Dublin 4',
      trackingNumber: 'DPD-IE-992014',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-22',
      orderNumber: 'ORD-99803',
      customerName: 'Darrell Steward',
      customerEmail: 'darrell.s@omnigadget.com',
      customerInitials: 'DS',
      avatarColor: '#062E35',
      items: [
        { name: 'Electric Steam Baby Bottle Steriliser', qty: 1, price: 89.90 }
      ],
      totalAmount: 89.90,
      paymentMethod: 'Stripe',
      date: 'Oct 05, 2026',
      status: 'Processing',
      shippingAddress: '10 Grand Canal Dock, Dublin 2'
    },
    {
      id: 'ord-23',
      orderNumber: 'ORD-99802',
      customerName: 'Savannah Nguyen',
      customerEmail: 'savannah.n@velvetbloom.net',
      customerInitials: 'SN',
      avatarColor: '#DC2626',
      items: [
        { name: 'Soft Activity Floor Playmat Gym', qty: 1, price: 58.00 }
      ],
      totalAmount: 58.00,
      paymentMethod: 'PayPal',
      date: 'Oct 04, 2026',
      status: 'Cancelled',
      shippingAddress: '15 Grafton Street, Dublin 2'
    },
    {
      id: 'ord-24',
      orderNumber: 'ORD-99801',
      customerName: 'Kathryn Murphy',
      customerEmail: 'kathryn.m@purebotanica.io',
      customerInitials: 'KM',
      avatarColor: '#0E7A6B',
      items: [
        { name: 'Organic Bamboo Baby Swaddle Wraps', qty: 3, price: 28.50 }
      ],
      totalAmount: 85.50,
      paymentMethod: 'Apple Pay',
      date: 'Oct 04, 2026',
      status: 'Delivered',
      shippingAddress: '9 Howth Road, Sutton, Dublin 13',
      trackingNumber: 'ANP-7719284',
      carrier: 'An Post'
    }
  ]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modals
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [orderToHold, setOrderToHold] = useState<OrderItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);

  // Dynamic counts for top cards
  const totalOrdersCount = orders.length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const inTransitCount = orders.filter(o => o.status === 'In Transit').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = order.orderNumber.toLowerCase().includes(term) ||
                          order.customerName.toLowerCase().includes(term) ||
                          order.customerEmail.toLowerCase().includes(term) ||
                          order.items.some(i => i.name.toLowerCase().includes(term));
    const matchesStatus = selectedStatusTab === 'All' || order.status === selectedStatusTab;
    return matchesSearch && matchesStatus;
  });

  // Pagination slicing
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Status toggle (Hold / Release)
  const handleToggleHold = (order: OrderItem) => {
    const nextStatus: OrderStatus = order.status === 'On Hold' ? 'Processing' : 'On Hold';
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: nextStatus } : o));
    setOrderToHold(null);
  };

  // Delete / Cancel order
  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    setOrders(orders.filter(o => o.id !== orderToDelete.id));
    setOrderToDelete(null);
  };

  // Save edit order
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
    setEditingOrder(null);
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Header Section */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review family purchases, marketplace shipments, and transaction fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const csv = orders.map(o => `${o.orderNumber},${o.customerName},${o.totalAmount},${o.status}`).join('\n');
            const blob = new Blob([`OrderNumber,Customer,Amount,Status\n${csv}`], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'krisikunjo_orders.csv';
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
