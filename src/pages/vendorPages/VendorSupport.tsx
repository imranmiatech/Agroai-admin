import { useState } from 'react';
import { LifeBuoy, Plus, MessageSquare, CheckCircle2, Clock, X } from 'lucide-react';

export const VendorSupport = () => {
  const [vendorTickets, setVendorTickets] = useState([
    { id: 'TKT-1042', subject: 'Payout API verification delay on stripe', status: 'In Review', date: 'Oct 15, 2026', replies: 2 },
    { id: 'TKT-9821', subject: 'Custom brand packaging approval request', status: 'Resolved', date: 'Oct 02, 2026', replies: 5 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;

    const newTkt = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      status: 'In Review',
      date: 'Today',
      replies: 1
    };

    setVendorTickets([newTkt, ...vendorTickets]);
    setTicketSubject('');
    setTicketBody('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Help & Platform Support</h2>
          <p className="text-sm text-slate-500 mt-1">Reach our marketplace support specialists for assistance with catalog, logistics, or payouts.</p>
        </div>
        <button 
          type="button" 
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Merchant Live Help</div>
              <div className="text-xs text-slate-500">Available Mon-Fri, 9am - 8pm EST</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Average response time for verified vendors is under 15 minutes.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Seller Knowledge Base</div>
              <div className="text-xs text-slate-500">Documentation & Guides</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Explore packaging guidelines, returns handling, and payout rules.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">My Support Inquiries</h3>
          <p className="text-xs text-slate-500">Tickets submitted to marketplace administrators</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
              {vendorTickets.map((t) => (
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

      {/* Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Open Support Ticket</h3>
              <button 
                type="button" 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" 
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Subject / Issue Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly describe the issue..."
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Detailed Explanation</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide order numbers, screenshots or details..."
                    value={ticketBody}
                    onChange={(e) => setTicketBody(e.target.value)}
                    className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
