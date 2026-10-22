import React from 'react';
import { 
  MapPin, 
  Sprout, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquareReply 
} from 'lucide-react';
import type { FarmerInquiry } from '../expertData';

interface FarmerInquiryQueueProps {
  inquiries: FarmerInquiry[];
  onSelectInquiry: (inquiry: FarmerInquiry) => void;
  onViewAll: () => void;
}

export const FarmerInquiryQueue: React.FC<FarmerInquiryQueueProps> = ({
  inquiries,
  onSelectInquiry,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Farmer Inquiries Requiring Expert Action
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {inquiries.filter((i) => i.status !== 'RESOLVED').length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Diagnose plant issues, pest attacks, and prescribe immediate treatments.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0E4F5A] hover:text-[#062E35] transition-colors cursor-pointer"
        >
          <span>View All Inquiries</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Inquiry List */}
      <div className="flex flex-col divide-y divide-slate-100">
        {inquiries.slice(0, 3).map((item) => {
          const isUrgent = item.urgency === 'URGENT';
          const isHigh = item.urgency === 'HIGH';

          return (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 -mx-3 px-3 rounded-xl transition-colors"
            >
              {/* Left Column: Inquiry details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {/* Image / Thumbnail if provided or Crop Badge */}
                {item.imageUrls && item.imageUrls.length > 0 ? (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.cropName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-50 border border-emerald-200/60 flex flex-col items-center justify-center shrink-0 text-emerald-800">
                    <Sprout className="w-6 h-6 text-emerald-600" />
                  </div>
                )}

                <div className="flex flex-col min-w-0 flex-1">
                  {/* Tag bar */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] mb-1">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.urgency}
                    </span>
                    <span className="font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                      {item.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.createdAt}
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>

                  {/* Farmer details */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 flex-wrap">
                    <span className="font-semibold text-slate-800">
                      {item.farmerName}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.farmerLocation}
                    </span>
                    <span className="text-emerald-700 font-medium">
                      Crop: {item.cropName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                {item.status === 'RESOLVED' ? (
                  <button
                    type="button"
                    onClick={() => onSelectInquiry(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Prescription</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectInquiry(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E4F5A] hover:bg-[#062E35] text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <MessageSquareReply className="w-3.5 h-3.5" />
                    <span>Diagnose & Advise</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
