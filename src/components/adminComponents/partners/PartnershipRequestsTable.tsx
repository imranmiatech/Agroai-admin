import React, { useState } from 'react';
import { Search, ChevronDown, Check, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { PartnershipRequest, PartnerDivisionItem } from '../../../redux';
import { useGetPartnershipRequestsQuery } from '../../../redux';

interface PartnershipRequestsTableProps {
  categories: PartnerDivisionItem[];
  onSelectRequest: (req: PartnershipRequest) => void;
}

export const PartnershipRequestsTable: React.FC<PartnershipRequestsTableProps> = ({
  categories,
  onSelectRequest,
}) => {
  const [requestSearch, setRequestSearch] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: requestsRes, isLoading, isFetching } = useGetPartnershipRequestsQuery({
    page,
    limit,
    search: requestSearch,
    location: selectedLocationFilter !== 'All' ? selectedLocationFilter : undefined,
  });

  const requests = requestsRes?.data?.items || [];
  const meta = requestsRes?.data?.meta || { total: 0, page: 1, limit, totalPages: 1 };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Search Bar & Location Dropdown Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input Container */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search requests..."
            value={requestSearch}
            onChange={(e) => {
              setRequestSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
          />
        </div>

        {/* Location Dropdown Pill */}
        <div className="relative w-full sm:w-auto self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between gap-3 shadow-2xs transition-all cursor-pointer"
          >
            <span>{selectedLocationFilter === 'All' ? 'Location' : selectedLocationFilter}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {showLocationDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedLocationFilter('All');
                  setShowLocationDropdown(false);
                  setPage(1);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-between ${
                  selectedLocationFilter === 'All' ? 'text-[#062E35] font-bold bg-slate-50' : 'text-slate-700'
                }`}
              >
                <span>All Locations</span>
                {selectedLocationFilter === 'All' && <Check className="w-3.5 h-3.5 text-[#062E35]" />}
              </button>
              {categories.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedLocationFilter(c.name);
                    setShowLocationDropdown(false);
                    setPage(1);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    selectedLocationFilter === c.name ? 'text-[#062E35] font-bold bg-slate-50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                  </div>
                  {selectedLocationFilter === c.name && <Check className="w-3.5 h-3.5 text-[#062E35]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Partnership Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-1">
        <div className="overflow-x-auto relative">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#062E35]" />
            </div>
          )}

          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-900">
                <th className="py-4 px-6">Business</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Submitted</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#062E35]" />
                      <span className="text-xs">Loading partnership requests...</span>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No partnership requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
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

                    {/* Location Capsule */}
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#E0F7FA] text-[#00695C]">
                        {req.location || req.category || 'Dhaka'}
                      </span>
                    </td>

                    {/* Status Capsule */}
                    <td className="py-4 px-6">
                      {req.status === 'PENDING' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                          PENDING
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          APPROVED
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20]">
                          REJECTED
                        </span>
                      )}
                      {req.status === 'SUSPENDED' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
                          SUSPENDED
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

        {/* Pagination Bar */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {Math.min((page - 1) * limit + 1, meta.total)} to{' '}
              {Math.min(page * limit, meta.total)} of {meta.total} requests
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-700">
                Page {page} of {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
