import React from 'react';
import { X } from 'lucide-react';

interface VendorOverviewModalsProps {
  showCreateOfferModal: boolean;
  setShowCreateOfferModal: (show: boolean) => void;
  newOfferTitle: string;
  setNewOfferTitle: (val: string) => void;
  newOfferDiscount: string;
  setNewOfferDiscount: (val: string) => void;
  newOfferCategory: string;
  setNewOfferCategory: (val: string) => void;
  newOfferDate: string;
  setNewOfferDate: (val: string) => void;
  handleCreateOfferSubmit: (e: React.FormEvent) => void;
  showAddProductModal: boolean;
  setShowAddProductModal: (show: boolean) => void;
  newProductName: string;
  setNewProductName: (val: string) => void;
  newProductCategory: string;
  setNewProductCategory: (val: string) => void;
  newProductPrice: string;
  setNewProductPrice: (val: string) => void;
  handleAddProductSubmit: (e: React.FormEvent) => void;
}

export const VendorOverviewModals: React.FC<VendorOverviewModalsProps> = ({
  showCreateOfferModal,
  setShowCreateOfferModal,
  newOfferTitle,
  setNewOfferTitle,
  newOfferDiscount,
  setNewOfferDiscount,
  newOfferCategory,
  setNewOfferCategory,
  newOfferDate,
  setNewOfferDate,
  handleCreateOfferSubmit,
  showAddProductModal,
  setShowAddProductModal,
  newProductName,
  setNewProductName,
  newProductCategory,
  setNewProductCategory,
  newProductPrice,
  setNewProductPrice,
  handleAddProductSubmit
}) => {
  return (
    <>
      {/* Modal: Create Offer */}
      {showCreateOfferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create New Offer</h3>
              <button
                type="button"
                onClick={() => setShowCreateOfferModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfferSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Offer Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25% OFF Summer Bundle"
                  value={newOfferTitle}
                  onChange={(e) => setNewOfferTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Discount
                  </label>
                  <input
                    type="text"
                    value={newOfferDiscount}
                    onChange={(e) => setNewOfferDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={newOfferDate}
                    onChange={(e) => setNewOfferDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Applicable Category
                </label>
                <input
                  type="text"
                  value={newOfferCategory}
                  onChange={(e) => setNewOfferCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateOfferModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#0B5460] hover:bg-[#08424C] text-white shadow-sm cursor-pointer"
                >
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Fruit Puree Pack"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  >
                    <option value="Nutrition">Nutrition</option>
                    <option value="Baby Care">Baby Care</option>
                    <option value="Toys">Toys</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B5460]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#0B5460] hover:bg-[#08424C] text-white shadow-sm cursor-pointer"
                >
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
