import React, { useState, useEffect } from 'react';
import {
  Percent,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  DollarSign,
  Wallet,
} from 'lucide-react';
import {
  useGetCommissionSettingQuery,
  useUpdateCommissionSettingMutation,
} from '../../../redux';

export const AdminCommissionSettings: React.FC = () => {
  const { data: commissionData, isLoading, refetch } = useGetCommissionSettingQuery();
  const [updateCommission, { isLoading: isUpdating }] = useUpdateCommissionSettingMutation();

  const payoutDelay = commissionData?.data?.payoutDelayMinutes ?? 10;

  const [rateInput, setRateInput] = useState<string>('5.0');
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (commissionData?.data?.commissionPercentage !== undefined) {
      setRateInput(commissionData.data.commissionPercentage.toString());
    }
  }, [commissionData]);

  const numRate = parseFloat(rateInput) || 0;
  const safeRate = Math.max(0, Math.min(100, numRate));

  // Example calculation for $100 product
  const exampleAmount = 100;
  const adminCommissionAmount = Number(((exampleAmount * safeRate) / 100).toFixed(2));
  const vendorPayoutAmount = Number((exampleAmount - adminCommissionAmount).toFixed(2));

  const handlePreset = (preset: number) => {
    setRateInput(preset.toString());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    if (isNaN(numRate) || numRate < 0 || numRate > 100) {
      setErrorMsg('Please enter a valid commission percentage between 0% and 100%.');
      return;
    }

    try {
      await updateCommission({ commissionPercentage: safeRate }).unwrap();
      setSuccessMsg(true);
      refetch();
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setErrorMsg(errorObj?.data?.message || 'Failed to update commission setting. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Platform Commission & Automated Vendor Payout
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure the revenue percentage fee retained by Admin on product sales and the automated 10-minute vendor payout schedule.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>{payoutDelay}-Minute Automated Payout Engine Active</span>
        </div>
      </div>

      {/* 2. Process Timeline / Pipeline explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4.5 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs shrink-0">
            1
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Admin Account 1st</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Customer pays for order. 100% of payment funds land immediately in Admin platform account.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs shrink-0">
            2
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Admin Commission ({safeRate}%)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Admin retains the configured percentage fee per product sale as platform operational revenue.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs shrink-0">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Vendor Payout ({100 - safeRate}%)</span>
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Exactly 10 minutes after payment/delivery completion, remaining vendor balance is automatically transferred.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form & Live Calculation */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Input & Presets */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admin Commission Percentage (%)
            </label>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                placeholder="e.g. 5.0"
                className="w-full pl-4 pr-12 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-base font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                %
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
              {[2, 5, 8, 10, 12, 15, 20].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    safeRate === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          {/* Live Calculation Preview Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Calculation Model
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Per $100 Product
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-1 border-t border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gross Product Price</span>
                </span>
                <span className="font-bold text-white">${exampleAmount}.00</span>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Commission ({safeRate}%)</span>
                </span>
                <span className="font-bold text-emerald-400">+${adminCommissionAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Vendor 10-Min Payout ({100 - safeRate}%)</span>
                </span>
                <span className="font-bold text-white">${vendorPayoutAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-tight pt-1 border-t border-slate-700/60 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Funds are released to the vendor exactly 10 minutes post-transaction.</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Platform commission rate updated to {safeRate}%! All future order settlements will use this rate with the 10-minute automated payout schedule.</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isUpdating || isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#062E35] text-white hover:bg-[#0E4F5A] active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Updating Commission...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Save Commission Setting</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
