import React from 'react';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  categoryOptions: string[];
  onFilterChange: () => void;
  placeholder?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categoryOptions,
  onFilterChange,
  placeholder = 'Search product name, SKU...',
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full lg:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onFilterChange();
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
        />
      </div>

      {/* Category Pills & Status Filter */}
      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto justify-between lg:justify-end">
        {/* Category Capsule Tabs */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold gap-1 shrink-0">
          {categoryOptions.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  onFilterChange();
                }}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#062E35] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Status Select */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            onFilterChange();
          }}
          className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};
