import { useState } from 'react';
import { 
  BarChart2, 
  UserPlus, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Search, 
  Eye, 
  X, 
  ChevronDown, 
  Building2,
  Gift,
  Check
} from 'lucide-react';

interface CategoryItem {
  name: string;
  count: number;
  color: string;
}

export type RequestStatus = 'Contacted' | 'In discussion' | 'new' | 'declined';

interface PartnershipRequest {
  id: string;
  businessName: string;
  description: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  status: RequestStatus;
  submittedDate: string;
}

export const VendorsPage = () => {
  // Navigation tabs: Only 'overview' and 'requests' (Partner Directory and Offers removed per user request)
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('requests');

  // Search & Filter state for Partnership Requests
  const [requestSearch, setRequestSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Detail Modal state for selected request
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);

  // Modal states for Create Offer
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    partnerName: '',
    category: 'Supermarket',
    discount: '15%',
    expiresIn: '30 days'
  });

  // Category breakdown data matching Figma (node 28406-60899)
  const categories: CategoryItem[] = [
    { name: 'Indoor Playground', count: 5, color: '#EF4444' },
    { name: 'Supermarket', count: 6, color: '#059669' },
    { name: 'Entertainment', count: 5, color: '#0EA5E9' },
    { name: 'Toy Stores', count: 4, color: '#8B5CF6' },
    { name: 'General Store', count: 6, color: '#F59E0B' },
    { name: 'Learning Centres', count: 4, color: '#EC4899' },
    { name: 'Book Stores', count: 4, color: '#F43F5E' },
    { name: 'Children\'s Cafés', count: 4, color: '#14B8A6' },
    { name: 'Other', count: 3, color: '#94A3B8' }
  ];

  const totalCategoryCount = categories.reduce((sum, c) => sum + c.count, 0);

  // Partnership requests data matching Figma table (node 28406-61159)
  const [requests, setRequests] = useState<PartnershipRequest[]>([
    {
      id: 'REQ-201',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Clara Gallagher',
      email: 'clara@safesleepireland.ie',
      phone: '+353 87 123 4567',
      status: 'Contacted',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-202',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Liam O’Sullivan',
      email: 'liam@safesleepcare.ie',
      phone: '+353 89 234 5678',
      status: 'In discussion',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-203',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Emma Richardson',
      email: 'emma@safesleepworkshop.ie',
      phone: '+353 85 345 6789',
      status: 'new',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-204',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Sean MacNamara',
      email: 'sean@safesleepconsult.ie',
      phone: '+353 86 456 7890',
      status: 'declined',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-205',
      businessName: 'GiggleZone Soft Play & Sensory Lounge',
      description: 'Early development play arena and parent café',
      category: 'Indoor Playground',
      ownerName: 'Fiona Kelly',
      email: 'fiona@gigglezone.ie',
      phone: '+353 87 234 5678',
      status: 'new',
      submittedDate: 'Jul 5, 2025'
    },
    {
      id: 'REQ-206',
      businessName: 'Little Sprout Organic Baby Essentials',
      description: 'Certified organic meal kits and infant supplies',
      category: 'Supermarket',
      ownerName: 'Cathal Byrne',
      email: 'contact@littlesprout.ie',
      phone: '+353 89 345 6789',
      status: 'Contacted',
      submittedDate: 'Jul 4, 2025'
    }
  ]);

  // Update status for a request
  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  // Create offer handler
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.title || !newOffer.partnerName) return;
    setShowCreateOfferModal(false);
    setNewOffer({
      title: '',
      partnerName: '',
      category: 'Supermarket',
      discount: '15%',
      expiresIn: '30 days'
    });
  };

  // Filtered requests matching search and category dropdown
  const filteredRequests = requests.filter(req => {
    const term = requestSearch.toLowerCase();
    const matchesSearch = req.businessName.toLowerCase().includes(term) ||
                          req.description.toLowerCase().includes(term) ||
                          req.category.toLowerCase().includes(term) ||
                          req.status.toLowerCase().includes(term);
    const matchesCategory = selectedCategoryFilter === 'All' || req.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate SVG donut segments for overview
  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Page Header (Partners Title, Subtitle & "+ Create Offer" Button) */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Partners
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage partner businesses, offers, and partnership requests across the Alurei platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateOfferModal(true)}
          className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-slate-800" strokeWidth={2.4} />
          <span>Create Offer</span>
        </button>
      </div>

      {/* 2. Top Tab Navigation Capsule (Only Overview & Partnership Requests) */}
      <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-full p-1.5 shadow-2xs self-start gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#062E35] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#062E35] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Partnership Requests</span>
        </button>
      </div>

      {/* VIEW 1: PARTNERSHIP REQUESTS TAB (Exact Figma Design Node 28406:61159) */}
      {activeTab === 'requests' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Search Bar & Categories Dropdown Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input Container */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search requests..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
              />
            </div>

            {/* Categories Dropdown Pill */}
            <div className="relative w-full sm:w-auto self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between gap-3 shadow-2xs transition-all cursor-pointer"
              >
                <span>{selectedCategoryFilter === 'All' ? 'Categories' : selectedCategoryFilter}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showCategoryDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => { setSelectedCategoryFilter('All'); setShowCategoryDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      selectedCategoryFilter === 'All' ? 'text-[#062E35] font-bold bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategoryFilter === 'All' && <Check className="w-3.5 h-3.5 text-[#062E35]" />}
                  </button>
                  {categories.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setSelectedCategoryFilter(c.name); setShowCategoryDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        selectedCategoryFilter === c.name ? 'text-[#062E35] font-bold bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        <span>{c.name}</span>
                      </div>
                      {selectedCategoryFilter === c.name && <Check className="w-3.5 h-3.5 text-[#062E35]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Partnership Requests Table (Matching Figma Node 28406:61159 exactly) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-900">
                    <th className="py-4 px-6">Business</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                        No partnership requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr 
                        key={req.id} 
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => setSelectedRequest(req)}
                      >
                        {/* Business Name & Description */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 text-sm leading-tight">
                              {req.businessName}
                            </span>
                            <span className="text-xs text-slate-400 mt-1 truncate max-w-sm">
                              {req.description}
                            </span>
                          </div>
                        </td>

                        {/* Category Capsule */}
                        <td className="py-4 px-6">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#E0F7FA] text-[#00695C]">
                            {req.category}
                          </span>
                        </td>

                        {/* Status Capsule with Figma exact colors */}
                        <td className="py-4 px-6">
                          {req.status === 'Contacted' && (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                              Contacted
                            </span>
                          )}
                          {req.status === 'In discussion' && (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#E0E7FF] text-[#4F46E5]">
                              In discussion
                            </span>
                          )}
                          {req.status === 'new' && (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7] lowercase">
                              new
                            </span>
                          )}
                          {req.status === 'declined' && (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20] lowercase">
                              declined
                            </span>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-4 px-6 text-xs text-slate-600 font-normal">
                          {req.submittedDate}
                        </td>

                        {/* Action Eye Icon */}
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OVERVIEW TAB (Figma Design Node 28406:60899) */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Top 2 Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Total Partners */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+7.1%</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mt-2">
                  37
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  Total Partners
                </div>
              </div>
              <div className="w-full h-1 bg-[#16A34A] rounded-full mt-6" />
            </div>

            {/* Card 2: Active Offers */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+5.6%</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mt-2">
                  20
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  Active Offers
                </div>
              </div>
              <div className="w-full h-1 bg-[#16A34A] rounded-full mt-6" />
            </div>
          </div>

          {/* Middle Card: Partners by Category (Donut Chart & Breakdown) */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6">
              Partners by Category
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Donut Chart Ring */}
              <div className="lg:col-span-4 flex items-center justify-center py-4">
                <div className="relative w-52 h-52 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                    {categories.map((cat, idx) => {
                      const segmentLength = (cat.count / totalCategoryCount) * circumference;
                      const strokeDasharray = `${Math.max(segmentLength - 3, 1)} ${circumference - Math.max(segmentLength - 3, 1)}`;
                      const offset = accumulatedOffset;
                      accumulatedOffset += segmentLength;

                      return (
                        <circle
                          key={idx}
                          cx="90"
                          cy="90"
                          r={radius}
                          fill="transparent"
                          stroke={cat.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-900 leading-none">
                      37
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Partners
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown Rows */}
              <div className="lg:col-span-8 flex flex-col gap-3.5">
                {categories.map((item, idx) => {
                  const maxCount = 6;
                  const percentWidth = Math.round((item.count / maxCount) * 100);

                  return (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: item.color }} 
                          />
                          <span className="font-semibold text-slate-800">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 text-xs">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden ml-4.5">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentWidth}%`, 
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Card: Attention Required */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
              Attention Required
            </h2>

            <div className="flex flex-col gap-3.5">
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/80 text-[#EF4444] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      6 new partnership requests awaiting review
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('requests')}
                      className="text-xs font-semibold text-[#EF4444] hover:text-rose-700 flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <span>Review requests</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFDF5] border border-[#FEF0C7] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/80 text-[#F59E0B] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      3 offers are pending admin approval before going live
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFDF5] border border-[#FEF0C7] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/80 text-[#F59E0B] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      2 active offers expire within the next 7 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR PARTNERSHIP REQUEST */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedRequest.businessName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-medium text-slate-600">{selectedRequest.category}</span>
                    <span>·</span>
                    <span>Submitted {selectedRequest.submittedDate}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Contact Details */}
            <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Contact Person</span>
                  <span className="text-slate-800 font-medium">{selectedRequest.ownerName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Phone</span>
                  <span className="text-slate-800 font-medium">{selectedRequest.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">Email Address</span>
                  <span className="text-slate-800 font-medium">{selectedRequest.email}</span>
                </div>
              </div>
            </div>

            {/* Change Status Controls */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">Update Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'new')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'new' 
                      ? 'bg-[#E0F2FE] text-[#0284C7] ring-2 ring-[#0284C7]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'Contacted')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'Contacted' 
                      ? 'bg-[#DCFCE7] text-[#16A34A] ring-2 ring-[#16A34A]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'In discussion')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'In discussion' 
                      ? 'bg-[#E0E7FF] text-[#4F46E5] ring-2 ring-[#4F46E5]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In discussion
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'declined')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'declined' 
                      ? 'bg-[#FEE4E2] text-[#D92D20] ring-2 ring-[#D92D20]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Declined
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 rounded-xl bg-[#062E35] text-white text-xs font-semibold hover:bg-[#0A434D] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE OFFER MODAL */}
      {showCreateOfferModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Partner Offer</h3>
                  <p className="text-xs text-slate-400">Launch a new member promotion or discount voucher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateOfferModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Offer Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% Off Weekend Soft Play Admission"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-1 focus:ring-[#062E35]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Partner Store Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GiggleZone"
                    value={newOffer.partnerName}
                    onChange={(e) => setNewOffer({ ...newOffer, partnerName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-1 focus:ring-[#062E35]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category:
                  </label>
                  <select
                    value={newOffer.category}
                    onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Discount / Incentive:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20% or Free Gift"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Validity Period:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 days"
                    value={newOffer.expiresIn}
                    onChange={(e) => setNewOffer({ ...newOffer, expiresIn: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateOfferModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
