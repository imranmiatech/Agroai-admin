import React, { useState } from 'react';
import { Search, ChevronDown, Check, Eye } from 'lucide-react';
import type { PartnershipRequest, CategoryItem } from '../../../pages/adminPages/VendorsPage';

interface PartnershipRequestsTableProps {
  requests: PartnershipRequest[];
  categories: CategoryItem[];
  onSelectRequest: (req: PartnershipRequest) => void;
}

export const PartnershipRequestsTable: React.FC<PartnershipRequestsTableProps> = ({
  requests,
  categories,
  onSelectRequest
}) => {
  const [requestSearch, setRequestSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredRequests = requests.filter(req => {
    const term = requestSearch.toLowerCase();
    const matchesSearch = req.businessName.toLowerCase().includes(term) ||
                          req.description.toLowerCase().includes(term) ||
                          req.category.toLowerCase().includes(term) ||
                          req.status.toLowerCase().includes(term);
    const matchesCategory = selectedCategoryFilter === 'All' || req.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
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

      {/* Partnership Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
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
                    onClick={() => onSelectRequest(req)}
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

                    {/* Status Capsule */}
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
                        onClick={() => onSelectRequest(req)}
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
  );
};
