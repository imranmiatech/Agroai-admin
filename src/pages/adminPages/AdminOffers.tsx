import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminOffersTable } from '../../components/adminComponents/offers';

export interface AdminOfferItem {
  id: number;
  code: string;
  discount: string;
  type: string;
  minSpend: string;
  expiry: string;
  usage: string;
  status: string;
}

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<AdminOfferItem[]>([
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

      <AdminOffersTable
        offers={offers}
        copiedId={copiedId}
        onCopyCode={copyCode}
        onRemoveOffer={removeOffer}
      />
    </div>
  );
};

export default AdminOffers;
