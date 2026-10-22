import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface ConsultationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedUrgency: string;
  onUrgencyChange: (urgency: string) => void;
  onReset: () => void;
}

export const ConsultationFilters: React.FC<ConsultationFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedUrgency,
  onUrgencyChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by farmer name, crop, location or symptom..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:bg-white focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-['Inter']"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by Status"
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending (Unassigned)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved / Prescribed</option>
          </select>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by Category"
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer"
          >
            <option value="ALL">All Disciplines</option>
            <option value="Crop Disease">Crop Disease</option>
            <option value="Pest Control">Pest Control</option>
            <option value="Soil Health">Soil Health</option>
            <option value="Fertilizer Guide">Fertilizer Guide</option>
            <option value="Irrigation">Irrigation</option>
          </select>

          {/* Urgency Select */}
          <select
            value={selectedUrgency}
            onChange={(e) => onUrgencyChange(e.target.value)}
            aria-label="Filter by Urgency"
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer"
          >
            <option value="ALL">All Urgencies</option>
            <option value="URGENT">Emergency / Urgent</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal</option>
          </select>

          {/* Reset Filters */}
          {(searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedUrgency !== 'ALL') && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
