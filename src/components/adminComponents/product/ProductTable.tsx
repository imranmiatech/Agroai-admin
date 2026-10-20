import React from 'react';
import { Package, Store, Eye, Edit3, Ban, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductItem } from '../../../pages/adminPages/AdminProduct';

interface ProductTableProps {
  products: ProductItem[];
  startIndex: number;
  itemsPerPage: number;
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onView: (product: ProductItem) => void;
  onEdit: (product: ProductItem) => void;
  onSuspend: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
  showVendorColumn?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  startIndex,
  itemsPerPage,
  totalFiltered,
  currentPage,
  totalPages,
  setCurrentPage,
  onView,
  onEdit,
  onSuspend,
  onDelete,
  showVendorColumn = true,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Stock</th>
              {showVendorColumn && <th className="py-4 px-6">Vendor</th>}
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={showVendorColumn ? 7 : 6} className="py-12 text-center text-slate-400 text-xs">
                  No products found matching your filter criteria.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Product Name & SKU */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.title} 
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200/80 shadow-2xs" 
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs text-[#062E35]"
                          style={{ backgroundColor: product.imageColor || '#E0F7FA' }}
                        >
                          <Package className="w-5 h-5 opacity-90" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 max-w-xs sm:max-w-sm">
                        <span 
                          onClick={() => onView(product)}
                          className="font-semibold text-slate-900 text-sm leading-tight truncate hover:text-[#062E35] cursor-pointer"
                          title={product.title}
                        >
                          {product.title}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 font-mono">
                          {product.sku}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category Capsule */}
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F7FA] text-[#00695C]">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                    ৳{product.price.toFixed(2)}
                  </td>

                  {/* Stock status with indicator dot */}
                  <td className="py-4 px-6 text-xs">
                    {product.stock > 10 ? (
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{product.stock} units</span>
                      </div>
                    ) : product.stock > 0 ? (
                      <div className="flex items-center gap-1.5 font-semibold text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Low ({product.stock} left)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-semibold text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Out of stock</span>
                      </div>
                    )}
                  </td>

                  {/* Vendor */}
                  {showVendorColumn && (
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span>{product.vendor}</span>
                      </div>
                    </td>
                  )}

                  {/* Status Pill */}
                  <td className="py-4 px-6">
                    {product.status === 'Active' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        <span>Active</span>
                      </span>
                    )}
                    {product.status === 'Suspended' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        <span>Suspended</span>
                      </span>
                    )}
                    {product.status === 'Out of Stock' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20]" />
                        <span>Out of Stock</span>
                      </span>
                    )}
                  </td>

                  {/* 4 Action Icons: View, Edit, Suspend, Delete */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View product details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit({ ...product })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#062E35] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onSuspend(product)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          product.status === 'Suspended'
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                        title={product.status === 'Suspended' ? 'Reactivate product' : 'Suspend product'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{totalFiltered === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + itemsPerPage, totalFiltered)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{totalFiltered}</span> products
        </div>

        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#062E35] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
