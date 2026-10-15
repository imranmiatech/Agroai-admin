import { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Edit3, 
  Ban, 
  Trash2, 
  X, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Download, 
  MapPin
} from 'lucide-react';

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
      trackingNumber: 'DHL-EU-920184',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-04',
      orderNumber: 'ORD-99821',
      customerName: 'Siobhán Murphy',
      customerEmail: 'siobhan.nanny@dublincare.ie',
      customerInitials: 'SM',
      avatarColor: '#D97706',
      items: [
        { name: 'No-Touch Digital Infrared Thermometer', qty: 1, price: 42.00 },
        { name: 'Magnetic Child Safety Cupboard Locks', qty: 1, price: 22.50 }
      ],
      totalAmount: 64.50,
      paymentMethod: 'Stripe',
      date: 'Oct 14, 2026',
      status: 'In Transit',
      shippingAddress: '27 Main Street, Blackrock, Co. Dublin',
      trackingNumber: 'DPD-IE-892189',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-05',
      orderNumber: 'ORD-99820',
      customerName: 'Cathal Byrne',
      customerEmail: 'cathal.b@gmail.com',
      customerInitials: 'CB',
      avatarColor: '#059669',
      items: [
        { name: 'Convertible Wooden Crib & Toddler Bed', qty: 1, price: 320.00 }
      ],
      totalAmount: 320.00,
      paymentMethod: 'Credit Card',
      date: 'Oct 13, 2026',
      status: 'Processing',
      shippingAddress: '12 Castlepark Road, Dalkey, Co. Dublin',
      trackingNumber: 'ANP-9920141',
      carrier: 'An Post'
    },
    {
      id: 'ord-06',
      orderNumber: 'ORD-99819',
      customerName: 'Aoife Gallagher',
      customerEmail: 'aoife.gallagher@familycare.ie',
      customerInitials: 'AG',
      avatarColor: '#7C3AED',
      items: [
        { name: 'Ergonomic Silicone Baby Feeding Set', qty: 1, price: 24.99 },
        { name: 'Anti-Colic Glass Feeding Bottles', qty: 1, price: 38.00 }
      ],
      totalAmount: 62.99,
      paymentMethod: 'PayPal',
      date: 'Oct 13, 2026',
      status: 'Delivered',
      shippingAddress: '5 Strand Road, Bray, Co. Wicklow',
      trackingNumber: 'DHL-EU-339182',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-07',
      orderNumber: 'ORD-99818',
      customerName: 'David Keane',
      customerEmail: 'david.keane@enterprise.ie',
      customerInitials: 'DK',
      avatarColor: '#DC2626',
      items: [
        { name: 'Soft Activity Floor Playmat Gym', qty: 1, price: 58.00 }
      ],
      totalAmount: 58.00,
      paymentMethod: 'Apple Pay',
      date: 'Oct 12, 2026',
      status: 'On Hold',
      shippingAddress: '74 Wellington Road, Ballsbridge, Dublin 4',
      trackingNumber: 'DPD-IE-302914',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-08',
      orderNumber: 'ORD-99817',
      customerName: 'Fiona Kelly',
      customerEmail: 'fiona.kelly@sensoryplay.ie',
      customerInitials: 'FK',
      avatarColor: '#0284C7',
      items: [
        { name: 'Breathing White Noise Sound Machine', qty: 1, price: 36.99 },
        { name: 'Organic Vitamin D3 Sun Drops', qty: 2, price: 12.50 }
      ],
      totalAmount: 61.99,
      paymentMethod: 'Stripe',
      date: 'Oct 12, 2026',
      status: 'Delivered',
      shippingAddress: '19 Sandycove Avenue, Dun Laoghaire',
      trackingNumber: 'ANP-4491028',
      carrier: 'An Post'
    },
    {
      id: 'ord-09',
      orderNumber: 'ORD-99816',
      customerName: 'Marcus Walsh',
      customerEmail: 'marcus.w@techhub.ie',
      customerInitials: 'MW',
      avatarColor: '#0E7A6B',
      items: [
        { name: 'Auto-Close Stair Safety Gate', qty: 1, price: 74.99 }
      ],
      totalAmount: 74.99,
      paymentMethod: 'Credit Card',
      date: 'Oct 11, 2026',
      status: 'Cancelled',
      shippingAddress: '33 Mount Street Crescent, Dublin 2'
    },
    {
      id: 'ord-10',
      orderNumber: 'ORD-99815',
      customerName: 'Clara O’Sullivan',
      customerEmail: 'clara.os@bistro.ie',
      customerInitials: 'CO',
      avatarColor: '#EA580C',
      items: [
        { name: 'Organic Stage 1 Baby Porridge (Pack of 6)', qty: 2, price: 18.75 },
        { name: 'Electrolyte Hydration Sachets (Pack of 10)', qty: 1, price: 15.00 }
      ],
      totalAmount: 52.50,
      paymentMethod: 'Apple Pay',
      date: 'Oct 11, 2026',
      status: 'Delivered',
      shippingAddress: '9 Churchtown Road Upper, Dublin 14',
      trackingNumber: 'DPD-IE-552199',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-11',
      orderNumber: 'ORD-99814',
      customerName: 'Sean MacNamara',
      customerEmail: 'sean.m@wonderblocks.ie',
      customerInitials: 'SM',
      avatarColor: '#062E35',
      items: [
        { name: 'Wooden First Steps Baby Push Walker', qty: 1, price: 68.00 }
      ],
      totalAmount: 68.00,
      paymentMethod: 'Stripe',
      date: 'Oct 10, 2026',
      status: 'Delivered',
      shippingAddress: '64 Terenure Road East, Dublin 6W',
      trackingNumber: 'DHL-EU-881920',
      carrier: 'DHL Express'
    },
    {
      id: 'ord-12',
      orderNumber: 'ORD-99813',
      customerName: 'Niamh Higgins',
      customerEmail: 'niamh.higgins@books.ie',
      customerInitials: 'NH',
      avatarColor: '#4338CA',
      items: [
        { name: 'Biodegradable Unscented Baby Wipes (12pk)', qty: 1, price: 29.99 }
      ],
      totalAmount: 29.99,
      paymentMethod: 'PayPal',
      date: 'Oct 10, 2026',
      status: 'In Transit',
      shippingAddress: '23 Malahide Road, Clontarf, Dublin 3',
      trackingNumber: 'ANP-2281940',
      carrier: 'An Post'
    },
    {
      id: 'ord-13',
      orderNumber: 'ORD-99812',
      customerName: 'Paul Donnelly',
      customerEmail: 'paul.d@supervalu.ie',
      customerInitials: 'PD',
      avatarColor: '#059669',
      items: [
        { name: 'Compact Foldable Travel High Chair', qty: 1, price: 52.00 }
      ],
      totalAmount: 52.00,
      paymentMethod: 'Stripe',
      date: 'Oct 09, 2026',
      status: 'Delivered',
      shippingAddress: '51 Ranelagh Village, Dublin 6',
      trackingNumber: 'DPD-IE-119284',
      carrier: 'DPD Express'
    },
    {
      id: 'ord-14',
      orderNumber: 'ORD-99811',
      customerName: 'Rachel Ward',
      customerEmail: 'rachel.ward@imaginosity.ie',
      customerInitials: 'RW',
      avatarColor: '#9333EA',
      items: [
        { name: 'Cold-Pressed Flaxseed DHA Drops', qty: 2, price: 19.99 },
        { name: 'Tear-Free Hair & Body Wash 1L', qty: 1, price: 21.00 }
      ],
      totalAmount: 60.98,
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
            a.download = 'alurei_orders.csv';
            a.click();
          }}
          className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4 text-slate-700" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* 2. Top Metric Cards (4 Cards matching Figma styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {totalOrdersCount}
          </div>
          <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% from last month</span>
          </div>
        </div>

        {/* Processing */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Processing</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {processingCount}
          </div>
          <div className="text-xs font-semibold text-[#D97706] mt-2">
            Awaiting vendor dispatch
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>In Transit</span>
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {inTransitCount}
          </div>
          <div className="text-xs font-medium text-slate-400 mt-2">
            On route with courier
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {deliveredCount}
          </div>
          <div className="text-xs font-medium text-slate-400 mt-2">
            Fulfilled successfully
          </div>
        </div>
      </div>

      {/* 3. Filter Bar (Search + Status Capsule Tabs) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order ID, customer name, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
          />
        </div>

        {/* Status Capsule Tabs */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold gap-1 w-full lg:w-auto overflow-x-auto">
          {(['All', 'Processing', 'In Transit', 'Delivered', 'On Hold', 'Cancelled'] as const).map((tab) => {
            const isActive = selectedStatusTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSelectedStatusTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#062E35] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Purchased Items</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => setViewingOrder(order)}
                          className="font-bold text-slate-900 text-sm font-mono hover:text-[#062E35] cursor-pointer"
                        >
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">
                          {order.date}
                        </span>
                      </div>
                    </td>

                    {/* Customer with Initials Circle */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 select-none shadow-2xs"
                          style={{ backgroundColor: order.avatarColor }}
                        >
                          {order.customerInitials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 text-sm leading-tight truncate">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                            {order.customerEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Items Summary */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col max-w-xs">
                        <span className="text-xs font-semibold text-slate-800">
                          {order.items.reduce((sum, i) => sum + i.qty, 0)} items
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 truncate" title={order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}>
                          {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                        </span>
                      </div>
                    </td>

                    {/* Total Amount & Payment Badge */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">
                          €{order.totalAmount.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          via {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {order.status === 'Processing' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          <span>Processing</span>
                        </span>
                      )}
                      {order.status === 'In Transit' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                          <span>In Transit</span>
                        </span>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          <span>Delivered</span>
                        </span>
                      )}
                      {order.status === 'On Hold' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          <span>On Hold</span>
                        </span>
                      )}
                      {order.status === 'Cancelled' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20]" />
                          <span>Cancelled</span>
                        </span>
                      )}
                    </td>

                    {/* 4 Action Icons: View, Edit, Suspend/Hold, Delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        {/* 1. View Icon */}
                        <button
                          type="button"
                          onClick={() => setViewingOrder(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* 2. Edit Icon */}
                        <button
                          type="button"
                          onClick={() => setEditingOrder({ ...order })}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#062E35] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit order status"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* 3. Suspend / Hold Icon */}
                        <button
                          type="button"
                          onClick={() => setOrderToHold(order)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            order.status === 'On Hold'
                              ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                              : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
                          }`}
                          title={order.status === 'On Hold' ? 'Release hold' : 'Put on fulfillment hold'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                        {/* 4. Delete Icon */}
                        <button
                          type="button"
                          onClick={() => setOrderToDelete(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete / Cancel order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Bar matching Figma style */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{filteredOrders.length === 0 ? 0 : startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-700">{filteredOrders.length}</span> orders
          </div>

          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#062E35] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

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
                {viewingOrder.items.map((item, idx) => (
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
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as OrderStatus })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                >
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="On Hold">On Hold</option>
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
              {orderToHold.status === 'On Hold' ? 'Release Order Hold?' : 'Place Order on Hold?'}
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              {orderToHold.status === 'On Hold'
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
                  backgroundColor: orderToHold.status === 'On Hold' ? '#062E35' : '#7C3AED',
                  borderRadius: '16px' 
                }}
              >
                {orderToHold.status === 'On Hold' ? 'Release Hold' : 'Confirm Hold'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FIGMA DELETE CONFIRMATION MODAL (#B42318 Red Button) */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            {/* Top Red Squircle Icon */}
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
    </div>
  );
};
