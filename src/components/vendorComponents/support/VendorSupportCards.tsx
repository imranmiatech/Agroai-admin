import React from 'react';
import { LifeBuoy, CheckCircle2 } from 'lucide-react';

export const VendorSupportCards: React.FC = () => {
  return (
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
  );
};
