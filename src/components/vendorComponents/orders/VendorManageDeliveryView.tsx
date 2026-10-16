import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface VendorManageDeliveryViewProps {
  onBack: () => void;
  baseFee: string;
  setBaseFee: (val: string) => void;
  ratePerKm: string;
  setRatePerKm: (val: string) => void;
  minDistance: string;
  setMinDistance: (val: string) => void;
  deliverySavedNotice: boolean;
  handleSaveDeliveryFee: (e: React.FormEvent) => void;
}

export const VendorManageDeliveryView: React.FC<VendorManageDeliveryViewProps> = ({
  onBack,
  baseFee,
  setBaseFee,
  ratePerKm,
  setRatePerKm,
  minDistance,
  setMinDistance,
  deliverySavedNotice,
  handleSaveDeliveryFee
}) => {
  const calculatedDistance = 5;
  const extraKm = Math.max(0, calculatedDistance - parseFloat(minDistance || '0'));
  const calculatedExtraFee = extraKm * parseFloat(ratePerKm || '0');
  const calculatedTotalFee = (parseFloat(baseFee || '0') + calculatedExtraFee).toFixed(2);

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter'] animate-in fade-in duration-200">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          title="Back to Orders"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manage Delivery Fee
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure how delivery fees are calculated for your store.
          </p>
        </div>
      </div>

      {deliverySavedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Delivery fee settings saved successfully!
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Card: Delivery Fee Structure */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-900">
            Delivery Fee Structure
          </h2>

          <form onSubmit={handleSaveDeliveryFee} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Base Fee */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Base Fee (AED)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={baseFee}
                    onChange={(e) => setBaseFee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-1 focus:ring-[#0E4F5A]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    AED
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Applied to all orders before distance calculation.
                </span>
              </div>

              {/* Rate per Kilometer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rate per Kilometer (AED/km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={ratePerKm}
                    onChange={(e) => setRatePerKm(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-1 focus:ring-[#0E4F5A]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    AED/km
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Charge per additional kilometer.
                </span>
              </div>
            </div>

            {/* Minimum Delivery Distance */}
            <div className="sm:w-1/2 pr-0 sm:pr-2.5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Minimum Delivery Distance (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={minDistance}
                  onChange={(e) => setMinDistance(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-1 focus:ring-[#0E4F5A]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  km
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Distance included in the base fee.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: How it works & Example Calculation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900">
            How it works
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Distance-based delivery calculates the fee based on the straight-line distance between your store location and the customer's delivery address.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2.5 mt-2">
            <span className="text-xs font-bold text-slate-900">
              Example Calculation:
            </span>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Base Fee:</span>
              <span className="font-semibold text-slate-900">{parseFloat(baseFee || '0').toFixed(2)} AED</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Distance (5km):</span>
              <span className="font-semibold text-slate-900">+{calculatedExtraFee.toFixed(2)} AED</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Total Fee:</span>
              <span className="font-bold text-slate-900">{calculatedTotalFee} AED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
