import React from 'react';
import { Search } from 'lucide-react';

interface SupportFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: 'All' | 'Open' | 'Waiting for Reply' | 'Resolved';
  setActiveTab: (tab: 'All' | 'Open' | 'Waiting for Reply' | 'Resolved') => void;
}

export const SupportFilters: React.FC<SupportFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab
}) => {
  const tabs = ['All', 'Open', 'Waiting for Reply', 'Resolved'] as const;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4F5A]/20 transition-all font-medium"
        />
      </div>

      {/* Filter Capsule Tabs */}
      <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold gap-1 w-full md:w-auto overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
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
