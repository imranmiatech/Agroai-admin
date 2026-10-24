import React from 'react';
import { Search } from 'lucide-react';
interface SupportFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: 'All' | 'Open' | 'Resolved';
  setActiveTab: (tab: 'All' | 'Open' | 'Resolved') => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
}

export const SupportFilters: React.FC<SupportFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  selectedCategory = 'All',
  setSelectedCategory
}) => {
  const tabs = ['All', 'Open', 'Resolved'] as const;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search and Category Row */}
      <div className="flex flex-1 items-center gap-3 w-full">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets by ID, vendor, store, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35] transition-all font-medium"
          />
        </div>

        {setSelectedCategory && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200/80 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 cursor-pointer shrink-0"
          >
            <option value="All">All Categories</option>
            <option value="Payout & Finance">Payout & Finance</option>
            <option value="Product Approval">Product Approval</option>
            <option value="Delivery & Logistics">Delivery & Logistics</option>
            <option value="Account & Verification">Account & Verification</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        )}
      </div>

      {/* Filter Capsule Tabs */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1 w-full md:w-auto overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#062E35] text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};
