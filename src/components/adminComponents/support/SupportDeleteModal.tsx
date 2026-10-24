import React from 'react';
import { Trash2 } from 'lucide-react';
import type { VendorSupportTicket } from '../../../services/vendorAdminSupportService';

interface SupportDeleteModalProps {
  ticketToDelete: VendorSupportTicket | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SupportDeleteModal: React.FC<SupportDeleteModalProps> = ({
  ticketToDelete,
  onCancel,
  onConfirm
}) => {
  if (!ticketToDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
        style={{ borderRadius: '24px' }}
      >
        {/* Top Red Tint Squircle Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
          <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Delete Ticket?
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
          Are you sure you want to delete ticket <span className="font-semibold text-slate-700">#{ticketToDelete.id}</span> from {ticketToDelete.vendorName || 'Vendor'} ({ticketToDelete.storeName || 'Store'})? This action cannot be undone.
        </p>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            style={{ borderRadius: '16px' }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
            style={{ 
              backgroundColor: '#B42318', 
              borderRadius: '16px' 
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
