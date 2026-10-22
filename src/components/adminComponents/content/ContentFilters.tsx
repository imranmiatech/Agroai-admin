import React from 'react';
import { Search } from 'lucide-react';

interface ContentFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: 'All' | 'Published' | 'Draft';
  setStatusFilter: (st: 'All' | 'Published' | 'Draft') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
}

export const ContentFilters: React.FC<ContentFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search articles by title, author, topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F1F5F9] border-none text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap justify-between sm:justify-end">
        {/* Status Switcher (All / Published / Draft) */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold">
          {(['All', 'Published', 'Draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Dropdown Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#062E35] cursor-pointer transition-colors"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
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
