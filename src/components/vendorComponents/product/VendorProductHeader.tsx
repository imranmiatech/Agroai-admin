import React from 'react';

interface VendorProductHeaderProps {
  onOpenDefaultProducts: () => void;
  onOpenAddProduct: () => void;
}

export const VendorProductHeader: React.FC<VendorProductHeaderProps> = ({
  onOpenDefaultProducts,
  onOpenAddProduct
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Products
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage the products and services you make available through Krisikunjo.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onOpenDefaultProducts}
          className="px-4 py-2.5 rounded-xl border border-[#0E4F5A] text-[#0E4F5A] bg-white hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer shadow-xs"
        >
          Manage Default Products
        </button>
        <button
          type="button"
          onClick={onOpenAddProduct}
          className="px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white font-semibold text-sm transition-all cursor-pointer shadow-sm active:scale-98"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
};
