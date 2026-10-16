import React from 'react';
import { MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import type { VendorTicket } from '../../../pages/vendorPages/VendorSupport';

interface VendorSupportTableProps {
  tickets: VendorTicket[];
}

export const VendorSupportTable: React.FC<VendorSupportTableProps> = ({ tickets }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">My Support Inquiries</h3>
        <p className="text-xs text-slate-500">Tickets submitted to marketplace administrators</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Replies</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-sky-600">{t.id}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{t.subject}</td>
                <td className="py-3.5 px-4 text-xs text-slate-500">{t.date}</td>
                <td className="py-3.5 px-4 text-slate-600">{t.replies} messages</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {t.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    <span>{t.status}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View Chat</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
