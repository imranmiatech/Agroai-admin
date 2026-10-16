import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, Target, Edit3, AlertTriangle, Eye, Heart, CheckCircle2 } from 'lucide-react';

export const VendorRecentActivity: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (2 Cols): Recent Activity */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Recent Activity
        </h2>

        <div className="divide-y divide-slate-100 flex flex-col">
          {/* Item 1 */}
          <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                Offer "20% Off Organic Products" was approved by Krisikunjo
              </p>
              <span className="text-xs text-slate-400">2 hours ago</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                New product "Organic Baby Yogurt" added to catalogue
              </p>
              <span className="text-xs text-slate-400">5 hours ago</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                Offer redeemed at Kensington branch
              </p>
              <span className="text-xs text-slate-400">Yesterday</span>
            </div>
          </div>

          {/* Item 4 */}
          <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                Product "Toddler Snack Pack" was updated
              </p>
              <span className="text-xs text-slate-400">Yesterday</span>
            </div>
          </div>

          {/* Item 5 */}
          <div className="py-4 flex items-center gap-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition-all">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                "Back to School" offer expires in 3 days
              </p>
              <span className="text-xs text-slate-400">2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (1 Col): Top Performing Offer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <span className="text-slate-500 text-xs font-semibold tracking-wider block mb-3">
            Top Performing Offer
          </span>

          {/* Feature Card Matching Figma Teal Banner */}
          <div className="bg-gradient-to-br from-[#064E5B] to-[#0A6475] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="text-3xl font-extrabold tracking-tight">
              20% OFF
            </div>
            <div className="text-white/90 text-sm font-medium mt-1">
              Selected Kids' Products
            </div>
            <div className="text-white/70 text-xs mt-3">
              Valid until 30 September
            </div>
          </div>

          {/* Breakdown List */}
          <div className="mt-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-600">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>Views</span>
              </div>
              <span className="font-bold text-slate-900">1,240</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-600">
                <Heart className="w-4 h-4 text-slate-400" />
                <span>Saves</span>
              </div>
              <span className="font-bold text-slate-900">186</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <span>Redemptions</span>
              </div>
              <span className="font-bold text-slate-900">94</span>
            </div>
          </div>
        </div>

        {/* View Offers Button */}
        <button
          type="button"
          onClick={() => navigate('/vendor/offers')}
          className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all cursor-pointer text-center"
        >
          View offers
        </button>
      </div>
    </div>
  );
};
