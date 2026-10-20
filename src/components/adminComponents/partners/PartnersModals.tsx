import React from 'react';
import { Building2, X } from 'lucide-react';
import type { PartnershipRequest, RequestStatus } from '../../../pages/adminPages/VendorsPage';

interface PartnersModalsProps {
  selectedRequest: PartnershipRequest | null;
  setSelectedRequest: (req: PartnershipRequest | null) => void;
  handleUpdateStatus: (id: string, newStatus: RequestStatus) => void;
}

export const PartnersModals: React.FC<PartnersModalsProps> = ({
  selectedRequest,
  setSelectedRequest,
  handleUpdateStatus,
}) => {
  return (
    <>
      {/* DETAIL MODAL FOR PARTNERSHIP REQUEST */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedRequest.businessName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-medium text-slate-600">{selectedRequest.category}</span>
                    <span>·</span>
                    <span>Submitted {selectedRequest.submittedDate}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Contact Details */}
            <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Contact Person</span>
                  <span className="text-slate-800 font-medium">{selectedRequest.ownerName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Phone</span>
                  <span className="text-slate-800 font-medium">{selectedRequest.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">Email Address</span>
                  <span className="text-slate-800 font-medium">{selectedRequest.email}</span>
                </div>
              </div>
            </div>

            {/* Change Status Controls */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">Update Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'PENDING')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'PENDING' 
                      ? 'bg-[#FEF3C7] text-[#D97706] ring-2 ring-[#D97706]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  PENDING
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'APPROVED')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'APPROVED' 
                      ? 'bg-[#DCFCE7] text-[#16A34A] ring-2 ring-[#16A34A]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  APPROVED
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'REJECTED')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'REJECTED' 
                      ? 'bg-[#FEE4E2] text-[#D92D20] ring-2 ring-[#D92D20]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  REJECTED
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'SUSPENDED')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRequest.status === 'SUSPENDED' 
                      ? 'bg-[#F1F5F9] text-[#475569] ring-2 ring-[#475569]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  SUSPENDED
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 rounded-xl bg-[#062E35] text-white text-xs font-semibold hover:bg-[#0A434D] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
