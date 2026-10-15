import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Sparkles, 
  Target, 
  Check, 
  Plus, 
  Edit3, 
  AlertTriangle, 
  Eye, 
  Heart, 
  CheckCircle2, 
  X
} from 'lucide-react';

interface VendorOverviewProps {
  onNavigateToProduct?: () => void;
  onNavigateToOrders?: () => void;
}

export const VendorOverview: React.FC<VendorOverviewProps> = ({
  onNavigateToProduct,
  onNavigateToOrders: _onNavigateToOrders
}) => {
  const navigate = useNavigate();

  // Timeframe filter for Offer Performance chart
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M'>('7D');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Modals
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Form states
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState('20%');
  const [newOfferCategory, setNewOfferCategory] = useState("Selected Kids' Products");
  const [newOfferDate, setNewOfferDate] = useState('2026-09-30');

  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Nutrition');
  const [newProductPrice, setNewProductPrice] = useState('14.50');

  // Chart data for 7D, 30D, 3M
  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const viewsData = [310, 335, 430, 415, 460, 350, 340];
  const savesData = [30, 38, 42, 36, 48, 32, 28];
  const redemptionsData = [15, 18, 22, 20, 28, 19, 16];

  // SVG coordinate calculations for 700x260 viewBox
  // Y range: 0 -> 240, 600 -> 20
  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(600, val));
    return 230 - (clamped / 600) * 200;
  };

  const getX = (index: number) => {
    return 50 + index * 100;
  };

  // Generate smooth cubic bezier SVG path
  const makeSmoothPath = (data: number[]) => {
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d) }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const viewsPath = makeSmoothPath(viewsData);
  const savesPath = makeSmoothPath(savesData);
  const redemptionsPath = makeSmoothPath(redemptionsData);

  // Closed area path for views gradient
  const viewsAreaPath = `${viewsPath} L ${getX(6)} 230 L ${getX(0)} 230 Z`;

  const handleCreateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateOfferModal(false);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddProductModal(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter']">
      {/* 1. Welcome Header Banner (Figma Node 25762:61076) */}
      <div 
        className="w-full rounded-2xl bg-[#0B5460] p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm"
        style={{ backgroundColor: '#0B5460' }}
      >
        {/* Decorative subtle concentric arches on right */}
        <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-20">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white" />
          <div className="absolute -right-10 -top-10 w-80 h-80 rounded-full border border-white" />
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full border border-white" />
        </div>

        {/* Banner Left Info */}
        <div className="relative z-10">
          <span className="text-white/80 text-sm font-normal">
            Good afternoon,
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            Carefour <span className="text-2xl select-none">👋</span>
          </h1>
          <p className="text-white/75 text-sm mt-1.5 font-normal">
            Here's how your partnership with Alurei is performing.
          </p>
        </div>

        {/* Banner Right Actions */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCreateOfferModal(true)}
            className="px-5 py-2.5 rounded-full bg-white text-[#0B5460] text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-98"
          >
            + Create Offer
          </button>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToProduct) {
                onNavigateToProduct();
              } else {
                navigate('/vendor/product');
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold transition-all cursor-pointer active:scale-98"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* 2. Top 3 Metric KPI Cards (Figma Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Products */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm font-medium">Products</span>
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-700">
              <LayoutGrid className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-900 tracking-tight">128</div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="font-semibold text-[#0B5460]">+12</span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Offers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm font-medium">Active Offers</span>
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-700">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-900 tracking-tight">6</div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="font-semibold text-[#0B5460]">+2</span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Redemptions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm font-medium">Redemptions</span>
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-700">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-900 tracking-tight">342</div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="font-semibold text-[#0B5460]">+38</span>
              <span>vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Offer Performance Line Chart (Figma Node 25762:61076) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
        {/* Card Header & Timeframe Pills */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Offer Performance
          </h2>
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl">
            {(['7D', '30D', '3M'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative w-full h-64 select-none">
          <svg 
            viewBox="0 0 700 260" 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis labels */}
            {[
              { val: 600, y: 30 },
              { val: 450, y: 80 },
              { val: 300, y: 130 },
              { val: 150, y: 180 },
              { val: 0, y: 230 }
            ].map((tick) => (
              <g key={tick.val}>
                <text
                  x="30"
                  y={tick.y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[11px] font-medium select-none"
                >
                  {tick.val}
                </text>
                <line
                  x1="45"
                  y1={tick.y}
                  x2="680"
                  y2={tick.y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </g>
            ))}

            {/* Views Area Fill */}
            <path
              d={viewsAreaPath}
              fill="url(#viewsGradient)"
            />

            {/* Views Curve (Blue) */}
            <path
              d={viewsPath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Saves Curve (Purple) */}
            <path
              d={savesPath}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Redemptions Curve (Emerald/Green) */}
            <path
              d={redemptionsPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Data Points and Hover triggers */}
            {chartDays.map((day, idx) => {
              const x = getX(idx);
              const yViews = getY(viewsData[idx]);
              const isHovered = hoveredDayIndex === idx;

              return (
                <g 
                  key={day}
                  onMouseEnter={() => setHoveredDayIndex(idx)}
                  onMouseLeave={() => setHoveredDayIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Vertical hover guide bar */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1="30"
                      x2={x}
                      y2="230"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Views node dot */}
                  <circle
                    cx={x}
                    cy={yViews}
                    r={isHovered ? 5 : 3.5}
                    fill="#3B82F6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* X-axis Day label */}
                  <text
                    x={x}
                    y="252"
                    textAnchor="middle"
                    className={`text-[12px] font-medium transition-colors ${
                      isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                    }`}
                  >
                    {day}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip when hovering a point */}
          {hoveredDayIndex !== null && (
            <div 
              className="absolute z-20 pointer-events-none -top-2 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl flex flex-col gap-1 -translate-x-1/2"
              style={{ left: `${(getX(hoveredDayIndex) / 700) * 100}%` }}
            >
              <span className="font-bold text-slate-300 border-b border-slate-700 pb-0.5">
                {chartDays[hoveredDayIndex]}
              </span>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-blue-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Views:
                </span>
                <span className="font-semibold">{viewsData[hoveredDayIndex]}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-purple-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Saves:
                </span>
                <span className="font-semibold">{savesData[hoveredDayIndex]}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Redemptions:
                </span>
                <span className="font-semibold">{redemptionsData[hoveredDayIndex]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span>Redemptions</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
            <span>Saves</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
            <span>Views</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Recent Activity & Top Performing Offer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Recent Activity
          </h2>

          <div className="divide-y divide-slate-100 flex flex-col">
            {/* Item 1 */}
            <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  Offer "20% Off Kids Products" was approved by Alurei
                </p>
                <span className="text-xs text-slate-400">2 hours ago</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  New product "Organic Baby Yogurt" added to catalogue
                </p>
                <span className="text-xs text-slate-400">5 hours ago</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  Offer redeemed at Kensington branch
                </p>
                <span className="text-xs text-slate-400">Yesterday</span>
              </div>
            </div>

            {/* Item 4 */}
            <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Edit3 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  Product "Toddler Snack Pack" was updated
                </p>
                <span className="text-xs text-slate-400">Yesterday</span>
              </div>
            </div>

            {/* Item 5 */}
            <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  "Back to School" offer expires in 3 days
                </p>
                <span className="text-xs text-slate-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Top Performing Offer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-slate-500 text-xs font-semibold tracking-wider block mb-3">
              Top Performing Offer
            </span>

            {/* Feature Card Matching Figma Teal Banner */}
            <div className="bg-gradient-to-br from-[#064E5B] to-[#0A6475] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
              <div className="text-3xl font-extrabold tracking-tight">
                20% OFF
              </div>
              <div className="text-white/90 text-sm font-medium mt-1">
                Selected Kids' Products
              </div>
              <div className="text-white/70 text-xs mt-3">
                Valid until 30 September
              </div>
            </div>

            {/* Breakdown List */}
            <div className="mt-5 flex flex-col gap-3.5">
              <div className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Views</span>
                </div>
                <span className="font-bold text-slate-900">1,240</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Saves</span>
                </div>
                <span className="font-bold text-slate-900">186</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <span>Redemptions</span>
                </div>
                <span className="font-bold text-slate-900">94</span>
              </div>
            </div>
          </div>

          {/* View Offers Button */}
          <button
            type="button"
            onClick={() => navigate('/vendor/offers')}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all cursor-pointer text-center"
          >
            View offers
          </button>
        </div>
      </div>

      {/* Modal: Create Offer */}
      {showCreateOfferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create New Offer</h3>
              <button
                type="button"
                onClick={() => setShowCreateOfferModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfferSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Offer Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25% OFF Summer Bundle"
                  value={newOfferTitle}
                  onChange={(e) => setNewOfferTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Discount
                  </label>
                  <input
                    type="text"
                    value={newOfferDiscount}
                    onChange={(e) => setNewOfferDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={newOfferDate}
                    onChange={(e) => setNewOfferDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Applicable Category
                </label>
                <input
                  type="text"
                  value={newOfferCategory}
                  onChange={(e) => setNewOfferCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateOfferModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#0B5460] hover:bg-[#08424C] text-white shadow-sm cursor-pointer"
                >
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Fruit Puree Pack"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  >
                    <option value="Nutrition">Nutrition</option>
                    <option value="Baby Care">Baby Care</option>
                    <option value="Toys">Toys</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#0B5460] hover:bg-[#08424C] text-white shadow-sm cursor-pointer"
                >
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOverview;
