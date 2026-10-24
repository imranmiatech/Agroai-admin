import React from 'react';
import { Trash2, Store, MessageSquare } from 'lucide-react';
import {
  type VendorSupportTicket,
  type TicketPriority,
  type TicketStatus,
  isTicketUnread
} from '../../../services/vendorAdminSupportService';

interface SupportTableProps {
  tickets: VendorSupportTicket[];
  getInitials: (name?: string) => string;
  onSelectTicket: (ticket: VendorSupportTicket) => void;
  onDeleteTicket: (ticket: VendorSupportTicket) => void;
}

export const SupportTable: React.FC<SupportTableProps> = ({
  tickets,
  getInitials,
  onSelectTicket,
  onDeleteTicket
}) => {
  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Urgent</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Medium</span>;
      case 'Low':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Low</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Open</span>
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>In Review</span>
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F1] text-[#0E7A6B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E7A6B]" />
            <span>Resolved</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
              <th className="py-3 px-6">Ticket & Subject</th>
              <th className="py-3 px-6">Vendor</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6">Status & Priority</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                  No support tickets found matching your search.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Ticket & Subject */}
                  <td className="py-3.5 px-6 max-w-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[11px] font-bold text-[#062E35] bg-[#062E35]/5 px-2 py-0.5 rounded-md">
                          {ticket.id}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {ticket.submittedTime}
                        </span>
                      </div>
                      <span 
                        className="text-slate-900 text-sm font-semibold truncate group-hover:text-[#062E35] transition-colors"
                        title={ticket.subject}
                      >
                        {ticket.subject}
                      </span>
                      <span className="text-xs text-slate-400 truncate mt-0.5">
                        {ticket.fullMessage}
                      </span>
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-2xs">
                        {getInitials(ticket.vendorName || ticket.storeName || 'Vendor')}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-900 text-xs leading-tight truncate">
                          {ticket.vendorName}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Store className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{ticket.storeName}</span>
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-6">
                    <span className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {ticket.category}
                    </span>
                  </td>

                  {/* Status & Priority */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectTicket(ticket)}
                        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#062E35] bg-[#062E35]/5 hover:bg-[#062E35]/15 transition-all cursor-pointer shadow-2xs"
                        title="Open chat conversation"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                        {isTicketUnread(ticket, 'Admin') && (
                          <span
                            className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-white"
                            title="New unread message from Vendor"
                          />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTicket(ticket)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
