import React from 'react';
import { Eye, Pencil, Globe, EyeOff, Trash2 } from 'lucide-react';
import type { ContentItem } from '../../../pages/adminPages/ContentManagement';

interface ContentTableProps {
  items: ContentItem[];
  activeCategory: 'Recipes' | 'Activities';
  onView: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (item: ContentItem) => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  items,
  activeCategory,
  onView,
  onEdit,
  onTogglePublish,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
              <th className="py-4 px-6">{activeCategory === 'Recipes' ? 'Recipe' : 'Activity'}</th>
              <th className="py-4 px-6">Meal Type</th>
              <th className="py-4 px-6">Age Group</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Last updated</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No items found matching the selected filters.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Title & Description */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span 
                        className="font-semibold text-slate-900 text-sm leading-tight cursor-pointer hover:text-[#0E4F5A] transition-colors"
                        onClick={() => onView(item)}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                        {item.description}
                      </span>
                    </div>
                  </td>

                  {/* Meal Type Pill */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E2ECEE] text-[#062E35]">
                      {item.mealType}
                    </span>
                  </td>

                  {/* Age Group */}
                  <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                    {item.ageGroup}
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-6">
                    {item.status === 'Published' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="py-4 px-6 text-xs text-slate-500 font-normal">
                    {item.lastUpdated}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      {/* View Preview */}
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit Item */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit content"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Publish State */}
                      <button
                        type="button"
                        onClick={() => onTogglePublish(item.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          item.status === 'Published'
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                        title={item.status === 'Published' ? 'Unpublish to Draft' : 'Publish live'}
                      >
                        {item.status === 'Published' ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete item"
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
    </div>
  );
};
