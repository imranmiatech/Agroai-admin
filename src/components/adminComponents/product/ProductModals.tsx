import React, { useState } from 'react';
import { 
  Package, 
  Edit3, 
  Trash2, 
  Ban, 
  X, 
  Store, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import type { ProductItem } from '../../../pages/adminPages/AdminProduct';

interface ProductViewModalContentProps {
  product: ProductItem;
  onClose: () => void;
  onEdit: () => void;
}

const ProductViewModalContent: React.FC<ProductViewModalContentProps> = ({
  product,
  onClose,
  onEdit,
}) => {
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.thumbnail ? [product.thumbnail] : []);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const numericPrice = product.price || 0;
  const numericComparePrice = product.compareAtPrice || 0;
  const hasDiscount = numericComparePrice > numericPrice && numericPrice > 0;
  const discountPercent = hasDiscount 
    ? Math.round(((numericComparePrice - numericPrice) / numericComparePrice) * 100)
    : 0;

  const currentDisplayImg = images[selectedImgIdx] || images[0] || null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#00695C] border border-teal-100">
              {product.category}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {product.sku}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex flex-col gap-6">
          {/* 1. Media Showcase */}
          {currentDisplayImg ? (
            <div className="flex flex-col gap-3">
              <div className="h-64 sm:h-72 w-full rounded-2xl bg-slate-900/5 relative overflow-hidden border border-slate-200/80 shadow-2xs group flex items-center justify-center">
                <img
                  src={currentDisplayImg}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                    -{discountPercent}% OFF
                  </span>
                )}
                <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
                  product.status === 'Active' || product.status === 'ACTIVE'
                    ? 'bg-emerald-600/90 text-white'
                    : product.status === 'Suspended' || product.status === 'SUSPENDED'
                    ? 'bg-amber-600/90 text-white'
                    : 'bg-rose-600/90 text-white'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {product.status}
                </span>
              </div>

              {/* Gallery Thumbnails Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImgIdx === idx
                          ? 'border-[#062E35] ring-2 ring-[#062E35]/20 shadow-xs'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-teal-50 to-slate-100 border border-teal-100/70 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs text-[#062E35]"
                  style={{ backgroundColor: product.imageColor || '#E0F7FA' }}
                >
                  <Package className="w-8 h-8 opacity-80" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0E4F5A] uppercase tracking-wider block">
                    Product Catalogue Item
                  </span>
                  <div className="text-sm font-semibold text-slate-600 mt-0.5">
                    No custom media uploaded
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                product.status === 'Active' || product.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : product.status === 'Suspended' || product.status === 'SUSPENDED'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {product.status}
              </span>
            </div>
          )}

          {/* 2. Title & Promotional Summary */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h2>
            {product.summary && (
              <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed italic">
                "{product.summary}"
              </p>
            )}
          </div>

          {/* 3. Three Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Price Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Selling Price
              </span>
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    ৳{numericPrice.toFixed(2)}
                  </span>
                  {numericComparePrice > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{numericComparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="text-[11px] font-bold text-emerald-600 mt-0.5 block">
                    Save ৳{(numericComparePrice - numericPrice).toFixed(2)} ({discountPercent}% off)
                  </span>
                )}
              </div>
            </div>

            {/* Inventory / Stock Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Inventory Stock
              </span>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">
                  {product.stock}
                  <span className="text-xs font-semibold text-slate-500 ml-1">units</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${
                    product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-[11px] font-bold text-slate-600">
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Partner Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Store / Vendor
              </span>
              <div className="mt-2">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                  <Store className="w-4 h-4 text-[#062E35] shrink-0" />
                  <span className="truncate">{product.vendor}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Merchant</span>
                </span>
              </div>
            </div>
          </div>

          {/* 4. Badges (Feature Tags) */}
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Badges
              </span>
              <div className="flex flex-wrap gap-2">
                {product.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Key Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Highlights
              </span>
              <div className="flex flex-col gap-2">
                {product.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Technical Specifications
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-400">{key}</span>
                    <span className="font-bold text-slate-800">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Detailed Description */}
          {product.description && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Description
              </span>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            ID: {product.id}
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>Edit Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductModalsProps {
  viewingProduct: ProductItem | null;
  setViewingProduct: (p: ProductItem | null) => void;
  editingProduct: ProductItem | null;
  setEditingProduct: (p: ProductItem | null) => void;
  handleSaveEdit: (e: React.FormEvent) => void;
  productToSuspend: ProductItem | null;
  setProductToSuspend: (p: ProductItem | null) => void;
  handleToggleSuspend: (p: ProductItem) => void;
  productToDelete: ProductItem | null;
  setProductToDelete: (p: ProductItem | null) => void;
  handleConfirmDelete: () => void;
  showAddProductModal: boolean;
  setShowAddProductModal: (show: boolean) => void;
  newProductForm: {
    title: string;
    sku: string;
    category: ProductItem['category'];
    price: string;
    stock: string;
    vendor: string;
    description: string;
  };
  setNewProductForm: React.Dispatch<React.SetStateAction<{
    title: string;
    sku: string;
    category: ProductItem['category'];
    price: string;
    stock: string;
    vendor: string;
    description: string;
  }>>;
  handleCreateProduct: (e: React.FormEvent) => void;
  categoryOptions: string[];
  fixedVendor?: string;
  onEditDirect?: (p: ProductItem) => void;
}

export const ProductModals: React.FC<ProductModalsProps> = ({
  viewingProduct,
  setViewingProduct,
  editingProduct,
  setEditingProduct,
  handleSaveEdit,
  productToSuspend,
  setProductToSuspend,
  handleToggleSuspend,
  productToDelete,
  setProductToDelete,
  handleConfirmDelete,
  showAddProductModal,
  setShowAddProductModal,
  newProductForm,
  setNewProductForm,
  handleCreateProduct,
  categoryOptions,
  fixedVendor,
  onEditDirect,
}) => {
  return (
    <>
      {/* MODAL 1: VIEW PRODUCT DETAILS (BEAUTIFUL, CLEAN, MODERN) */}
      {viewingProduct && (
        <ProductViewModalContent
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onEdit={() => {
            const p = viewingProduct;
            setViewingProduct(null);
            if (onEditDirect) {
              onEditDirect(p);
            } else {
              setEditingProduct({ ...p });
            }
          }}
        />
      )}

      {/* MODAL 2: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Product</h3>
                  <p className="text-xs text-slate-400 font-mono">{editingProduct.sku}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Title:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-1 focus:ring-[#062E35]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category:
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductItem['category'] })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    {categoryOptions.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Price (৳):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Stock Quantity:
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      stock: parseInt(e.target.value) || 0,
                      status: parseInt(e.target.value) === 0 ? 'Out of Stock' : editingProduct.status
                    })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Status:
                  </label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as ProductItem['status'] })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Vendor Partner:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.vendor}
                  onChange={(e) => setEditingProduct({ ...editingProduct, vendor: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUSPEND / REACTIVATE CONFIRMATION */}
      {productToSuspend && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center mb-5 shrink-0">
              <Ban className="w-6 h-6 text-[#D97706]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {productToSuspend.status === 'Suspended' ? 'Reactivate Product?' : 'Suspend Product?'}
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              {productToSuspend.status === 'Suspended'
                ? `Reactivating will make "${productToSuspend.title}" visible again to customers.`
                : `Suspending will temporarily hide "${productToSuspend.title}" from store search and listings.`}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setProductToSuspend(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleToggleSuspend(productToSuspend)}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: productToSuspend.status === 'Suspended' ? '#062E35' : '#D97706',
                  borderRadius: '16px' 
                }}
              >
                {productToSuspend.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FIGMA DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete Product?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{productToDelete.title}</span> ({productToDelete.sku})? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ borderRadius: '16px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: '#B42318', 
                  borderRadius: '16px' 
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD NEW PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Product</h3>
                  <p className="text-xs text-slate-400">Add product merchandise to the Krisikunjo store</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cotton Baby Sleepsuit Set"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-1 focus:ring-[#062E35]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category:
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as ProductItem['category'] })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    {categoryOptions.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    SKU Code:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ALU-BC-099"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Price (৳):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="29.99"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Initial Stock:
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              {!fixedVendor && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Vendor Partner:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PureBotanica Organics"
                    value={newProductForm.vendor}
                    onChange={(e) => setNewProductForm({ ...newProductForm, vendor: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="Short product overview and specifications..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
