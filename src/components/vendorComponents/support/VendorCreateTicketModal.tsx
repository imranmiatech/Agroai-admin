import React from 'react';
import { X } from 'lucide-react';

interface VendorCreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketSubject: string;
  setTicketSubject: (val: string) => void;
  ticketBody: string;
  setTicketBody: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const VendorCreateTicketModal: React.FC<VendorCreateTicketModalProps> = ({
  isOpen,
  onClose,
  ticketSubject,
  setTicketSubject,
  ticketBody,
  setTicketBody,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Open Support Ticket</h3>
          <button 
            type="button" 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" 
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit}>
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
              onClick={onClose}
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
  );
};
