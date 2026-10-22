import React from 'react';
import { Eye, Pencil, Globe, EyeOff, Trash2, Clock, FileText } from 'lucide-react';
import type { ContentItem } from '../../../redux';

interface ContentTableProps {
  items: ContentItem[];
  isLoading?: boolean;
  onView: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (item: ContentItem) => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  items,
  isLoading = false,
  onView,
  onEdit,
  onTogglePublish,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-700 bg-slate-50/50">
              <th className="py-4 px-6">Article</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Author</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Last updated</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-xl bg-slate-200 shrink-0" />
                      <div className="flex flex-col gap-2 min-w-0 max-w-sm w-full">
                        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                        <div className="h-3 bg-slate-100 rounded-md w-full" />
                        <div className="h-2.5 bg-slate-100 rounded-md w-1/4" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0" />
                      <div className="h-3.5 w-20 bg-slate-200 rounded" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-16 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-20 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-8 w-24 bg-slate-100 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-400 text-xs">
                  No articles found in the database.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const authorName = item.author?.name || 'Unknown Author';
                const authorInitial = authorName.charAt(0).toUpperCase() || 'A';
                const formattedDate = item.lastUpdated || (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Article Thumbnail & Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-13 h-13 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400 border border-slate-200">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 max-w-sm">
                          <span 
                            className="font-semibold text-slate-900 text-sm leading-tight cursor-pointer hover:text-[#062E35] transition-colors truncate"
                            onClick={() => onView(item)}
                            title={item.title}
                          >
                            {item.title}
                          </span>
                          {item.description && (
                            <span className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {item.description}
                            </span>
                          )}
                          {item.readTime && (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mt-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{item.readTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E2ECEE] text-[#062E35]">
                        {item.category || 'General'}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        {item.author?.avatar ? (
                          <img
                            src={item.author.avatar}
                            alt={authorName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {authorInitial}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-800 leading-tight">
                            {authorName}
                          </span>
                          {item.author?.role && (
                            <span className="text-[10px] text-slate-400 leading-tight">
                              {item.author.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Publication Status */}
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
                      {formattedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* View Preview */}
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View article details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Item */}
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit article"
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
                          title="Delete article"
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
