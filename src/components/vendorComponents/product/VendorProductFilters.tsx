import React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import type { VendorProductItem } from '../../../pages/vendorPages/VendorProduct';

interface VendorProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: (open: boolean) => void;
  categories: Array<VendorProductItem['category']>;
}

export const VendorProductFilters: React.FC<VendorProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  categories
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Search input pill */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 bg-[#F8FAFC] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:bg-white transition-all font-['Inter']"
        />
      </div>

      {/* Category Dropdown Filter */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all cursor-pointer"
        >
          <span>{selectedCategory === 'All' ? 'Categories' : selectedCategory}</span>
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
            12
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isCategoryDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-20" 
              onClick={() => setIsCategoryDropdownOpen(false)} 
            />
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30 animate-in fade-in-50 zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setIsCategoryDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                  selectedCategory === 'All' ? 'text-[#0E4F5A] font-semibold bg-slate-50/60' : 'text-slate-700'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'All' && <Check className="w-4 h-4 text-[#0E4F5A]" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    selectedCategory === cat ? 'text-[#0E4F5A] font-semibold bg-slate-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-4 h-4 text-[#0E4F5A]" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
