import { useState } from 'react';
import { Tag, Plus, Check, Trash2 } from 'lucide-react';

export const VendorOffers = () => {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'APEX15', discount: '15% OFF', scope: 'All Audio Devices', minSpend: '$80', claims: '142 used', status: 'Active' },
    { id: 2, code: 'GAMER50', discount: '$50 FLAT OFF', scope: 'Keyboards & Mice', minSpend: '$150', claims: '68 used', status: 'Active' },
    { id: 3, code: 'EARLYFALL', discount: '10% OFF', scope: 'Storewide', minSpend: '$40', claims: '310 used', status: 'Expired' },
  ]);

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeCoupon = (id: number) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Store Offers & Promotional Coupons</h2>
          <p className="text-sm text-slate-500 mt-1">Create store-specific discount vouchers to boost buyer conversion rates.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Store Offer</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
                      onClick={() => copyCode(coupon.id, coupon.code)}
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
                      onClick={() => removeCoupon(coupon.id)}
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
    </div>
  );
};
