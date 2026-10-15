import { useState } from 'react';
import { Tag, Plus, Check, Clock, Trash2 } from 'lucide-react';

export const AdminOffers = () => {
  const [offers, setOffers] = useState([
    { id: 1, code: 'PLATFORM25', discount: '25% OFF', type: 'Site-wide Discount', minSpend: '$100', expiry: 'Nov 30, 2026', usage: '3,840 claims', status: 'Active' },
    { id: 2, code: 'FREESHIP26', discount: 'Free Shipping', type: 'Cart Promotion', minSpend: '$50', expiry: 'Dec 15, 2026', usage: '12,920 claims', status: 'Active' },
    { id: 3, code: 'BLACKFRIDAY50', discount: '50% OFF', type: 'Seasonal Blitz', minSpend: '$200', expiry: 'Oct 01, 2026', usage: '28,100 claims', status: 'Expired' },
  ]);

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeOffer = (id: number) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Promotions & Vouchers (Admin)</h2>
          <p className="text-sm text-slate-500 mt-1">Create platform-wide campaign discounts, coupons, and cart incentives.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Global Coupon</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Campaign Type</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => copyCode(offer.id, offer.code)}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 border border-dashed border-indigo-400 px-3 py-1.5 rounded-lg font-mono font-bold text-xs text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
                      title="Click to copy"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{offer.code}</span>
                      {copiedId === offer.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{offer.discount}</td>
                  <td className="py-3.5 px-4 text-slate-600">{offer.type}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{offer.minSpend}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{offer.expiry}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{offer.usage}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      offer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                      title="Delete Campaign"
                      onClick={() => removeOffer(offer.id)}
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
