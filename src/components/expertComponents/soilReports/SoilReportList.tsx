import React from 'react';
import { 
  MapPin, 
  Sprout, 
  TestTube2, 
  FileCheck 
} from 'lucide-react';
import type { SoilTestSubmission } from '../expertData';

interface SoilReportListProps {
  reports: SoilTestSubmission[];
  onSelectReport: (report: SoilTestSubmission) => void;
}

export const SoilReportList: React.FC<SoilReportListProps> = ({
  reports,
  onSelectReport,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Soil Testing & Lab Report Advisory Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review 20+ laboratory parameters (pH, organic carbon, N-P-K, micronutrients) submitted by farmers and provide customized fertilizer schedules.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {reports.map((item) => {
          const isPending = item.expertStatus === 'PENDING_REVIEW';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
            >
              {/* Top Row: Lab ID & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <TestTube2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-800 block">
                      {item.labReportNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sampled: {item.sampleCollectedDate}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPending
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isPending ? 'Pending Advisory' : 'Advisory Issued'}
                </span>
              </div>

              {/* Farmer and Crop Planned */}
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {item.farmerName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.farmLocation}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Sprout className="w-3.5 h-3.5" />
                    Target Crop: {item.cropPlanned}
                  </span>
                </div>

                {/* Lab Parameter Metrics Pills */}
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">pH Level</span>
                    <span className={`font-bold ${item.parameters.ph < 6 ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {item.parameters.ph}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Organic Carbon</span>
                    <span className="font-bold text-slate-800">{item.parameters.organicCarbon}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Nitrogen (N)</span>
                    <span className="font-bold text-slate-800">{item.parameters.nitrogen}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Phosphorus (P)</span>
                    <span className="font-bold text-slate-800">{item.parameters.phosphorus}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  ID: #{item.id}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectReport(item)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isPending
                      ? 'bg-[#0E4F5A] hover:bg-[#062E35] text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isPending ? 'Review & Issue Advisory' : 'View Issued Advisory'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
