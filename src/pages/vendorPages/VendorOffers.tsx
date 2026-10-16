import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { VendorOffersTable } from '../../components/vendorComponents/offers';

export interface VendorOfferItem {
  id: number;
  code: string;
  discount: string;
  scope: string;
  minSpend: string;
  claims: string;
  status: string;
}

export const VendorOffers: React.FC = () => {
  const [coupons, setCoupons] = useState<VendorOfferItem[]>([
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

      <VendorOffersTable
        coupons={coupons}
        copiedId={copiedId}
        onCopyCode={copyCode}
        onRemoveCoupon={removeCoupon}
      />
    </div>
  );
};

export default VendorOffers;
