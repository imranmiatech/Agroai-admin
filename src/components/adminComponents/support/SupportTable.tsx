import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { SupportTicket } from '../../../pages/adminPages/AdminSupport';

interface SupportTableProps {
  tickets: SupportTicket[];
  getInitials: (name: string) => string;
  onSelectTicket: (ticket: SupportTicket) => void;
  onDeleteTicket: (ticket: SupportTicket) => void;
}

export const SupportTable: React.FC<SupportTableProps> = ({
  tickets,
  getInitials,
  onSelectTicket,
  onDeleteTicket
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Subject</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Submitted</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No support tickets found matching your search.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  {/* User with Initials Circle */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                        {getInitials(ticket.sender)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-900 text-sm leading-tight truncate">
                          {ticket.sender}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 truncate">
                          {ticket.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-6">
                    <span 
                      className="text-slate-700 text-xs font-medium line-clamp-1 hover:text-[#0E4F5A] transition-colors"
                      title={ticket.subject}
                    >
                      {ticket.subject}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                    {ticket.role}
                  </td>

                  {/* Status Pill with colored Dot */}
                  <td className="py-4 px-6">
                    {ticket.status === 'Open' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        <span>Open</span>
                      </span>
                    )}
                    {ticket.status === 'Waiting for Reply' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        <span>Waiting for Reply</span>
                      </span>
                    )}
                    {ticket.status === 'Resolved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F1] text-[#0E7A6B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0E7A6B]" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </td>

                  {/* Submitted Time */}
                  <td className="py-4 px-6 text-xs text-slate-500 font-normal">
                    {ticket.submittedTime}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectTicket(ticket)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View and reply to ticket"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTicket(ticket)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-4 h-4" />
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
