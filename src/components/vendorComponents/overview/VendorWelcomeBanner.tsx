import React from 'react';

interface VendorWelcomeBannerProps {
  onOpenAddProduct: () => void;
}

export const VendorWelcomeBanner: React.FC<VendorWelcomeBannerProps> = ({
  onOpenAddProduct
}) => {
  return (
    <div 
      className="w-full rounded-2xl bg-[#0B5460] p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm"
      style={{ backgroundColor: '#0B5460' }}
    >
      {/* Decorative subtle concentric arches on right */}
      <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-20">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white" />
        <div className="absolute -right-10 -top-10 w-80 h-80 rounded-full border border-white" />
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full border border-white" />
      </div>

      {/* Banner Left Info */}
      <div className="relative z-10">
        <span className="text-white/80 text-sm font-normal">
          Good afternoon,
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
          Carefour <span className="text-2xl select-none">👋</span>
        </h1>
        <p className="text-white/75 text-sm mt-1.5 font-normal">
          Here's how your partnership with Krisikunjo is performing.
        </p>
      </div>

      {/* Banner Right Actions */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3">
       
        <button
          type="button"
          onClick={onOpenAddProduct}
          className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold transition-all cursor-pointer active:scale-98"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
};
