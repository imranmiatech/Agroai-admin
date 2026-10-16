import React from 'react';
import { Tag, Check, Trash2 } from 'lucide-react';
import type { VendorOfferItem } from '../../../pages/vendorPages/VendorOffers';

interface VendorOffersTableProps {
  coupons: VendorOfferItem[];
  copiedId: number | null;
  onCopyCode: (id: number, code: string) => void;
  onRemoveCoupon: (id: number) => void;
}

export const VendorOffersTable: React.FC<VendorOffersTableProps> = ({
  coupons,
  copiedId,
  onCopyCode,
  onRemoveCoupon,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Scope</th>
              <th className="py-3 px-4">Threshold</th>
              <th className="py-3 px-4">Claims</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => onCopyCode(coupon.id, coupon.code)}
                    className="inline-flex items-center gap-1.5 bg-sky-50 border border-dashed border-sky-400 px-3 py-1.5 rounded-lg font-mono font-bold text-xs text-sky-700 hover:bg-sky-100 transition-all cursor-pointer"
                    title="Click to copy"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{coupon.code}</span>
                    {copiedId === coupon.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{coupon.discount}</td>
                <td className="py-3.5 px-4 text-slate-600">{coupon.scope}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">{coupon.minSpend}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{coupon.claims}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    coupon.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                    title="Delete Coupon"
                    onClick={() => onRemoveCoupon(coupon.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
