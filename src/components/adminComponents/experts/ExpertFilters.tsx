import React from 'react';
import { Search, LayoutGrid, List, X } from 'lucide-react';
import { EXPERT_SPECIALIZATIONS } from './expertTypes';

interface ExpertFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  selectedSpecialization: string;
  setSelectedSpecialization: (spec: string) => void;
  statusFilter: string;
  setStatusFilter: (st: string) => void;
  viewMode: 'table' | 'grid';
  setViewMode: (vm: 'table' | 'grid') => void;
  availableSpecializations?: string[];
}

export const ExpertFilters: React.FC<ExpertFiltersProps> = ({
  search,
  setSearch,
  selectedSpecialization,
  setSelectedSpecialization,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  availableSpecializations = EXPERT_SPECIALIZATIONS as unknown as string[],
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full md:max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search experts by name, email, phone, or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/10 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Selects & View Toggle */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between md:justify-end">
        {/* Specialization Filter */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#062E35] cursor-pointer transition-colors max-w-[200px] truncate"
          >
            <option value="All">All Specializations</option>
            {availableSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#062E35] cursor-pointer transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
