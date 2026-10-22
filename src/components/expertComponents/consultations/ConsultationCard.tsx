import React from 'react';
import { 
  MapPin, 
  Sprout, 
  Clock, 
  CheckCircle2, 
  MessageSquareReply 
} from 'lucide-react';
import type { FarmerInquiry } from '../expertData';

interface ConsultationCardProps {
  inquiry: FarmerInquiry;
  onOpenReply: (inquiry: FarmerInquiry) => void;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({
  inquiry,
  onOpenReply,
}) => {
  const isUrgent = inquiry.urgency === 'URGENT';
  const isHigh = inquiry.urgency === 'HIGH';
  const isResolved = inquiry.status === 'RESOLVED';
  const isInProgress = inquiry.status === 'IN_PROGRESS';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group">
      {/* Top Header: Urgency + Category + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              isUrgent
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : isHigh
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {inquiry.urgency}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            {inquiry.category}
          </span>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isResolved
              ? 'bg-emerald-100 text-emerald-800'
              : isInProgress
              ? 'bg-sky-100 text-sky-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isResolved ? 'Resolved' : isInProgress ? 'In Progress' : 'Pending Diagnosis'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Photo evidence if provided */}
        {inquiry.imageUrls && inquiry.imageUrls.length > 0 && (
          <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs">
            <img
              src={inquiry.imageUrls[0]}
              alt={inquiry.cropName}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
              Photo
            </span>
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0E4F5A] transition-colors leading-snug">
            {inquiry.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
            {inquiry.description}
          </p>

          {/* Farmer & Location details */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">{inquiry.farmerName}</span>
              <span className="text-slate-400">({inquiry.farmerPhone})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{inquiry.farmerLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Sprout className="w-3.5 h-3.5 shrink-0" />
              <span>Crop: {inquiry.cropName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{inquiry.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Preview if resolved */}
      {isResolved && inquiry.prescription && (
        <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/70 p-3.5 text-xs text-slate-800">
          <div className="flex items-center justify-between font-bold text-emerald-800 mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Prescription Provided ({inquiry.prescription.resolvedAt})
            </span>
          </div>
          <p className="text-slate-700">
            <strong>Diagnosis:</strong> {inquiry.prescription.diagnosis}
          </p>
          <p className="text-slate-600 mt-0.5 truncate">
            <strong>Rx:</strong> {inquiry.prescription.treatment}
          </p>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <span className="text-xs text-slate-400 font-mono">
          Ref #{inquiry.id}
        </span>

        <button
          type="button"
          onClick={() => onOpenReply(inquiry)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            isResolved
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-[#0E4F5A] hover:bg-[#062E35] text-white shadow-xs hover:shadow-md'
          }`}
        >
          <MessageSquareReply className="w-4 h-4" />
          <span>{isResolved ? 'Review Advice & Update' : 'Diagnose & Prescribe'}</span>
        </button>
      </div>
    </div>
  );
};
