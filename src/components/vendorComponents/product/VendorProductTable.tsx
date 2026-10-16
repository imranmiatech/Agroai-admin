import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { VendorProductItem } from '../../../pages/vendorPages/VendorProduct';

interface VendorProductTableProps {
  products: VendorProductItem[];
  onOpenEdit: (p: VendorProductItem) => void;
  onOpenDelete: (p: VendorProductItem) => void;
}

export const VendorProductTable: React.FC<VendorProductTableProps> = ({
  products,
  onOpenEdit,
  onOpenDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200/70 bg-[#FBFDFE]">
              <th className="py-4 px-6 text-sm font-bold text-slate-900">
                Product
              </th>
              <th className="py-4 px-6 text-sm font-bold text-slate-900">
                Category
              </th>
              <th className="py-4 px-6 text-sm font-bold text-slate-900">
                Price
              </th>
              <th className="py-4 px-6 text-sm font-bold text-slate-900">
                Offer
              </th>
              <th className="py-4 px-6 text-sm font-bold text-slate-900">
                Availability
              </th>
              <th className="py-4 px-6 text-sm font-bold text-slate-900">
                Status
              </th>
              <th className="py-4 px-6 text-sm font-bold text-slate-900 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No products found matching your search.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isOutOfStock = p.availability === 'Out of Stock';
                const isDraft = p.status === 'Draft';

                return (
                  <tr 
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Product Name */}
                    <td className="py-4.5 px-6 font-semibold text-slate-900">
                      {p.name}
                    </td>

                    {/* Category */}
                    <td className="py-4.5 px-6 font-medium text-[#0E4F5A]">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="py-4.5 px-6 font-semibold text-slate-900">
                      £{p.price.toFixed(2)}
                    </td>

                    {/* Offer Capsule */}
                    <td className="py-4.5 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] tracking-tight">
                        {p.offer}
                      </span>
                    </td>

                    {/* Availability Capsule */}
                    <td className="py-4.5 px-6">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#F43F5E]">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                          {p.availability}
                        </span>
                      )}
                    </td>

                    {/* Status Capsule */}
                    <td className="py-4.5 px-6">
                      {isDraft ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B]">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                          {p.status}
                        </span>
                      )}
                    </td>

                    {/* Action Icons */}
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(p)}
                          className="p-1 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenDelete(p)}
                          className="p-1 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
