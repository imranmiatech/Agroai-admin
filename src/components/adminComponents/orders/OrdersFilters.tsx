import React from 'react';
import { Search } from 'lucide-react';

interface OrdersFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatusTab: string;
  setSelectedStatusTab: (tab: string) => void;
  onFilterChange: () => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedStatusTab,
  setSelectedStatusTab,
  onFilterChange
}) => {
  const tabs = ['All', 'New', 'Processing', 'Delivery Sent', 'Completed', 'Cancelled'] as const;

  return (
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
            onFilterChange();
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
        />
      </div>

      {/* Status Capsule Tabs */}
      <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold gap-1 w-full lg:w-auto overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = selectedStatusTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setSelectedStatusTab(tab);
                onFilterChange();
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
  );
};
