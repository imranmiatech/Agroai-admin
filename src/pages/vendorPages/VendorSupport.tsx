import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  VendorSupportCards,
  VendorSupportTable,
  VendorCreateTicketModal,
} from '../../components/vendorComponents/support';

export interface VendorTicket {
  id: string;
  subject: string;
  status: string;
  date: string;
  replies: number;
}

export const VendorSupport: React.FC = () => {
  const [vendorTickets, setVendorTickets] = useState<VendorTicket[]>([
    { id: 'TKT-1042', subject: 'Payout API verification delay on stripe', status: 'In Review', date: 'Oct 15, 2026', replies: 2 },
    { id: 'TKT-9821', subject: 'Custom brand packaging approval request', status: 'Resolved', date: 'Oct 02, 2026', replies: 5 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;

    const newTkt: VendorTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      status: 'In Review',
      date: 'Today',
      replies: 1,
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

      {/* Support Cards */}
      <VendorSupportCards />

      {/* Tickets Table */}
      <VendorSupportTable tickets={vendorTickets} />

      {/* Ticket Modal */}
      <VendorCreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketSubject={ticketSubject}
        setTicketSubject={setTicketSubject}
        ticketBody={ticketBody}
        setTicketBody={setTicketBody}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
};

export default VendorSupport;
