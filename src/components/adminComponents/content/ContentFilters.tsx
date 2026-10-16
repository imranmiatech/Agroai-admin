import React from 'react';
import { Search } from 'lucide-react';

interface ContentFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: 'All' | 'Published' | 'Draft';
  setStatusFilter: (st: 'All' | 'Published' | 'Draft') => void;
  selectedMealType: string;
  setSelectedMealType: (mt: string) => void;
  selectedAgeGroup: string;
  setSelectedAgeGroup: (ag: string) => void;
}

export const ContentFilters: React.FC<ContentFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  selectedMealType,
  setSelectedMealType,
  selectedAgeGroup,
  setSelectedAgeGroup
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full lg:max-w-xs">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search items or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F1F5F9] border-none text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4F5A]/20 transition-all font-medium"
        />
      </div>

      {/* Filter Controls Row */}
      <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap justify-between lg:justify-end">
        {/* Status Switcher (All / Published / Draft) */}
        <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-full text-xs font-semibold">
          {(['All', 'Published', 'Draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Meal Type Dropdown with Badge */}
        <div className="relative">
          <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
            12
          </span>
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
          >
            <option value="All">Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Age Group Dropdown with Badge */}
        <div className="relative">
          <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
            12
          </span>
          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
          >
            <option value="All">Age Group</option>
            <option value="0–6 months">0–6 months</option>
            <option value="6–12 months">6–12 months</option>
            <option value="1–2 years">1–2 years</option>
            <option value="2–4 years">2–4 years</option>
            <option value="5+ years">5+ years</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
