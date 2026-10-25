import React from 'react';
import { Tag, Check, Clock, Trash2 } from 'lucide-react';
export interface AdminOfferItem {
  id: number;
  code: string;
  title?: string;
  description?: string;
  discount: string;
  category?: string;
  type?: string;
  minSpend?: string;
  expiry?: string;
  expiryDate?: string;
  usage?: string;
  usageCount?: number;
  maxUsage?: number;
  status: 'Active' | 'Scheduled' | 'Expired' | string;
}

interface AdminOffersTableProps {
  offers: AdminOfferItem[];
  copiedId: number | null;
  onCopyCode: (id: number, code: string) => void;
  onRemoveOffer: (id: number) => void;
}

export const AdminOffersTable: React.FC<AdminOffersTableProps> = ({
  offers,
  copiedId,
  onCopyCode,
  onRemoveOffer,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
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
                    onClick={() => onCopyCode(offer.id, offer.code)}
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
                    onClick={() => onRemoveOffer(offer.id)}
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
